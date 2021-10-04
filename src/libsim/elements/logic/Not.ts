import { CompoundDevice } from '@/libsim/Devices'
import { Nand } from '@/libsim/elements/logic/Nand'

export class Not extends CompoundDevice {
  private readonly nand = this.makeDevice(Nand, 'nand')
  readonly in = this.makeInPin('in')
  readonly out = this.makeOutPin('out')

  init (): void {
    this.link(this.in, this.nand.inA)
    this.link(this.in, this.nand.inB)
    this.link(this.nand.out, this.out)
  }
}
