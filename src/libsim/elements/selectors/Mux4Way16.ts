import { CompoundDevice } from '@/libsim/Devices'
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

  init (): void {
    this.linkBuses(this.inA, this.muxAB.inA)
    this.linkBuses(this.inB, this.muxAB.inB)
    this.linkPins(this.sel.pins[0], this.muxAB.sel)

    this.linkBuses(this.inC, this.muxCD.inA)
    this.linkBuses(this.inD, this.muxCD.inB)
    this.linkPins(this.sel.pins[0], this.muxCD.sel)

    this.linkBuses(this.muxAB.out, this.mux.inA)
    this.linkBuses(this.muxCD.out, this.mux.inB)
    this.linkPins(this.sel.pins[1], this.mux.sel)

    this.linkBuses(this.mux.out, this.out)
  }
}
