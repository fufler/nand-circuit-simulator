import { Compound2In1OutDevice, Device } from '@/libsim/Devices'
import { Engine } from '@/libsim/Engine'
import { Nand } from '@/libsim/elements/logic/Nand'

export class Xor extends Compound2In1OutDevice {
    private readonly nandAB: Nand
    private readonly nandA: Nand
    private readonly nandB: Nand
    private readonly nand: Nand

    constructor (engine: Engine, name: string, device?: Device) {
      super(engine, name, device)

      this.nandAB = new Nand(engine, 'nand-ab', this)
      this.nandA = new Nand(engine, 'nand-a', this)
      this.nandB = new Nand(engine, 'nand-b', this)
      this.nand = new Nand(engine, 'nand', this)

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

    getDevices (): Array<Device> {
      return [this.nand, this.nandAB, this.nandA, this.nandB]
    }
}
