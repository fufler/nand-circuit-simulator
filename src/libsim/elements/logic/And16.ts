import { Compound2In1OutDevice16, Device } from '@/libsim/Devices'
import { Engine } from '@/libsim/Engine'
import { And } from '@/libsim/elements/logic/And'

import _ from 'lodash'

export class And16 extends Compound2In1OutDevice16 {
  private readonly ands: Array<And>

  constructor (engine: Engine, name: string, device?: Device) {
    super(engine, name, device)

    this.ands = _.times(16, n => new And(engine, `and-${n + 1}`, this))

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

  getDevices (): Array<Device> {
    return this.ands
  }
}
