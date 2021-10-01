import { Device } from '@/libsim/Devices'
import { BinaryLogicDevice16 } from '@/libsim/elements/logic/LogicDevices'
import { Engine } from '@/libsim/Engine'

import _ from 'lodash'
import { Or } from '@/libsim/elements/logic/Or'

export class Or16 extends BinaryLogicDevice16 {
  private readonly ors: Array<Or>

  constructor (engine: Engine, name: string, device?: Device) {
    super(engine, name, device)

    this.ors = _.times(16, n => new Or(engine, `or-${n + 1}`, this))

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

  getDevices (): Array<Device> {
    return this.ors
  }
}
