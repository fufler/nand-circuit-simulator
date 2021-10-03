import { Compound2In1OutDevice } from '@/libsim/Devices'
import { Nand } from '@/libsim/elements/logic/Nand'

export class Xor extends Compound2In1OutDevice {
  private readonly nandAB = this.makeDevice(Nand, 'nandAB')
  private readonly nandA = this.makeDevice(Nand, 'nandA')
  private readonly nandB = this.makeDevice(Nand, 'nandB')
  private readonly nand = this.makeDevice(Nand, 'nand')

  init (): void {
    this.linkPins(this.inA, this.nandAB.inA)
    this.linkPins(this.inB, this.nandAB.inB)

    this.linkPins(this.inA, this.nandA.inA)
    this.linkPins(this.nandAB.out, this.nandA.inB)

    this.linkPins(this.inB, this.nandB.inB)
    this.linkPins(this.nandAB.out, this.nandB.inA)

    this.linkPins(this.nandA.out, this.nand.inA)
    this.linkPins(this.nandB.out, this.nand.inB)

    this.linkPins(this.nand.out, this.out)
  }
}
