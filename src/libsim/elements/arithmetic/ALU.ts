import { CompoundDevice, Device, DevicePins, inBus, inPin, outBus, outPin } from '@/libsim/Devices'
import { Engine } from '@/libsim/Engine'
import { Bus16 } from '@/libsim/Buses'
import { FalsePin, Pin } from '@/libsim/Pins'
import { Mux16 } from '@/libsim/elements/selectors/Mux16'

import _ from 'lodash'
import { Not16 } from '@/libsim/elements/logic/Not16'
import { And16 } from '@/libsim/elements/logic/And16'
import { Adder16 } from '@/libsim/elements/arithmetic/Adder16'
import { Or16Way } from '@/libsim/elements/logic/Or16Way'
import { Not } from '@/libsim/elements/logic/Not'

export class ALU extends CompoundDevice {
  readonly inX: Bus16
  readonly inY: Bus16
  readonly out: Bus16

  readonly zx: Pin
  readonly zy: Pin
  readonly nx: Pin
  readonly ny: Pin
  readonly f: Pin
  readonly no: Pin

  readonly zr: Pin
  readonly ng: Pin

  private readonly zeroXMux: Mux16
  private readonly zeroYMux: Mux16

  private readonly invertXNot: Not16
  private readonly invertYNot: Not16

  private readonly invertXMux: Mux16
  private readonly invertYMux: Mux16

  private readonly falsePin: FalsePin

  private readonly and16: And16
  private readonly adder16: Adder16

  private readonly resultMux: Mux16

  private readonly resultInvertNot: Not16
  private readonly resultInvertMux: Mux16

  private readonly resultZeroOr: Or16Way
  private readonly resultZeroNot: Not

  constructor (engine: Engine, name: string, device?: Device) {
    super(engine, name, device)
    this.inX = this.makeBus16('inX')
    this.inY = this.makeBus16('inY')
    this.out = this.makeBus16('out')

    this.zx = this.makePin('zx')
    this.zy = this.makePin('zy')

    this.nx = this.makePin('nx')
    this.ny = this.makePin('ny')

    this.f = this.makePin('f')

    this.no = this.makePin('no')

    this.zr = this.makePin('zr')
    this.ng = this.makePin('ng')

    this.falsePin = new FalsePin(engine, 'falsePin', this)

    this.zeroXMux = new Mux16(engine, 'zeroXMux', this)
    this.zeroYMux = new Mux16(engine, 'zeroXMux', this)

    this.invertXNot = new Not16(engine, 'invertXNot', this)
    this.invertYNot = new Not16(engine, 'invertYNot', this)

    this.invertXMux = new Mux16(engine, 'invertXMux', this)
    this.invertYMux = new Mux16(engine, 'invertYMux', this)

    this.and16 = new And16(engine, 'and16', this)
    this.adder16 = new Adder16(engine, 'adder16', this)
    this.resultMux = new Mux16(engine, 'resultMux', this)

    this.resultInvertNot = new Not16(engine, 'resultInvertNot', this)
    this.resultInvertMux = new Mux16(engine, 'resultInvertMux', this)

    this.resultZeroOr = new Or16Way(engine, 'resultZeroOr', this)
    this.resultZeroNot = new Not(engine, 'resultZeroNot', this)

    const falseBus = _.times(16, () => this.falsePin)

    engine.linkBuses(
      falseBus,
      this.zeroXMux.inB
    )

    engine.linkBuses(
      falseBus,
      this.zeroYMux.inB
    )

    engine.linkBuses(this.inX, this.zeroXMux.inA)
    engine.linkBuses(this.inY, this.zeroYMux.inA)

    engine.linkPins(this.zx, this.zeroXMux.sel)
    engine.linkPins(this.zy, this.zeroYMux.sel)

    engine.linkBuses(this.zeroXMux.out, this.invertXMux.inA)
    engine.linkBuses(this.zeroXMux.out, this.invertXNot.in)
    engine.linkBuses(this.invertXNot.out, this.invertXMux.inB)
    engine.linkPins(this.nx, this.invertXMux.sel)

    engine.linkBuses(this.zeroYMux.out, this.invertYMux.inA)
    engine.linkBuses(this.zeroYMux.out, this.invertYNot.in)
    engine.linkBuses(this.invertYNot.out, this.invertYMux.inB)
    engine.linkPins(this.ny, this.invertYMux.sel)

    engine.linkBuses(this.invertXMux.out, this.adder16.inA)
    engine.linkBuses(this.invertYMux.out, this.adder16.inB)

    engine.linkBuses(this.invertXMux.out, this.and16.inA)
    engine.linkBuses(this.invertYMux.out, this.and16.inB)

    engine.linkBuses(this.and16.out, this.resultMux.inA)
    engine.linkBuses(this.adder16.out, this.resultMux.inB)
    engine.linkPins(this.f, this.resultMux.sel)

    engine.linkBuses(this.resultMux.out, this.resultInvertNot.in)

    engine.linkBuses(this.resultMux.out, this.resultInvertMux.inA)
    engine.linkBuses(this.resultInvertNot.out, this.resultInvertMux.inB)
    engine.linkPins(this.no, this.resultInvertMux.sel)

    engine.linkBuses(this.resultInvertMux.out, this.out)

    engine.linkPins(this.resultInvertMux.out.pins[15], this.ng)

    engine.linkBuses(this.resultInvertMux.out, this.resultZeroOr.in)
    engine.linkPins(this.resultZeroOr.out, this.resultZeroNot.in)
    engine.linkPins(this.resultZeroNot.out, this.zr)
  }

  getPins (): DevicePins {
    return [
      ...inBus(this.inX),
      ...inBus(this.inY),
      ...outBus(this.out),
      inPin(this.zx),
      inPin(this.zy),
      inPin(this.nx),
      inPin(this.ny),
      inPin(this.f),
      inPin(this.no),
      outPin(this.zr),
      outPin(this.ng)
    ]
  }

  getDevices (): Array<Device> {
    return [
      this.zeroXMux,
      this.zeroYMux,
      this.invertXMux,
      this.invertXNot,
      this.invertYMux,
      this.invertYNot,
      this.adder16,
      this.and16,
      this.resultMux,
      this.resultInvertNot,
      this.resultInvertMux
    ]
  }
}
