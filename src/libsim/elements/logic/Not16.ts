import { CompoundDevice, Device, DevicePins, inBus, outBus } from '@/libsim/Devices'
import { Engine } from '@/libsim/Engine'

import _ from 'lodash'
import { Not } from '@/libsim/elements/logic/Not'
import { Bus16 } from '@/libsim/Buses'

export class Not16 extends CompoundDevice {
  readonly in: Bus16
  readonly out: Bus16
  private readonly nots: Array<Not>

  constructor (engine: Engine, name: string, device?: Device) {
    super(engine, name, device)

    this.in = new Bus16(engine, 'in', this)
    this.out = new Bus16(engine, 'out', this)

    this.nots = _.times(16, n => new Not(engine, `not-${n + 1}`, this))

    engine.linkBuses(
      this.in,
      this.nots.map(a => a.in)
    )

    engine.linkBuses(
      this.nots.map(a => a.out),
      this.out
    )
  }

  getDevices (): Array<Device> {
    return this.nots
  }

  getPins (): DevicePins {
    return [
      ...inBus(this.in),
      ...outBus(this.out)
    ]
  }
}
