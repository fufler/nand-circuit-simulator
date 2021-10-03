import { CompoundDevice } from '@/libsim/Devices'
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

  init (): void {
    const falseBus = _.times(16, () => this.falsePin)

    this.linkBuses(
      falseBus,
      this.zeroXMux.inB
    )

    this.linkBuses(
      falseBus,
      this.zeroYMux.inB
    )

    this.linkBuses(this.inX, this.zeroXMux.inA)
    this.linkBuses(this.inY, this.zeroYMux.inA)

    this.linkPins(this.zx, this.zeroXMux.sel)
    this.linkPins(this.zy, this.zeroYMux.sel)

    this.linkBuses(this.zeroXMux.out, this.invertXMux.inA)
    this.linkBuses(this.zeroXMux.out, this.invertXNot.in)
    this.linkBuses(this.invertXNot.out, this.invertXMux.inB)
    this.linkPins(this.nx, this.invertXMux.sel)

    this.linkBuses(this.zeroYMux.out, this.invertYMux.inA)
    this.linkBuses(this.zeroYMux.out, this.invertYNot.in)
    this.linkBuses(this.invertYNot.out, this.invertYMux.inB)
    this.linkPins(this.ny, this.invertYMux.sel)

    this.linkBuses(this.invertXMux.out, this.adder16.inA)
    this.linkBuses(this.invertYMux.out, this.adder16.inB)

    this.linkBuses(this.invertXMux.out, this.and16.inA)
    this.linkBuses(this.invertYMux.out, this.and16.inB)

    this.linkBuses(this.and16.out, this.resultMux.inA)
    this.linkBuses(this.adder16.out, this.resultMux.inB)
    this.linkPins(this.f, this.resultMux.sel)

    this.linkBuses(this.resultMux.out, this.resultInvertNot.in)

    this.linkBuses(this.resultMux.out, this.resultInvertMux.inA)
    this.linkBuses(this.resultInvertNot.out, this.resultInvertMux.inB)
    this.linkPins(this.no, this.resultInvertMux.sel)

    this.linkBuses(this.resultInvertMux.out, this.out)

    this.linkPins(this.resultInvertMux.out.pins[15], this.ng)

    this.linkBuses(this.resultInvertMux.out, this.resultZeroOr.in)
    this.linkPins(this.resultZeroOr.out, this.resultZeroNot.in)
    this.linkPins(this.resultZeroNot.out, this.zr)
  }
}
