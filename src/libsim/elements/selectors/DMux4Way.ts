import { CompoundDevice } from '@/libsim/Devices'
import { DMux } from '@/libsim/elements/selectors/DMux'

export class DMux4Way extends CompoundDevice {
  readonly in = this.makeInPin('in')
  readonly sel = this.makeInBus(2, 'sel')
  readonly outA = this.makeOutPin('outA')
  readonly outB = this.makeOutPin('outB')
  readonly outC = this.makeOutPin('outC')
  readonly outD = this.makeOutPin('outD')

  private readonly dmux = this.makeDevice(DMux, 'dmux')
  private readonly dmuxAB = this.makeDevice(DMux, 'dmuxAB')
  private readonly dmuxCD = this.makeDevice(DMux, 'dmuxCD')

  init (): void {
    this.linkPins(this.in, this.dmux.in)
    this.linkPins(this.sel.pins[1], this.dmux.sel)

    this.linkPins(this.dmux.outA, this.dmuxAB.in)
    this.linkPins(this.dmux.outB, this.dmuxCD.in)

    this.linkPins(this.sel.pins[0], this.dmuxAB.sel)
    this.linkPins(this.sel.pins[0], this.dmuxCD.sel)

    this.linkPins(this.dmuxAB.outA, this.outA)
    this.linkPins(this.dmuxAB.outB, this.outB)
    this.linkPins(this.dmuxCD.outA, this.outC)
    this.linkPins(this.dmuxCD.outB, this.outD)
  }
}
