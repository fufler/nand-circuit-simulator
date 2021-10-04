import { Compound2In1OutDevice } from '@/libsim/Devices'
import { Nand } from '@/libsim/elements/logic/Nand'

export class Xor extends Compound2In1OutDevice {
  private readonly nandAB = this.makeDevice(Nand, 'nandAB')
  private readonly nandA = this.makeDevice(Nand, 'nandA')
  private readonly nandB = this.makeDevice(Nand, 'nandB')
  private readonly nand = this.makeDevice(Nand, 'nand')

  init (): void {
    this.link(this.inA, this.nandAB.inA)
    this.link(this.inB, this.nandAB.inB)

    this.link(this.inA, this.nandA.inA)
    this.link(this.nandAB.out, this.nandA.inB)

    this.link(this.inB, this.nandB.inB)
    this.link(this.nandAB.out, this.nandB.inA)

    this.link(this.nandA.out, this.nand.inA)
    this.link(this.nandB.out, this.nand.inB)

    this.link(this.nand.out, this.out)
  }
}
