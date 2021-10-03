import { CompoundDevice } from '@/libsim/Devices'
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

  init (): void {
    this.linkBuses(this.inA, this.muxABCD.inA)
    this.linkBuses(this.inB, this.muxABCD.inB)
    this.linkBuses(this.inC, this.muxABCD.inC)
    this.linkBuses(this.inD, this.muxABCD.inD)

    this.linkBuses(
      this.sel.pins.slice(0, 2),
      this.muxABCD.sel
    )

    this.linkBuses(this.inE, this.muxEFGH.inA)
    this.linkBuses(this.inF, this.muxEFGH.inB)
    this.linkBuses(this.inG, this.muxEFGH.inC)
    this.linkBuses(this.inH, this.muxEFGH.inD)

    this.linkBuses(
      this.sel.pins.slice(0, 2),
      this.muxEFGH.sel
    )

    this.linkBuses(this.muxABCD.out, this.mux.inA)
    this.linkBuses(this.muxEFGH.out, this.mux.inB)

    this.linkPins(this.sel.pins[2], this.mux.sel)

    this.linkBuses(this.mux.out, this.out)
  }
}
