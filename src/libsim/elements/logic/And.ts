import { Compound2In1OutDevice, Device } from '@/libsim/Devices'
import { Engine } from '@/libsim/Engine'
import { Nand } from '@/libsim/elements/logic/Nand'
import { Not } from '@/libsim/elements/logic/Not'

export class And extends Compound2In1OutDevice {
    private readonly nand: Nand
    private readonly not: Not

    constructor (engine: Engine, name: string, device?: Device) {
      super(engine, name, device)

      this.nand = new Nand(engine, 'nand', this)
      this.not = new Not(engine, 'not', this)

      engine.linkPins(this.inA, this.nand.inA)
      engine.linkPins(this.inB, this.nand.inB)
      engine.linkPins(this.nand.out, this.not.in)
      engine.linkPins(this.not.out, this.out)
    }

    getDevices (): Array<Device> {
      return [this.nand, this.not]
    }
}
