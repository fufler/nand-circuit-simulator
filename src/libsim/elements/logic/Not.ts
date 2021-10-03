import { CompoundDevice, Device } from '@/libsim/Devices'
import { Engine } from '@/libsim/Engine'
import { Nand } from '@/libsim/elements/logic/Nand'

export class Not extends CompoundDevice {
  private readonly nand = this.makeDevice(Nand, 'nand')
  readonly in = this.makeInPin('in')
  readonly out = this.makeOutPin('out')

  constructor (engine: Engine, name: string, device?: Device) {
    super(engine, name, device)

    this.engine.linkPins(this.in, this.nand.inA)
    this.engine.linkPins(this.in, this.nand.inB)
    this.engine.linkPins(this.nand.out, this.out)
  }
}
