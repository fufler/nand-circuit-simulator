import { CompoundDevice, Device, DevicePins, inBus, inPin, outPin } from '@/libsim/Devices'
import { Pin } from '@/libsim/Pins'
import { Engine } from '@/libsim/Engine'
import { Bus2 } from '@/libsim/Buses'
import { DMux } from '@/libsim/elements/selectors/DMux'

export class DMux4Way extends CompoundDevice {
  readonly in: Pin
  readonly sel: Bus2
  readonly outA: Pin
  readonly outB: Pin
  readonly outC: Pin
  readonly outD: Pin

  private readonly dmux: DMux
  private readonly dmuxAB: DMux
  private readonly dmuxCD: DMux

  constructor (engine: Engine, name: string, device?: Device) {
    super(engine, name, device)

    this.sel = new Bus2(engine, 'sel', this)
    this.in = new Pin(engine, 'in', this)
    this.outA = new Pin(engine, 'outA', this)
    this.outB = new Pin(engine, 'outB', this)
    this.outC = new Pin(engine, 'outC', this)
    this.outD = new Pin(engine, 'outD', this)

    this.dmux = new DMux(engine, 'dmux', this)
    this.dmuxAB = new DMux(engine, 'dmuxAB', this)
    this.dmuxCD = new DMux(engine, 'dmuxCD', this)

    engine.linkPins(this.in, this.dmux.in)
    engine.linkPins(this.sel.pins[1], this.dmux.sel)

    engine.linkPins(this.dmux.outA, this.dmuxAB.in)
    engine.linkPins(this.dmux.outB, this.dmuxCD.in)

    engine.linkPins(this.sel.pins[0], this.dmuxAB.sel)
    engine.linkPins(this.sel.pins[0], this.dmuxCD.sel)

    engine.linkPins(this.dmuxAB.outA, this.outA)
    engine.linkPins(this.dmuxAB.outB, this.outB)
    engine.linkPins(this.dmuxCD.outA, this.outC)
    engine.linkPins(this.dmuxCD.outB, this.outD)
  }

  getPins (): DevicePins {
    return [
      inPin(this.in),
      ...inBus(this.sel),
      outPin(this.outA),
      outPin(this.outB),
      outPin(this.outC),
      outPin(this.outD)
    ]
  }

  getDevices (): Array<Device> {
    return [this.dmux, this.dmuxAB, this.dmuxCD]
  }
}
