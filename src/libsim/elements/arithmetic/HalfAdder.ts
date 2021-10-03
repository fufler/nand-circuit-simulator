import { CompoundDevice } from '@/libsim/Devices'
import { Xor } from '@/libsim/elements/logic/Xor'
import { And } from '@/libsim/elements/logic/And'

export class HalfAdder extends CompoundDevice {
  readonly inA = this.makeInPin('inA')
  readonly inB = this.makeInPin('inB')
  readonly outSum = this.makeOutPin('outSum')
  readonly outCarry = this.makeOutPin('outCarry')

  private readonly and = this.makeDevice(And, 'and')
  private readonly xor = this.makeDevice(Xor, 'xor')

  init (): void {
    this.linkPins(this.inA, this.and.inA)
    this.linkPins(this.inB, this.and.inB)
    this.linkPins(this.and.out, this.outCarry)

    this.linkPins(this.inA, this.xor.inA)
    this.linkPins(this.inB, this.xor.inB)
    this.linkPins(this.xor.out, this.outSum)
  }
}
