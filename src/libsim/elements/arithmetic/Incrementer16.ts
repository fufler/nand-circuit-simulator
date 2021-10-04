import { CompoundDevice } from '@/libsim/Devices'

import _ from 'lodash'
import { Adder16 } from '@/libsim/elements/arithmetic/Adder16'

export class Incrementer16 extends CompoundDevice {
  readonly in = this.makeInBus(16, 'in')
  readonly out = this.makeOutBus(16, 'out')

  private readonly falsePin = this.makeFalsePin('falsePin')
  private readonly truePin = this.makeTruePin('truePin')

  private readonly adder = this.makeDevice(Adder16, 'adder')

  init (): void {
    this.link(
      this.in,
      this.adder.inA
    )

    this.link(
      this.adder.out,
      this.out
    )

    this.link(
      [
        this.truePin,
        ..._.times(15, () => this.falsePin)
      ],
      this.adder.inB
    )
  }
}
