import { CompoundDevice, Device } from '@/libsim/Devices'
import { Engine } from '@/libsim/Engine'
import { HalfAdder } from '@/libsim/elements/arithmetic/HalfAdder'
import { Or } from '@/libsim/elements/logic/Or'

export class FullAdder extends CompoundDevice {
  readonly inA = this.makeInPin('inA')
  readonly inB = this.makeInPin('inB')
  readonly inC = this.makeInPin('inC')
  readonly outSum = this.makeOutPin('outSum')
  readonly outCarry = this.makeOutPin('outCarry')

  private readonly halfAdder1 = this.makeDevice(HalfAdder, 'halfAdder1')
  private readonly halfAdder2 = this.makeDevice(HalfAdder, 'halfAdder2')
  private readonly or = this.makeDevice(Or, 'or')

  constructor (engine: Engine, name: string, device?: Device) {
    super(engine, name, device)

    engine.linkPins(this.inA, this.halfAdder1.inA)
    engine.linkPins(this.inB, this.halfAdder1.inB)
    engine.linkPins(this.halfAdder1.outSum, this.halfAdder2.inA)
    engine.linkPins(this.inC, this.halfAdder2.inB)

    engine.linkPins(this.halfAdder2.outSum, this.outSum)

    engine.linkPins(this.halfAdder1.outCarry, this.or.inA)
    engine.linkPins(this.halfAdder2.outCarry, this.or.inB)
    engine.linkPins(this.or.out, this.outCarry)
  }
}
