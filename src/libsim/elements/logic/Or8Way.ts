import { CompoundDevice, Device } from '@/libsim/Devices'
import { Engine } from '@/libsim/Engine'
import { Or } from '@/libsim/elements/logic/Or'

export class Or8Way extends CompoundDevice {
  readonly in = this.makeInBus(8, 'in')
  readonly out = this.makeOutPin('out')

  private readonly ors = this.makeDevices(7, Or, 'or')

  constructor (engine: Engine, name: string, device?: Device) {
    super(engine, name, device)

    engine.linkPins(this.in.pins[0], this.ors[0].inA)
    engine.linkPins(this.in.pins[1], this.ors[0].inB)

    engine.linkBuses(
      this.in.pins.slice(2),
      this.ors.slice(1).map(o => o.inB)
    )

    engine.linkBuses(
      this.ors.slice(0, 6).map(o => o.out),
      this.ors.slice(1).map(o => o.inA)
    )

    engine.linkPins(this.ors[6].out, this.out)
  }
}
