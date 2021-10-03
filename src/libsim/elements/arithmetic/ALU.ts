import { CompoundDevice, Device } from '@/libsim/Devices'
import { Engine } from '@/libsim/Engine'
import { Mux16 } from '@/libsim/elements/selectors/Mux16'
import { Not16 } from '@/libsim/elements/logic/Not16'
import { And16 } from '@/libsim/elements/logic/And16'
import { Adder16 } from '@/libsim/elements/arithmetic/Adder16'
import { Or16Way } from '@/libsim/elements/logic/Or16Way'
import { Not } from '@/libsim/elements/logic/Not'

import _ from 'lodash'

export class ALU extends CompoundDevice {
  readonly inX = this.makeInBus(16, 'inX')
  readonly inY = this.makeInBus(16, 'inY')
  readonly out = this.makeOutBus(16, 'out')

  readonly zx = this.makeInPin('zx')
  readonly zy = this.makeInPin('zy')
  readonly nx = this.makeInPin('nx')
  readonly ny = this.makeInPin('ny')
  readonly f = this.makeInPin('f')
  readonly no = this.makeInPin('no')

  readonly zr = this.makeOutPin('zr')
  readonly ng = this.makeOutPin('ng')

  private readonly zeroXMux = this.makeDevice(Mux16, 'zeroXMux')
  private readonly zeroYMux = this.makeDevice(Mux16, 'zeroYMux')

  private readonly invertXNot = this.makeDevice(Not16, 'invertXNot')
  private readonly invertYNot = this.makeDevice(Not16, 'invertYNot')

  private readonly invertXMux = this.makeDevice(Mux16, 'invertXMux')
  private readonly invertYMux = this.makeDevice(Mux16, 'invertYMux')

  private readonly falsePin = this.makeFalsePin('falsePin')

  private readonly and16 = this.makeDevice(And16, 'and16')
  private readonly adder16 = this.makeDevice(Adder16, 'adder16')

  private readonly resultMux = this.makeDevice(Mux16, 'resultMux')

  private readonly resultInvertNot = this.makeDevice(Not16, 'resultInvertNot')
  private readonly resultInvertMux = this.makeDevice(Mux16, 'resultInvertMux')

  private readonly resultZeroOr = this.makeDevice(Or16Way, 'resultZeroOr')
  private readonly resultZeroNot = this.makeDevice(Not, 'resultZeroNot')

  constructor (engine: Engine, name: string, device?: Device) {
    super(engine, name, device)

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
}
