import { CompoundDevice } from '@/libsim/Devices'
import { And } from '@/libsim/elements/logic/And'
import { Not } from '@/libsim/elements/logic/Not'

export class DMux extends CompoundDevice {
  readonly in = this.makeInPin('in')
  readonly sel = this.makeInPin('sel')
  readonly outA = this.makeOutPin('outA')
  readonly outB = this.makeOutPin('outB')

  private readonly not = this.makeDevice(Not, 'not')
  private readonly andA = this.makeDevice(And, 'andA')
  private readonly andB = this.makeDevice(And, 'andB')

  init (): void {
    this.link(this.sel, this.not.in)

    this.link(this.in, this.andA.inA)
    this.link(this.not.out, this.andA.inB)

    this.link(this.in, this.andB.inB)
    this.link(this.sel, this.andB.inA)

    this.link(this.andA.out, this.outA)
    this.link(this.andB.out, this.outB)
  }
}
