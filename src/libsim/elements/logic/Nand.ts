import { Engine } from '@/libsim/Engine'
import { Pin, Signal, UpdatablePin } from '@/libsim/Pins'
import { CustomLogicDevice, Device, DevicePins, inPin, outPin } from '@/libsim/Devices'

export class Nand extends CustomLogicDevice {
    readonly inA: Pin
    readonly inB: Pin
    readonly out: UpdatablePin

    constructor (engine: Engine, name: string, device?: Device) {
      super(engine, name, device)

      this.inA = new Pin(engine, 'inA', this)
      this.inB = new Pin(engine, 'inB', this)
      this.out = new UpdatablePin(engine, 'out', this)
    }

    propagate (): boolean {
      const a = this.inA.getSignal()
      const b = this.inB.getSignal()

      this.out.setSignal(a === Signal.LOW || b === Signal.LOW || a !== b ? Signal.HIGH : Signal.LOW)

      return false
    }

    getPins (): DevicePins {
      return [
        inPin(this.inA),
        inPin(this.inB),
        outPin(this.out)
      ]
    }
}
