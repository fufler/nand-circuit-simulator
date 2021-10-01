import { Pin } from '@/libsim/Pins'
import { Engine } from '@/libsim/Engine'
import { Device } from '@/libsim/Devices'
import _ from 'lodash'

export type PinBus = Array<Pin>

export interface Bus {
  readonly pins: PinBus
}

export class Bus16 implements Bus {
  readonly pins: Array<Pin>

  constructor (engine: Engine, name?: string, device?: Device) {
    this.pins = _.times(16, n => new Pin(engine, `${name ?? 'bus'}-${n}`, device))
  }
}