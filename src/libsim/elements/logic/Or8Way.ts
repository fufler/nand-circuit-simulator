import { CompoundDevice, Device, DevicePins, inBus, outPin } from '@/libsim/Devices'
import { Engine } from '@/libsim/Engine'
import { Bus8 } from '@/libsim/Buses'
import { Pin } from '@/libsim/Pins'
import { Or } from '@/libsim/elements/logic/Or'

import _ from 'lodash'

export class Or8Way extends CompoundDevice {
  readonly in: Bus8
  readonly out: Pin

  private readonly ors: Array<Or>

  constructor (engine: Engine, name: string, device?: Device) {
    super(engine, name, device)

    this.in = new Bus8(engine, 'in', this)
    this.out = new Pin(engine, 'out', this)

    this.ors = _.times(7, n => new Or(engine, `or-${n + 1}`, this))

    engine.linkPins(this.in.pins[0], this.ors[0].inA)
    engine.linkPins(this.in.pins[1], this.ors[0].inB)

    engine.linkBuses(
      this.in.pins.slice(2),
      this.ors.slice(1).map(o => o.inB)
    )

    engine.linkBuses(
      this.ors.slice(0, 6).map(o => o.out),
      this.ors.slice(1).map(o => o.inA)
    )

    engine.linkPins(this.ors[6].out, this.out)
  }

  getDevices (): Array<Device> {
    return this.ors
  }

  getPins (): DevicePins {
    return [
      ...inBus(this.in),
      outPin(this.out)
    ]
  }
}
