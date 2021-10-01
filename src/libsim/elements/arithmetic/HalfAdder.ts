import { CompoundDevice, Device, Device2In, DevicePins, DevicePinType, inPin, outPin } from '@/libsim/Devices'
import { Engine } from '@/libsim/Engine'
import { Pin } from '@/libsim/Pins'
import { Xor } from '@/libsim/elements/logic/Xor'
import { And } from '@/libsim/elements/logic/And'

export class HalfAdder extends CompoundDevice implements Device2In {
  readonly inA: Pin
  readonly inB: Pin
  readonly outSum: Pin
  readonly outCarry: Pin

  private readonly and: And
  private readonly xor: Xor

  constructor (engine: Engine, name: string, device?: Device) {
    super(engine, name, device)

    this.inA = new Pin(engine, 'inA', this)
    this.inB = new Pin(engine, 'inB', this)
    this.outSum = new Pin(engine, 'outSum', this)
    this.outCarry = new Pin(engine, 'outCarry', this)

    this.and = new And(engine, 'And', this)
    this.xor = new Xor(engine, 'not', this)

    this.engine.linkPins(this.inA, this.and.inA)
    this.engine.linkPins(this.inB, this.and.inB)
    this.engine.linkPins(this.and.out, this.outCarry)

    this.engine.linkPins(this.inA, this.xor.inA)
    this.engine.linkPins(this.inB, this.xor.inB)
    this.engine.linkPins(this.xor.out, this.outSum)
  }

  getDevices (): Array<Device> {
    return [this.and, this.xor]
  }

  getPins (): DevicePins {
    return [
      inPin(this.inA),
      inPin(this.inB),
      outPin(this.outSum),
      outPin(this.outCarry)
    ]
  }
}
