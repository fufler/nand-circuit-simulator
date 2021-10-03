import { CompoundDevice } from '@/libsim/Devices'
import { Or } from '@/libsim/elements/logic/Or'

export class Or8Way extends CompoundDevice {
  readonly in = this.makeInBus(8, 'in')
  readonly out = this.makeOutPin('out')

  private readonly ors = this.makeDevices(7, Or, 'or')

  init (): void {
    this.linkPins(this.in.pins[0], this.ors[0].inA)
    this.linkPins(this.in.pins[1], this.ors[0].inB)

    this.linkBuses(
      this.in.pins.slice(2),
      this.ors.slice(1).map(o => o.inB)
    )

    this.linkBuses(
      this.ors.slice(0, 6).map(o => o.out),
      this.ors.slice(1).map(o => o.inA)
    )

    this.linkPins(this.ors[6].out, this.out)
  }
}
