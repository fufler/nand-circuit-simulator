import { Compound2In1OutDevice } from '@/libsim/Devices'
import { Nand } from '@/libsim/elements/logic/Nand'
import { Not } from '@/libsim/elements/logic/Not'

export class And extends Compound2In1OutDevice {
  private readonly nand = this.makeDevice(Nand, 'nand')
  private readonly not = this.makeDevice(Not, 'not')

  init (): void {
    this.link(this.inA, this.nand.inA)
    this.link(this.inB, this.nand.inB)
    this.link(this.nand.out, this.not.in)
    this.link(this.not.out, this.out)
  }
}
