import { CompoundDevice, Device, DevicePins, inBus, outBus } from '@/libsim/Devices'
import { Engine } from '@/libsim/Engine'
import { Bus16, Bus3 } from '@/libsim/Buses'
import { Mux16 } from '@/libsim/elements/selectors/Mux16'
import { Mux4Way16 } from '@/libsim/elements/selectors/Mux4Way16'

export class Mux8Way16 extends CompoundDevice {
  readonly inA: Bus16
  readonly inB: Bus16
  readonly inC: Bus16
  readonly inD: Bus16
  readonly inE: Bus16
  readonly inF: Bus16
  readonly inG: Bus16
  readonly inH: Bus16
  readonly sel: Bus3
  readonly out: Bus16

  private readonly muxABCD: Mux4Way16
  private readonly muxEFGH: Mux4Way16
  private readonly mux: Mux16

  constructor (engine: Engine, name: string, device?: Device) {
    super(engine, name, device)

    this.inA = new Bus16(engine, 'inA', this)
    this.inB = new Bus16(engine, 'inB', this)
    this.inC = new Bus16(engine, 'inC', this)
    this.inD = new Bus16(engine, 'inD', this)
    this.inE = new Bus16(engine, 'inE', this)
    this.inF = new Bus16(engine, 'inF', this)
    this.inG = new Bus16(engine, 'inG', this)
    this.inH = new Bus16(engine, 'inH', this)

    this.sel = new Bus3(engine, 'sel', this)
    this.out = new Bus16(engine, 'out', this)

    this.muxABCD = new Mux4Way16(engine, 'muxABCD', this)
    this.muxEFGH = new Mux4Way16(engine, 'muxEFGH', this)
    this.mux = new Mux16(engine, 'mux', this)

    engine.linkBuses(this.inA, this.muxABCD.inA)
    engine.linkBuses(this.inB, this.muxABCD.inB)
    engine.linkBuses(this.inC, this.muxABCD.inC)
    engine.linkBuses(this.inD, this.muxABCD.inD)

    engine.linkBuses(
      this.sel.pins.slice(0, 2),
      this.muxABCD.sel
    )

    engine.linkBuses(this.inE, this.muxEFGH.inA)
    engine.linkBuses(this.inF, this.muxEFGH.inB)
    engine.linkBuses(this.inG, this.muxEFGH.inC)
    engine.linkBuses(this.inH, this.muxEFGH.inD)

    engine.linkBuses(
      this.sel.pins.slice(0, 2),
      this.muxEFGH.sel
    )

    engine.linkBuses(this.muxABCD.out, this.mux.inA)
    engine.linkBuses(this.muxEFGH.out, this.mux.inB)

    engine.linkPins(this.sel.pins[2], this.mux.sel)

    engine.linkBuses(this.mux.out, this.out)
  }

  getPins (): DevicePins {
    return [
      ...inBus(this.inA),
      ...inBus(this.inB),
      ...inBus(this.inC),
      ...inBus(this.inD),
      ...inBus(this.inE),
      ...inBus(this.inF),
      ...inBus(this.inG),
      ...inBus(this.inH),
      ...inBus(this.sel),
      ...outBus(this.out)
    ]
  }

  getDevices (): Array<Device> {
    return [this.mux, this.muxABCD, this.muxEFGH]
  }
}
