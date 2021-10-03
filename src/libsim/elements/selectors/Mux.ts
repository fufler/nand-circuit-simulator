import { CompoundDevice, Device } from '@/libsim/Devices'
import { Engine } from '@/libsim/Engine'
import { Or } from '@/libsim/elements/logic/Or'
import { And } from '@/libsim/elements/logic/And'
import { Not } from '@/libsim/elements/logic/Not'

export class Mux extends CompoundDevice {
  readonly inA = this.makeInPin('inA')
  readonly inB = this.makeInPin('inB')
  readonly sel = this.makeInPin('sel')
  readonly out = this.makeOutPin('out')

  private readonly or = this.makeDevice(Or, 'or')
  private readonly not = this.makeDevice(Not, 'not')
  private readonly andA = this.makeDevice(And, 'andA')
  private readonly andB = this.makeDevice(And, 'andB')

  constructor (engine: Engine, name: string, device?: Device) {
    super(engine, name, device)

    engine.linkPins(this.sel, this.not.in)

    engine.linkPins(this.inA, this.andA.inA)
    engine.linkPins(this.not.out, this.andA.inB)

    engine.linkPins(this.inB, this.andB.inB)
    engine.linkPins(this.sel, this.andB.inA)

    engine.linkPins(this.andA.out, this.or.inA)
    engine.linkPins(this.andB.out, this.or.inB)
    engine.linkPins(this.or.out, this.out)
  }
}
