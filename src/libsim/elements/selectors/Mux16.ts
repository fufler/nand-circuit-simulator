import { CompoundDevice, Device, DevicePins, inBus, inPin, outBus } from '@/libsim/Devices'
import { Pin } from '@/libsim/Pins'
import { Engine } from '@/libsim/Engine'
import { Bus16 } from '@/libsim/Buses'
import { Mux } from '@/libsim/elements/selectors/Mux'

import _ from 'lodash'

export class Mux16 extends CompoundDevice {
  readonly inA: Bus16
  readonly inB: Bus16
  readonly sel: Pin
  readonly out: Bus16

  private readonly muxes: Array<Mux>

  constructor (engine: Engine, name: string, device?: Device) {
    super(engine, name, device)

    this.inA = new Bus16(engine, 'inA', this)
    this.inB = new Bus16(engine, 'inB', this)
    this.sel = new Pin(engine, 'sel', this)
    this.out = new Bus16(engine, 'out', this)

    this.muxes = _.times(16, n => new Mux(engine, `mux-${n + 1}`, this))

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

  getPins (): DevicePins {
    return [
      ...inBus(this.inA),
      ...inBus(this.inB),
      inPin(this.sel),
      ...outBus(this.out)
    ]
  }

  getDevices (): Array<Device> {
    return this.muxes
  }
}
