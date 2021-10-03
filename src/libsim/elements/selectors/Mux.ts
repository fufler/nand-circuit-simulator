import { CompoundDevice } from '@/libsim/Devices'
import { Or } from '@/libsim/elements/logic/Or'
import { And } from '@/libsim/elements/logic/And'
import { Not } from '@/libsim/elements/logic/Not'

export class Mux extends CompoundDevice {
  readonly inA = this.makeInPin('inA')
  readonly inB = this.makeInPin('inB')
  readonly sel = this.makeInPin('sel')
  readonly out = this.makeOutPin('out')

  private readonly or = this.makeDevice(Or, 'or')
  private readonly not = this.makeDevice(Not, 'not')
  private readonly andA = this.makeDevice(And, 'andA')
  private readonly andB = this.makeDevice(And, 'andB')

  init (): void {
    this.linkPins(this.sel, this.not.in)

    this.linkPins(this.inA, this.andA.inA)
    this.linkPins(this.not.out, this.andA.inB)

    this.linkPins(this.inB, this.andB.inB)
    this.linkPins(this.sel, this.andB.inA)

    this.linkPins(this.andA.out, this.or.inA)
    this.linkPins(this.andB.out, this.or.inB)
    this.linkPins(this.or.out, this.out)
  }
}
