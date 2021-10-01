import { Compound2In1OutDevice, Device } from '@/libsim/Devices'
import { Engine } from '@/libsim/Engine'
import { Nand } from '@/libsim/elements/logic/Nand'
import { Not } from '@/libsim/elements/logic/Not'

export class Or extends Compound2In1OutDevice {
    private readonly nand: Nand
    private readonly notA: Not
    private readonly notB: Not

    constructor (engine: Engine, name: string, device?: Device) {
      super(engine, name, device)

      this.nand = new Nand(engine, 'nand', this)
      this.notA = new Not(engine, 'notA', this)
      this.notB = new Not(engine, 'notB', this)

      this.engine.linkPins(this.inA, this.notA.in)
      this.engine.linkPins(this.inB, this.notB.in)

      this.engine.linkPins(this.notA.out, this.nand.inA)
      this.engine.linkPins(this.notB.out, this.nand.inB)

      this.engine.linkPins(this.nand.out, this.out)
    }

    getDevices (): Array<Device> {
      return [this.nand, this.notA, this.notB]
    }
}
