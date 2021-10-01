import { CompoundDevice, Device, DevicePins, inBus, internalPin, outBus } from '@/libsim/Devices'
import { Engine } from '@/libsim/Engine'
import { FalsePin, TruePin } from '@/libsim/Pins'

import _ from 'lodash'
import { Bus16 } from '@/libsim/Buses'
import { Adder16 } from '@/libsim/elements/arithmetic/Adder16'

export class Incrementer16 extends CompoundDevice {
  readonly in: Bus16
  readonly out: Bus16

  private readonly falsePin: FalsePin
  private readonly truePin: TruePin

  private readonly adder: Adder16

  constructor (engine: Engine, name: string, device?: Device) {
    super(engine, name, device)

    this.falsePin = new FalsePin(engine, 'false', this)
    this.truePin = new TruePin(engine, 'true', this)

    this.in = new Bus16(engine, 'in', this)
    this.out = new Bus16(engine, 'out', this)

    this.adder = new Adder16(engine, 'adder', this)

    engine.linkBuses(
      this.in,
      this.adder.inA
    )

    engine.linkBuses(
      this.adder.out,
      this.out
    )

    engine.linkBuses(
      [
        this.truePin,
        ..._.times(15, () => this.falsePin)
      ],
      this.adder.inB
    )
  }

  getDevices (): Array<Device> {
    return [this.adder]
  }

  getPins (): DevicePins {
    return [
      internalPin(this.truePin),
      internalPin(this.falsePin),
      ...inBus(this.in),
      ...outBus(this.out)
    ]
  }
}
