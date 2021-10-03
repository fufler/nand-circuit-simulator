import { CompoundDevice } from '@/libsim/Devices'
import { Nand } from '@/libsim/elements/logic/Nand'

export class Not extends CompoundDevice {
  private readonly nand = this.makeDevice(Nand, 'nand')
  readonly in = this.makeInPin('in')
  readonly out = this.makeOutPin('out')

  init (): void {
    this.linkPins(this.in, this.nand.inA)
    this.linkPins(this.in, this.nand.inB)
    this.linkPins(this.nand.out, this.out)
  }
}
