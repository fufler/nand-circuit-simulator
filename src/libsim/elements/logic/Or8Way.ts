import { CompoundDevice } from '@/libsim/Devices'
import { Or } from '@/libsim/elements/logic/Or'

export class Or8Way extends CompoundDevice {
  readonly in = this.makeInBus(8, 'in')
  readonly out = this.makeOutPin('out')

  private readonly ors = this.makeDevices(7, Or, 'or')

  init (): void {
    this.link(this.in.pins[0], this.ors[0].inA)
    this.link(this.in.pins[1], this.ors[0].inB)

    this.link(
      this.in.pins.slice(2),
      this.ors.slice(1).map(o => o.inB)
    )

    this.link(
      this.ors.slice(0, 6).map(o => o.out),
      this.ors.slice(1).map(o => o.inA)
    )

    this.link(this.ors[6].out, this.out)
  }
}
