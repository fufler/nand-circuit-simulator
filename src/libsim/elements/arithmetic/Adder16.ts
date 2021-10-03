import { Compound2In1OutDevice16 } from '@/libsim/Devices'

import { FullAdder } from '@/libsim/elements/arithmetic/FullAdder'

export class Adder16 extends Compound2In1OutDevice16 {
  private readonly fullAdders = this.makeDevices(16, FullAdder, 'fullAdder')
  private readonly falsePin = this.makeFalsePin('false')

  init (): void {
    this.linkPins(this.falsePin, this.fullAdders[0].inC)

    this.linkBuses(
      this.inA,
      this.fullAdders.map(fa => fa.inA)
    )

    this.linkBuses(
      this.inB,
      this.fullAdders.map(fa => fa.inB)
    )

    this.linkBuses(
      this.fullAdders.map(fa => fa.outSum),
      this.out
    )

    this.linkBuses(
      this.fullAdders.map(fa => fa.outCarry).slice(0, 15),
      this.fullAdders.map(fa => fa.inC).slice(1)
    )
  }
}
