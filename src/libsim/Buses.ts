import { Pin } from '@/libsim/Pins'
import { Engine } from '@/libsim/Engine'
import { Device } from '@/libsim/Devices'

import { v4 } from 'uuid'

import _ from 'lodash'

export type PinBus = Array<Pin>

export class Bus {
  readonly pins: PinBus

  readonly name: string

  constructor (length: number, engine: Engine, name?: string, device?: Device) {
    const busName = name ?? `bus-${v4()}`
    this.name = busName

    this.pins = _.times(length, n => new Pin(engine, `${busName}-${n}`, device))
  }
}
