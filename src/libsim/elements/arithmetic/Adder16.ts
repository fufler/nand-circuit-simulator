import { Compound2In1OutDevice16, Device } from '@/libsim/Devices'
import { Engine } from '@/libsim/Engine'

import { FullAdder } from '@/libsim/elements/arithmetic/FullAdder'

export class Adder16 extends Compound2In1OutDevice16 {
  private readonly fullAdders = this.makeDevices(16, FullAdder, 'fullAdder')
  private readonly falsePin = this.makeFalsePin('false')

  constructor (engine: Engine, name: string, device?: Device) {
    super(engine, name, device)

    engine.linkPins(this.falsePin, this.fullAdders[0].inC)

    engine.linkBuses(
      this.inA,
      this.fullAdders.map(fa => fa.inA)
    )

    engine.linkBuses(
      this.inB,
      this.fullAdders.map(fa => fa.inB)
    )

    engine.linkBuses(
      this.fullAdders.map(fa => fa.outSum),
      this.out
    )

    engine.linkBuses(
      this.fullAdders.map(fa => fa.outCarry).slice(0, 15),
      this.fullAdders.map(fa => fa.inC).slice(1)
    )
  }
}
