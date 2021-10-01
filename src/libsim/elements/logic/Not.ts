import { CompoundDevice, Device, DevicePins, DevicePinType, inPin, outPin } from '@/libsim/Devices'
import { Engine } from '@/libsim/Engine'
import { Pin } from '@/libsim/Pins'
import { Nand } from '@/libsim/elements/logic/Nand'

export class Not extends CompoundDevice {
    private readonly nand: Nand
    readonly in: Pin
    readonly out: Pin

    constructor (engine: Engine, name: string, device?: Device) {
      super(engine, name, device)

      this.nand = new Nand(engine, 'nand', this)
      this.in = new Pin(engine, 'in', this)
      this.out = new Pin(engine, 'out', this)

      this.engine.linkPins(this.in, this.nand.inA)
      this.engine.linkPins(this.in, this.nand.inB)
      this.engine.linkPins(this.nand.out, this.out)
    }

    getDevices (): Array<Device> {
      return [this.nand]
    }

    getPins (): DevicePins {
      return [
        inPin(this.in),
        outPin(this.out)
      ]
    }
}
