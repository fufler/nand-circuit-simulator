import { CompoundDevice } from '@/libsim/Devices'
import { Or } from '@/libsim/elements/logic/Or'

import { Or8Way } from '@/libsim/elements/logic/Or8Way'

export class Or16Way extends CompoundDevice {
  readonly in = this.makeInBus(16, 'in')
  readonly out = this.makeOutPin('out')

  private readonly orHigh = this.makeDevice(Or8Way, 'orHigh')
  private readonly orLow = this.makeDevice(Or8Way, 'orLow')
  private readonly or = this.makeDevice(Or, 'or')

  init (): void {
    this.linkBuses(
      this.in.pins.slice(0, 8),
      this.orLow.in
    )

    this.linkBuses(
      this.in.pins.slice(8),
      this.orHigh.in
    )

    this.linkPins(this.orLow.out, this.or.inA)
    this.linkPins(this.orHigh.out, this.or.inB)

    this.linkPins(this.or.out, this.out)
  }
}
