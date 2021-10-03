import { CompoundDevice, Device } from '@/libsim/Devices'
import { Engine } from '@/libsim/Engine'
import { Xor } from '@/libsim/elements/logic/Xor'
import { And } from '@/libsim/elements/logic/And'

export class HalfAdder extends CompoundDevice {
  readonly inA = this.makeInPin('inA')
  readonly inB = this.makeInPin('inB')
  readonly outSum = this.makeOutPin('outSum')
  readonly outCarry = this.makeOutPin('outCarry')

  private readonly and = this.makeDevice(And, 'and')
  private readonly xor = this.makeDevice(Xor, 'xor')

  constructor (engine: Engine, name: string, device?: Device) {
    super(engine, name, device)

    this.engine.linkPins(this.inA, this.and.inA)
    this.engine.linkPins(this.inB, this.and.inB)
    this.engine.linkPins(this.and.out, this.outCarry)

    this.engine.linkPins(this.inA, this.xor.inA)
    this.engine.linkPins(this.inB, this.xor.inB)
    this.engine.linkPins(this.xor.out, this.outSum)
  }
}
