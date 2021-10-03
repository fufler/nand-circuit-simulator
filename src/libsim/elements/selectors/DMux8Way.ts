import { CompoundDevice, Device, DevicePins, inBus, inPin, outPin } from '@/libsim/Devices'
import { Pin } from '@/libsim/Pins'
import { Engine } from '@/libsim/Engine'
import { Bus3 } from '@/libsim/Buses'
import { DMux } from '@/libsim/elements/selectors/DMux'
import { DMux4Way } from '@/libsim/elements/selectors/DMux4Way'

export class DMux8Way extends CompoundDevice {
  readonly in: Pin
  readonly sel: Bus3
  readonly outA: Pin
  readonly outB: Pin
  readonly outC: Pin
  readonly outD: Pin
  readonly outE: Pin
  readonly outF: Pin
  readonly outG: Pin
  readonly outH: Pin

  private readonly dmux: DMux
  private readonly dmuxABCD: DMux4Way
  private readonly dmuxEFGH: DMux4Way

  constructor (engine: Engine, name: string, device?: Device) {
    super(engine, name, device)

    this.sel = new Bus3(engine, 'sel', this)

    this.in = new Pin(engine, 'in', this)
    this.outA = new Pin(engine, 'outA', this)
    this.outB = new Pin(engine, 'outB', this)
    this.outC = new Pin(engine, 'outC', this)
    this.outD = new Pin(engine, 'outD', this)
    this.outE = new Pin(engine, 'outE', this)
    this.outF = new Pin(engine, 'outF', this)
    this.outG = new Pin(engine, 'outG', this)
    this.outH = new Pin(engine, 'outH', this)

    this.dmux = new DMux(engine, 'dmux', this)
    this.dmuxABCD = new DMux4Way(engine, 'dmuxABCD', this)
    this.dmuxEFGH = new DMux4Way(engine, 'dmuxEFGH', this)

    engine.linkPins(this.sel.pins[2], this.dmux.sel)

    engine.linkPins(this.in, this.dmux.in)
    engine.linkPins(this.dmux.outA, this.dmuxABCD.in)
    engine.linkPins(this.dmux.outB, this.dmuxEFGH.in)

    engine.linkBuses(
      this.sel.pins.slice(0, 2),
      this.dmuxABCD.sel
    )

    engine.linkBuses(
      this.sel.pins.slice(0, 2),
      this.dmuxEFGH.sel
    )

    engine.linkPins(this.dmuxABCD.outA, this.outA)
    engine.linkPins(this.dmuxABCD.outB, this.outB)
    engine.linkPins(this.dmuxABCD.outC, this.outC)
    engine.linkPins(this.dmuxABCD.outD, this.outD)

    engine.linkPins(this.dmuxEFGH.outA, this.outE)
    engine.linkPins(this.dmuxEFGH.outB, this.outF)
    engine.linkPins(this.dmuxEFGH.outC, this.outG)
    engine.linkPins(this.dmuxEFGH.outD, this.outH)
  }

  getPins (): DevicePins {
    return [
      inPin(this.in),
      ...inBus(this.sel),
      outPin(this.outA),
      outPin(this.outB),
      outPin(this.outC),
      outPin(this.outD),
      outPin(this.outE),
      outPin(this.outF),
      outPin(this.outG),
      outPin(this.outH)
    ]
  }

  getDevices (): Array<Device> {
    return [this.dmux, this.dmuxABCD, this.dmuxEFGH]
  }
}
