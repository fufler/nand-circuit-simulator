import { CompoundDevice, Device, DevicePins, inBus, outBus } from '@/libsim/Devices'
import { Engine } from '@/libsim/Engine'
import { Bus16, Bus2 } from '@/libsim/Buses'
import { Mux16 } from '@/libsim/elements/selectors/Mux16'

export class Mux4Way16 extends CompoundDevice {
  readonly inA: Bus16
  readonly inB: Bus16
  readonly inC: Bus16
  readonly inD: Bus16
  readonly sel: Bus2
  readonly out: Bus16

  private readonly muxAB: Mux16
  private readonly muxCD: Mux16
  private readonly mux: Mux16

  constructor (engine: Engine, name: string, device?: Device) {
    super(engine, name, device)

    this.inA = new Bus16(engine, 'inA', this)
    this.inB = new Bus16(engine, 'inB', this)
    this.inC = new Bus16(engine, 'inC', this)
    this.inD = new Bus16(engine, 'inD', this)
    this.sel = new Bus2(engine, 'sel', this)
    this.out = new Bus16(engine, 'out', this)

    this.muxAB = new Mux16(engine, 'muxAB', this)
    this.muxCD = new Mux16(engine, 'muxCD', this)
    this.mux = new Mux16(engine, 'mux', this)

    engine.linkBuses(this.inA, this.muxAB.inA)
    engine.linkBuses(this.inB, this.muxAB.inB)
    engine.linkPins(this.sel.pins[0], this.muxAB.sel)

    engine.linkBuses(this.inC, this.muxCD.inA)
    engine.linkBuses(this.inD, this.muxCD.inB)
    engine.linkPins(this.sel.pins[0], this.muxCD.sel)

    engine.linkBuses(this.muxAB.out, this.mux.inA)
    engine.linkBuses(this.muxCD.out, this.mux.inB)
    engine.linkPins(this.sel.pins[1], this.mux.sel)

    engine.linkBuses(this.mux.out, this.out)
  }

  getPins (): DevicePins {
    return [
      ...inBus(this.inA),
      ...inBus(this.inB),
      ...inBus(this.inC),
      ...inBus(this.inD),
      ...inBus(this.sel),
      ...outBus(this.out)
    ]
  }

  getDevices (): Array<Device> {
    return [this.mux, this.muxAB, this.muxCD]
  }
}
