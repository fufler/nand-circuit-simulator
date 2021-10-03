import { CompoundDevice, Device } from '@/libsim/Devices'
import { Engine } from '@/libsim/Engine'
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

  constructor (engine: Engine, name: string, device?: Device) {
    super(engine, name, device)

    engine.linkPins(this.sel.pins[2], this.dmux.sel)

    engine.linkPins(this.in, this.dmux.in)
    engine.linkPins(this.dmux.outA, this.dmuxABCD.in)
    engine.linkPins(this.dmux.outB, this.dmuxEFGH.in)

    engine.linkBuses(
      this.sel.pins.slice(0, 2),
      this.dmuxABCD.sel
    )

    engine.linkBuses(
      this.sel.pins.slice(0, 2),
      this.dmuxEFGH.sel
    )

    engine.linkPins(this.dmuxABCD.outA, this.outA)
    engine.linkPins(this.dmuxABCD.outB, this.outB)
    engine.linkPins(this.dmuxABCD.outC, this.outC)
    engine.linkPins(this.dmuxABCD.outD, this.outD)

    engine.linkPins(this.dmuxEFGH.outA, this.outE)
    engine.linkPins(this.dmuxEFGH.outB, this.outF)
    engine.linkPins(this.dmuxEFGH.outC, this.outG)
    engine.linkPins(this.dmuxEFGH.outD, this.outH)
  }
}
