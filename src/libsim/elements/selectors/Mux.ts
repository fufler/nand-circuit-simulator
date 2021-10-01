import { CompoundDevice, Device, DevicePins, inPin, outPin } from '@/libsim/Devices'
import { Pin } from '@/libsim/Pins'
import { Engine } from '@/libsim/Engine'
import { Or } from '@/libsim/elements/logic/Or'
import { And } from '@/libsim/elements/logic/And'
import { Not } from '@/libsim/elements/logic/Not'

export class Mux extends CompoundDevice {
  readonly inA: Pin
  readonly inB: Pin
  readonly sel: Pin
  readonly out: Pin

  private readonly or: Or
  private readonly not: Not
  private readonly andA: And
  private readonly andB: And

  constructor (engine: Engine, name: string, device?: Device) {
    super(engine, name, device)

    this.inA = new Pin(engine, 'inA', this)
    this.inB = new Pin(engine, 'inB', this)
    this.sel = new Pin(engine, 'sel', this)
    this.out = new Pin(engine, 'out', this)

    this.andA = new And(engine, 'andA', this)
    this.andB = new And(engine, 'andB', this)
    this.or = new Or(engine, 'or', this)
    this.not = new Not(engine, 'not', this)

    engine.linkPins(this.sel, this.not.in)

    engine.linkPins(this.inA, this.andA.inA)
    engine.linkPins(this.not.out, this.andA.inB)

    engine.linkPins(this.inB, this.andB.inB)
    engine.linkPins(this.sel, this.andB.inA)

    engine.linkPins(this.andA.out, this.or.inA)
    engine.linkPins(this.andB.out, this.or.inB)
    engine.linkPins(this.or.out, this.out)
  }

  getPins (): DevicePins {
    return [
      inPin(this.inA),
      inPin(this.inB),
      inPin(this.sel),
      outPin(this.out)
    ]
  }

  getDevices (): Array<Device> {
    return [this.not, this.andA, this.andB, this.or]
  }
}
