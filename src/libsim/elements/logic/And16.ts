import { Compound2In1OutDevice16 } from '@/libsim/Devices'
import { And } from '@/libsim/elements/logic/And'

export class And16 extends Compound2In1OutDevice16 {
  private readonly ands = this.makeDevices(16, And, 'and')

  init (): void {
    this.link(
      this.inA,
      this.ands.map(a => a.inA)
    )

    this.link(
      this.inB,
      this.ands.map(a => a.inB)
    )

    this.link(
      this.ands.map(a => a.out),
      this.out
    )
  }
}
