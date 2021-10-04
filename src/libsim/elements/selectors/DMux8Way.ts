import { CompoundDevice } from '@/libsim/Devices'
import { DMux } from '@/libsim/elements/selectors/DMux'
import { DMux4Way } from '@/libsim/elements/selectors/DMux4Way'

export class DMux8Way extends CompoundDevice {
  readonly in = this.makeInPin('in')
  readonly sel = this.makeInBus(3, 'sel')
  readonly outA = this.makeOutPin('outA')
  readonly outB = this.makeOutPin('outB')
  readonly outC = this.makeOutPin('outC')
  readonly outD = this.makeOutPin('outD')
  readonly outE = this.makeOutPin('outE')
  readonly outF = this.makeOutPin('outF')
  readonly outG = this.makeOutPin('outG')
  readonly outH = this.makeOutPin('outH')

  private readonly dmux = this.makeDevice(DMux, 'dmux')
  private readonly dmuxABCD = this.makeDevice(DMux4Way, 'dmuxABCD')
  private readonly dmuxEFGH = this.makeDevice(DMux4Way, 'dmuxEFGH')

  init (): void {
    this.link(this.sel.pins[2], this.dmux.sel)

    this.link(this.in, this.dmux.in)
    this.link(this.dmux.outA, this.dmuxABCD.in)
    this.link(this.dmux.outB, this.dmuxEFGH.in)

    this.link(
      this.sel.pins.slice(0, 2),
      this.dmuxABCD.sel
    )

    this.link(
      this.sel.pins.slice(0, 2),
      this.dmuxEFGH.sel
    )

    this.link(this.dmuxABCD.outA, this.outA)
    this.link(this.dmuxABCD.outB, this.outB)
    this.link(this.dmuxABCD.outC, this.outC)
    this.link(this.dmuxABCD.outD, this.outD)

    this.link(this.dmuxEFGH.outA, this.outE)
    this.link(this.dmuxEFGH.outB, this.outF)
    this.link(this.dmuxEFGH.outC, this.outG)
    this.link(this.dmuxEFGH.outD, this.outH)
  }
}
