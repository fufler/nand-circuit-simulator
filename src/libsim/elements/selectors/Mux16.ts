import { CompoundDevice } from '@/libsim/Devices'
import { Mux } from '@/libsim/elements/selectors/Mux'

import _ from 'lodash'

export class Mux16 extends CompoundDevice {
  readonly inA = this.makeInBus(16, 'inA')
  readonly inB = this.makeInBus(16, 'inB')
  readonly sel = this.makeInPin('sel')
  readonly out = this.makeOutBus(16, 'out')

  private readonly muxes = this.makeDevices(16, Mux, 'mux')

  init (): void {
    this.link(
      this.inA,
      this.muxes.map(m => m.inA)
    )

    this.link(
      this.inB,
      this.muxes.map(m => m.inB)
    )

    this.link(
      this.muxes.map(m => m.out),
      this.out
    )

    this.link(
      _.times(16, () => this.sel),
      this.muxes.map(m => m.sel)
    )
  }
}
