import { CompoundDevice, Device } from '@/libsim/Devices'
import { Engine } from '@/libsim/Engine'
import { Mux16 } from '@/libsim/elements/selectors/Mux16'
import { Mux4Way16 } from '@/libsim/elements/selectors/Mux4Way16'

export class Mux8Way16 extends CompoundDevice {
  readonly inA = this.makeInBus(16, 'inA')
  readonly inB = this.makeInBus(16, 'inB')
  readonly inC = this.makeInBus(16, 'inC')
  readonly inD = this.makeInBus(16, 'inD')
  readonly inE = this.makeInBus(16, 'inE')
  readonly inF = this.makeInBus(16, 'inF')
  readonly inG = this.makeInBus(16, 'inG')
  readonly inH = this.makeInBus(16, 'inH')
  readonly sel = this.makeInBus(3, 'sel')
  readonly out = this.makeOutBus(16, 'out')

  private readonly muxABCD = this.makeDevice(Mux4Way16, 'muxABCD')
  private readonly muxEFGH = this.makeDevice(Mux4Way16, 'muxEFGH')
  private readonly mux = this.makeDevice(Mux16, 'mux')

  constructor (engine: Engine, name: string, device?: Device) {
    super(engine, name, device)

    engine.linkBuses(this.inA, this.muxABCD.inA)
    engine.linkBuses(this.inB, this.muxABCD.inB)
    engine.linkBuses(this.inC, this.muxABCD.inC)
    engine.linkBuses(this.inD, this.muxABCD.inD)

    engine.linkBuses(
      this.sel.pins.slice(0, 2),
      this.muxABCD.sel
    )

    engine.linkBuses(this.inE, this.muxEFGH.inA)
    engine.linkBuses(this.inF, this.muxEFGH.inB)
    engine.linkBuses(this.inG, this.muxEFGH.inC)
    engine.linkBuses(this.inH, this.muxEFGH.inD)

    engine.linkBuses(
      this.sel.pins.slice(0, 2),
      this.muxEFGH.sel
    )

    engine.linkBuses(this.muxABCD.out, this.mux.inA)
    engine.linkBuses(this.muxEFGH.out, this.mux.inB)

    engine.linkPins(this.sel.pins[2], this.mux.sel)

    engine.linkBuses(this.mux.out, this.out)
  }
}
