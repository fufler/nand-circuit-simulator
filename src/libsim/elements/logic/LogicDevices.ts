import { CompoundDevice, Device, Device2In1Out, DevicePins, listDevice2In1OutPins } from '@/libsim/Devices'
import { Pin } from '@/libsim/Pins'
import { Engine } from '@/libsim/Engine'

export abstract class BinaryLogicDevice extends CompoundDevice implements Device2In1Out {
    readonly inA: Pin
    readonly inB: Pin
    readonly out: Pin

    protected constructor (engine: Engine, name: string, device?: Device) {
      super(engine, name, device)

      this.inA = new Pin(engine, 'inA', this)
      this.inB = new Pin(engine, 'inB', this)
      this.out = new Pin(engine, 'out', this)
    }

    getPins (): DevicePins {
      return listDevice2In1OutPins(this)
    }
}
