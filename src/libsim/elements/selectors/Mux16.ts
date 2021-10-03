import { CompoundDevice, Device } from '@/libsim/Devices'
import { Engine } from '@/libsim/Engine'
import { Mux } from '@/libsim/elements/selectors/Mux'

import _ from 'lodash'

export class Mux16 extends CompoundDevice {
  readonly inA = this.makeInBus(16, 'inA')
  readonly inB = this.makeInBus(16, 'inB')
  readonly sel = this.makeInPin('sel')
  readonly out = this.makeOutBus(16, 'out')

  private readonly muxes = this.makeDevices(16, Mux, 'mux')

  constructor (engine: Engine, name: string, device?: Device) {
    super(engine, name, device)

    engine.linkBuses(
      this.inA,
      this.muxes.map(m => m.inA)
    )

    engine.linkBuses(
      this.inB,
      this.muxes.map(m => m.inB)
    )

    engine.linkBuses(
      this.muxes.map(m => m.out),
      this.out
    )

    engine.linkBuses(
      _.times(16, () => this.sel),
      this.muxes.map(m => m.sel)
    )
  }
}
