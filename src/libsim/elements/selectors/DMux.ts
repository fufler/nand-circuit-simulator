import { CompoundDevice, Device } from '@/libsim/Devices'
import { Engine } from '@/libsim/Engine'
import { And } from '@/libsim/elements/logic/And'
import { Not } from '@/libsim/elements/logic/Not'

export class DMux extends CompoundDevice {
  readonly in = this.makeInPin('in')
  readonly sel = this.makeInPin('sel')
  readonly outA = this.makeOutPin('outA')
  readonly outB = this.makeOutPin('outB')

  private readonly not = this.makeDevice(Not, 'not')
  private readonly andA = this.makeDevice(And, 'andA')
  private readonly andB = this.makeDevice(And, 'andB')

  constructor (engine: Engine, name: string, device?: Device) {
    super(engine, name, device)

    engine.linkPins(this.sel, this.not.in)

    engine.linkPins(this.in, this.andA.inA)
    engine.linkPins(this.not.out, this.andA.inB)

    engine.linkPins(this.in, this.andB.inB)
    engine.linkPins(this.sel, this.andB.inA)

    engine.linkPins(this.andA.out, this.outA)
    engine.linkPins(this.andB.out, this.outB)
  }
}
