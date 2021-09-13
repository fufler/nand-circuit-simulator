import { Engine } from '@/libsim/Engine'
import { Pin, UpdatablePin, Signal } from '@/libsim/Pins'
import { CustomLogicDevice, Device } from '@/libsim/Devices'

export class Nand extends CustomLogicDevice {
    readonly inA: Pin
    readonly inB: Pin
    readonly out: UpdatablePin

    constructor (engine: Engine, name: string, device?: Device) {
      super(engine, name, device)

      this.inA = new Pin(engine, 'in-a', this)
      this.inB = new Pin(engine, 'in-b', this)
      this.out = new UpdatablePin(engine, 'out', this)
    }

    propagate (): boolean {
      const a = this.inA.getSignal()
      const b = this.inB.getSignal()

      this.out.setSignal(a === Signal.LOW || b === Signal.LOW || a !== b ? Signal.HIGH : Signal.LOW)

      return false
    }

    getPins (): Array<Pin> {
      return [this.inA, this.inB, this.out]
    }
}
