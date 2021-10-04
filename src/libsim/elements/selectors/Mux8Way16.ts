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
    this.link(this.inA, this.muxABCD.inA)
    this.link(this.inB, this.muxABCD.inB)
    this.link(this.inC, this.muxABCD.inC)
    this.link(this.inD, this.muxABCD.inD)

    this.link(
      this.sel.pins.slice(0, 2),
      this.muxABCD.sel
    )

    this.link(this.inE, this.muxEFGH.inA)
    this.link(this.inF, this.muxEFGH.inB)
    this.link(this.inG, this.muxEFGH.inC)
    this.link(this.inH, this.muxEFGH.inD)

    this.link(
      this.sel.pins.slice(0, 2),
      this.muxEFGH.sel
    )

    this.link(this.muxABCD.out, this.mux.inA)
    this.link(this.muxEFGH.out, this.mux.inB)

    this.link(this.sel.pins[2], this.mux.sel)

    this.link(this.mux.out, this.out)
  }
}
