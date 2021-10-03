import { CompoundDevice, Device } from '@/libsim/Devices'
import { Engine } from '@/libsim/Engine'

import _ from 'lodash'
import { Adder16 } from '@/libsim/elements/arithmetic/Adder16'

export class Incrementer16 extends CompoundDevice {
  readonly in = this.makeInBus(16, 'in')
  readonly out = this.makeOutBus(16, 'out')

  private readonly falsePin = this.makeFalsePin('falsePin')
  private readonly truePin = this.makeTruePin('truePin')

  private readonly adder = this.makeDevice(Adder16, 'adder')

  constructor (engine: Engine, name: string, device?: Device) {
    super(engine, name, device)

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
}
