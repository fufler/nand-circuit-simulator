import { Compound2In1OutDevice } from '@/libsim/Devices'
import { Nand } from '@/libsim/elements/logic/Nand'
import { Not } from '@/libsim/elements/logic/Not'

export class Or extends Compound2In1OutDevice {
  private readonly nand = this.makeDevice(Nand, 'nand')
  private readonly notA = this.makeDevice(Not, 'notA')
  private readonly notB = this.makeDevice(Not, 'notB')

  init (): void {
    this.linkPins(this.inA, this.notA.in)
    this.linkPins(this.inB, this.notB.in)

    this.linkPins(this.notA.out, this.nand.inA)
    this.linkPins(this.notB.out, this.nand.inB)

    this.linkPins(this.nand.out, this.out)
  }
}
