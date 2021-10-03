import { CompoundDevice, Device } from '@/libsim/Devices'
import { Engine } from '@/libsim/Engine'
import { Mux16 } from '@/libsim/elements/selectors/Mux16'

export class Mux4Way16 extends CompoundDevice {
  readonly inA = this.makeInBus(16, 'inA')
  readonly inB = this.makeInBus(16, 'inB')
  readonly inC = this.makeInBus(16, 'inC')
  readonly inD = this.makeInBus(16, 'inD')
  readonly sel = this.makeInBus(2, 'sel')
  readonly out = this.makeOutBus(16, 'out')

  private readonly muxAB = this.makeDevice(Mux16, 'muxAB')
  private readonly muxCD = this.makeDevice(Mux16, 'muxCD')
  private readonly mux = this.makeDevice(Mux16, 'mux')

  constructor (engine: Engine, name: string, device?: Device) {
    super(engine, name, device)

    engine.linkBuses(this.inA, this.muxAB.inA)
    engine.linkBuses(this.inB, this.muxAB.inB)
    engine.linkPins(this.sel.pins[0], this.muxAB.sel)

    engine.linkBuses(this.inC, this.muxCD.inA)
    engine.linkBuses(this.inD, this.muxCD.inB)
    engine.linkPins(this.sel.pins[0], this.muxCD.sel)

    engine.linkBuses(this.muxAB.out, this.mux.inA)
    engine.linkBuses(this.muxCD.out, this.mux.inB)
    engine.linkPins(this.sel.pins[1], this.mux.sel)

    engine.linkBuses(this.mux.out, this.out)
  }
}
