import { Signal } from '@/libsim/Pins'
import { z } from 'zod'
import { InvalidArgumentError } from '@/libsim/Engine'

export interface DeviceDefinition {
  type: string,
  name?: string
  id: string
}

export interface PinDefinition {
  id: string
  name?: string
  signal?: Signal
}

export interface LinkDefinition {
  srcId: string
  dstId: string
}

export interface CircuitDefinition {
  devices: Array<DeviceDefinition>
  pins: Array<PinDefinition>

  links: Array<LinkDefinition>
}

const CircuitDefinitionParseSchema = z.object({
  devices: z.array(
    z.object({
      type: z.string().nonempty(),
      name: z.string().optional(),
      id: z.string().nonempty()
    })
  ).nonempty(),

  pins: z.array(
    z.object({
      id: z.string().nonempty(),
      name: z.string().optional(),
      signal: z.number().lte(Signal.HIGH).gte(Signal.LOW).optional()
    })
  ).nonempty(),

  links: z.array(
    z.object({
      srcId: z.string().nonempty(),
      dstId: z.string().nonempty()
    })
  ).nonempty()
})

export const validateDefinition = (def: unknown): void => {
  try {
    CircuitDefinitionParseSchema.parse(def)
  } catch (e) {
    throw new InvalidArgumentError('Invalid circuit definition')
  }
}

export const parseDefinitionString = (def: string): CircuitDefinition => {
  try {
    return CircuitDefinitionParseSchema.parse(JSON.parse(def))
  } catch {
    throw new InvalidArgumentError('String is not valid circuit definition')
  }
}
