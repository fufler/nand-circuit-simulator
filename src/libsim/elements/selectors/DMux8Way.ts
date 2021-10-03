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
    this.linkPins(this.sel.pins[2], this.dmux.sel)

    this.linkPins(this.in, this.dmux.in)
    this.linkPins(this.dmux.outA, this.dmuxABCD.in)
    this.linkPins(this.dmux.outB, this.dmuxEFGH.in)

    this.linkBuses(
      this.sel.pins.slice(0, 2),
      this.dmuxABCD.sel
    )

    this.linkBuses(
      this.sel.pins.slice(0, 2),
      this.dmuxEFGH.sel
    )

    this.linkPins(this.dmuxABCD.outA, this.outA)
    this.linkPins(this.dmuxABCD.outB, this.outB)
    this.linkPins(this.dmuxABCD.outC, this.outC)
    this.linkPins(this.dmuxABCD.outD, this.outD)

    this.linkPins(this.dmuxEFGH.outA, this.outE)
    this.linkPins(this.dmuxEFGH.outB, this.outF)
    this.linkPins(this.dmuxEFGH.outC, this.outG)
    this.linkPins(this.dmuxEFGH.outD, this.outH)
  }
}
