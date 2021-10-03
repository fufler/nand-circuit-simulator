import { CompoundDevice, Device } from '@/libsim/Devices'
import { Engine } from '@/libsim/Engine'
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

  constructor (engine: Engine, name: string, device?: Device) {
    super(engine, name, device)

    engine.linkPins(this.in, this.dmux.in)
    engine.linkPins(this.sel.pins[1], this.dmux.sel)

    engine.linkPins(this.dmux.outA, this.dmuxAB.in)
    engine.linkPins(this.dmux.outB, this.dmuxCD.in)

    engine.linkPins(this.sel.pins[0], this.dmuxAB.sel)
    engine.linkPins(this.sel.pins[0], this.dmuxCD.sel)

    engine.linkPins(this.dmuxAB.outA, this.outA)
    engine.linkPins(this.dmuxAB.outB, this.outB)
    engine.linkPins(this.dmuxCD.outA, this.outC)
    engine.linkPins(this.dmuxCD.outB, this.outD)
  }
}
