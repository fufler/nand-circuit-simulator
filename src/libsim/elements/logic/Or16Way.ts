import { CompoundDevice, Device } from '@/libsim/Devices'
import { Engine } from '@/libsim/Engine'
import { Or } from '@/libsim/elements/logic/Or'

import { Or8Way } from '@/libsim/elements/logic/Or8Way'

export class Or16Way extends CompoundDevice {
  readonly in = this.makeInBus(16, 'in')
  readonly out = this.makeOutPin('out')

  private readonly orHigh = this.makeDevice(Or8Way, 'orHigh')
  private readonly orLow = this.makeDevice(Or8Way, 'orLow')
  private readonly or = this.makeDevice(Or, 'or')

  constructor (engine: Engine, name: string, device?: Device) {
    super(engine, name, device)

    engine.linkBuses(
      this.in.pins.slice(0, 8),
      this.orLow.in
    )

    engine.linkBuses(
      this.in.pins.slice(8),
      this.orHigh.in
    )

    engine.linkPins(this.orLow.out, this.or.inA)
    engine.linkPins(this.orHigh.out, this.or.inB)

    engine.linkPins(this.or.out, this.out)
  }
}
