import { Compound2In1OutDevice16 } from '@/libsim/Devices'
import { Or } from '@/libsim/elements/logic/Or'

export class Or16 extends Compound2In1OutDevice16 {
  private readonly ors = this.makeDevices(16, Or, 'or')

  init (): void {
    this.linkBuses(
      this.inA,
      this.ors.map(a => a.inA)
    )

    this.linkBuses(
      this.inB,
      this.ors.map(a => a.inB)
    )

    this.linkBuses(
      this.ors.map(a => a.out),
      this.out
    )
  }
}
