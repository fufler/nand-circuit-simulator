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
    this.link(this.sel, this.not.in)

    this.link(this.inA, this.andA.inA)
    this.link(this.not.out, this.andA.inB)

    this.link(this.inB, this.andB.inB)
    this.link(this.sel, this.andB.inA)

    this.link(this.andA.out, this.or.inA)
    this.link(this.andB.out, this.or.inB)
    this.link(this.or.out, this.out)
  }
}
