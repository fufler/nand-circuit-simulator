import { CompoundDevice, Device, DevicePins, inPin, outPin } from '@/libsim/Devices'
import { Pin } from '@/libsim/Pins'
import { Engine } from '@/libsim/Engine'
import { And } from '@/libsim/elements/logic/And'
import { Not } from '@/libsim/elements/logic/Not'

export class DMux extends CompoundDevice {
  readonly in: Pin
  readonly sel: Pin
  readonly outA: Pin
  readonly outB: Pin

  private readonly not: Not
  private readonly andA: And
  private readonly andB: And

  constructor (engine: Engine, name: string, device?: Device) {
    super(engine, name, device)

    this.sel = new Pin(engine, 'sel', this)
    this.in = new Pin(engine, 'in', this)
    this.outA = new Pin(engine, 'outA', this)
    this.outB = new Pin(engine, 'outB', this)

    this.andA = new And(engine, 'andA', this)
    this.andB = new And(engine, 'andB', this)
    this.not = new Not(engine, 'not', this)

    engine.linkPins(this.sel, this.not.in)

    engine.linkPins(this.in, this.andA.inA)
    engine.linkPins(this.not.out, this.andA.inB)

    engine.linkPins(this.in, this.andB.inB)
    engine.linkPins(this.sel, this.andB.inA)

    engine.linkPins(this.andA.out, this.outA)
    engine.linkPins(this.andB.out, this.outB)
  }

  getPins (): DevicePins {
    return [
      inPin(this.sel),
      inPin(this.in),
      outPin(this.outA),
      outPin(this.outB)
    ]
  }

  getDevices (): Array<Device> {
    return [this.not, this.andA, this.andB]
  }
}
