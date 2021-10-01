import {
  CompoundDevice,
  Device,
  Device2In1Out, Device2In1Out16,
  DevicePins, inBus,
  inPin, outBus,
  outPin
} from '@/libsim/Devices'
import { Pin } from '@/libsim/Pins'
import { Engine } from '@/libsim/Engine'
import { Bus16 } from '@/libsim/Buses'

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
      return [
        inPin(this.inA),
        inPin(this.inB),
        outPin(this.out)
      ]
    }
}

export abstract class BinaryLogicDevice16 extends CompoundDevice implements Device2In1Out16 {
  readonly inA: Bus16
  readonly inB: Bus16
  readonly out: Bus16

  protected constructor (engine: Engine, name: string, device?: Device) {
    super(engine, name, device)

    this.inA = new Bus16(engine, 'inA', this)
    this.inB = new Bus16(engine, 'inB', this)
    this.out = new Bus16(engine, 'out', this)
  }

  getPins (): DevicePins {
    return [
      ...inBus(this.inA),
      ...inBus(this.inB),
      ...outBus(this.out)
    ]
  }
}
