import { Compound2In1OutDevice16, Device } from '@/libsim/Devices'
import { Engine } from '@/libsim/Engine'
import { Or } from '@/libsim/elements/logic/Or'

export class Or16 extends Compound2In1OutDevice16 {
  private readonly ors = this.makeDevices(16, Or, 'or')

  constructor (engine: Engine, name: string, device?: Device) {
    super(engine, name, device)

    engine.linkBuses(
      this.inA,
      this.ors.map(a => a.inA)
    )

    engine.linkBuses(
      this.inB,
      this.ors.map(a => a.inB)
    )

    engine.linkBuses(
      this.ors.map(a => a.out),
      this.out
    )
  }
}
