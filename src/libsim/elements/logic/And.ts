import { Compound2In1OutDevice } from '@/libsim/Devices'
import { Nand } from '@/libsim/elements/logic/Nand'
import { Not } from '@/libsim/elements/logic/Not'

export class And extends Compound2In1OutDevice {
  private readonly nand = this.makeDevice(Nand, 'nand')
  private readonly not = this.makeDevice(Not, 'not')

  init (): void {
    this.linkPins(this.inA, this.nand.inA)
    this.linkPins(this.inB, this.nand.inB)
    this.linkPins(this.nand.out, this.not.in)
    this.linkPins(this.not.out, this.out)
  }
}
