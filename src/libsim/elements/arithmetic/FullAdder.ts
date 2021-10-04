import { CompoundDevice } from '@/libsim/Devices'
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

  init (): void {
    this.link(this.inA, this.halfAdder1.inA)
    this.link(this.inB, this.halfAdder1.inB)
    this.link(this.halfAdder1.outSum, this.halfAdder2.inA)
    this.link(this.inC, this.halfAdder2.inB)

    this.link(this.halfAdder2.outSum, this.outSum)

    this.link(this.halfAdder1.outCarry, this.or.inA)
    this.link(this.halfAdder2.outCarry, this.or.inB)
    this.link(this.or.out, this.outCarry)
  }
}
