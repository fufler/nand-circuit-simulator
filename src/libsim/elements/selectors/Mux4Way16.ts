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
    this.link(this.inA, this.muxAB.inA)
    this.link(this.inB, this.muxAB.inB)
    this.link(this.sel.pins[0], this.muxAB.sel)

    this.link(this.inC, this.muxCD.inA)
    this.link(this.inD, this.muxCD.inB)
    this.link(this.sel.pins[0], this.muxCD.sel)

    this.link(this.muxAB.out, this.mux.inA)
    this.link(this.muxCD.out, this.mux.inB)
    this.link(this.sel.pins[1], this.mux.sel)

    this.link(this.mux.out, this.out)
  }
}
