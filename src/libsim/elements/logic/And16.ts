import { Compound2In1OutDevice16, Device } from '@/libsim/Devices'
import { Engine } from '@/libsim/Engine'
import { And } from '@/libsim/elements/logic/And'

export class And16 extends Compound2In1OutDevice16 {
  private readonly ands = this.makeDevices(16, And, 'and')

  constructor (engine: Engine, name: string, device?: Device) {
    super(engine, name, device)

    engine.linkBuses(
      this.inA,
      this.ands.map(a => a.inA)
    )

    engine.linkBuses(
      this.inB,
      this.ands.map(a => a.inB)
    )

    engine.linkBuses(
      this.ands.map(a => a.out),
      this.out
    )
  }
}
