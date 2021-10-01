import { CompoundDevice, Device, Device2In, DevicePins, DevicePinType, inPin, outPin } from '@/libsim/Devices'
import { Engine } from '@/libsim/Engine'
import { Pin } from '@/libsim/Pins'
import { HalfAdder } from '@/libsim/elements/arithmetic/HalfAdder'
import { Or } from '@/libsim/elements/logic/Or'

export class FullAdder extends CompoundDevice implements Device2In {
  readonly inA: Pin
  readonly inB: Pin
  readonly inC: Pin
  readonly outSum: Pin
  readonly outCarry: Pin

  private readonly halfAdder1: HalfAdder
  private readonly halfAdder2: HalfAdder
  private readonly or: Or

  constructor (engine: Engine, name: string, device?: Device) {
    super(engine, name, device)

    this.inA = new Pin(engine, 'inA', this)
    this.inB = new Pin(engine, 'inB', this)
    this.inC = new Pin(engine, 'inC', this)
    this.outSum = new Pin(engine, 'outSum', this)
    this.outCarry = new Pin(engine, 'outCarry', this)

    this.halfAdder1 = new HalfAdder(engine, 'halfAdder1', this)
    this.halfAdder2 = new HalfAdder(engine, 'halfAdder2', this)
    this.or = new Or(engine, 'or', this)

    engine.linkPins(this.inA, this.halfAdder1.inA)
    engine.linkPins(this.inB, this.halfAdder1.inB)
    engine.linkPins(this.halfAdder1.outSum, this.halfAdder2.inA)
    engine.linkPins(this.inC, this.halfAdder2.inB)

    engine.linkPins(this.halfAdder2.outSum, this.outSum)

    engine.linkPins(this.halfAdder1.outCarry, this.or.inA)
    engine.linkPins(this.halfAdder2.outCarry, this.or.inB)
    engine.linkPins(this.or.out, this.outCarry)
  }

  getDevices (): Array<Device> {
    return [this.halfAdder1, this.halfAdder2, this.or]
  }

  getPins (): DevicePins {
    return [
      inPin(this.inA),
      inPin(this.inB),
      inPin(this.inC),
      outPin(this.outSum),
      outPin(this.outCarry)
    ]
  }
}
