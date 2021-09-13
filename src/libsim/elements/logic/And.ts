import { Device } from '@/libsim/Devices'
import { Engine } from '@/libsim/Engine'
import { Nand } from '@/libsim/elements/logic/Nand'
import { Not } from '@/libsim/elements/logic/Not'
import { BinaryLogicDevice } from '@/libsim/elements/logic/LogicDevices'

export class And extends BinaryLogicDevice {
    private readonly nand: Nand
    private readonly not: Not

    constructor (engine: Engine, name: string, device?: Device) {
      super(engine, name, device)

      this.nand = new Nand(engine, 'nand', this)
      this.not = new Not(engine, 'not', this)

      this.engine.linkPins(this.inA, this.nand.inA)
      this.engine.linkPins(this.inB, this.nand.inB)
      this.engine.linkPins(this.nand.out, this.not.in)
      this.engine.linkPins(this.not.out, this.out)
    }

    getDevices (): Array<Device> {
      return [this.nand, this.not]
    }
}
