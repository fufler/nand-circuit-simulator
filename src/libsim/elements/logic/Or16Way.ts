import { CompoundDevice, Device, DevicePins, inBus, outPin } from '@/libsim/Devices'
import { Engine } from '@/libsim/Engine'
import { Bus16 } from '@/libsim/Buses'
import { Pin } from '@/libsim/Pins'
import { Or } from '@/libsim/elements/logic/Or'

import { Or8Way } from '@/libsim/elements/logic/Or8Way'

export class Or16Way extends CompoundDevice {
  readonly in: Bus16
  readonly out: Pin

  private readonly orHigh: Or8Way
  private readonly orLow: Or8Way
  private readonly or: Or

  constructor (engine: Engine, name: string, device?: Device) {
    super(engine, name, device)

    this.in = new Bus16(engine, 'in', this)
    this.out = new Pin(engine, 'out', this)

    this.orLow = new Or8Way(engine, 'orLow', this)
    this.orHigh = new Or8Way(engine, 'orHigh', this)
    this.or = new Or(engine, 'or', this)

    engine.linkBuses(
      this.in.pins.slice(0, 8),
      this.orLow.in
    )

    engine.linkBuses(
      this.in.pins.slice(8),
      this.orHigh.in
    )

    engine.linkPins(this.orLow.out, this.or.inA)
    engine.linkPins(this.orHigh.out, this.or.inB)

    engine.linkPins(this.or.out, this.out)
  }

  getDevices (): Array<Device> {
    return [this.or, this.orLow, this.orHigh]
  }

  getPins (): DevicePins {
    return [
      ...inBus(this.in),
      outPin(this.out)
    ]
  }
}
