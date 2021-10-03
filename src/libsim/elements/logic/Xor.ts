import { Compound2In1OutDevice, Device } from '@/libsim/Devices'
import { Engine } from '@/libsim/Engine'
import { Nand } from '@/libsim/elements/logic/Nand'

export class Xor extends Compound2In1OutDevice {
  private readonly nandAB = this.makeDevice(Nand, 'nandAB')
  private readonly nandA = this.makeDevice(Nand, 'nandA')
  private readonly nandB = this.makeDevice(Nand, 'nandB')
  private readonly nand = this.makeDevice(Nand, 'nand')

  constructor (engine: Engine, name: string, device?: Device) {
    super(engine, name, device)

    this.engine.linkPins(this.inA, this.nandAB.inA)
    this.engine.linkPins(this.inB, this.nandAB.inB)

    this.engine.linkPins(this.inA, this.nandA.inA)
    this.engine.linkPins(this.nandAB.out, this.nandA.inB)

    this.engine.linkPins(this.inB, this.nandB.inB)
    this.engine.linkPins(this.nandAB.out, this.nandB.inA)

    this.engine.linkPins(this.nandA.out, this.nand.inA)
    this.engine.linkPins(this.nandB.out, this.nand.inB)

    this.engine.linkPins(this.nand.out, this.out)
  }
}
