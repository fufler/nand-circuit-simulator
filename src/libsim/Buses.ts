import { Pin } from '@/libsim/Pins'
import { Engine } from '@/libsim/Engine'
import { Device } from '@/libsim/Devices'
import _ from 'lodash'

export type PinBus = Array<Pin>

export class Bus {
  readonly pins: PinBus

  constructor (length: number, engine: Engine, name?: string, device?: Device) {
    this.pins = _.times(length, n => new Pin(engine, `${name ?? 'bus'}-${n}`, device))
  }
}
