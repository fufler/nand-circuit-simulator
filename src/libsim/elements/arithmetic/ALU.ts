import { CompoundDevice } from '@/libsim/Devices'
import { Mux16 } from '@/libsim/elements/selectors/Mux16'
import { Not16 } from '@/libsim/elements/logic/Not16'
import { And16 } from '@/libsim/elements/logic/And16'
import { Adder16 } from '@/libsim/elements/arithmetic/Adder16'
import { Or16Way } from '@/libsim/elements/logic/Or16Way'
import { Not } from '@/libsim/elements/logic/Not'

import _ from 'lodash'

export class ALU extends CompoundDevice {
  readonly inA = this.makeInBus(16, 'inA')
  readonly inB = this.makeInBus(16, 'inB')
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

    this.link(
      falseBus,
      this.zeroXMux.inB
    )

    this.link(
      falseBus,
      this.zeroYMux.inB
    )

    this.link(this.inA, this.zeroXMux.inA)
    this.link(this.inB, this.zeroYMux.inA)

    this.link(this.zx, this.zeroXMux.sel)
    this.link(this.zy, this.zeroYMux.sel)

    this.link(this.zeroXMux.out, this.invertXMux.inA)
    this.link(this.zeroXMux.out, this.invertXNot.in)
    this.link(this.invertXNot.out, this.invertXMux.inB)
    this.link(this.nx, this.invertXMux.sel)

    this.link(this.zeroYMux.out, this.invertYMux.inA)
    this.link(this.zeroYMux.out, this.invertYNot.in)
    this.link(this.invertYNot.out, this.invertYMux.inB)
    this.link(this.ny, this.invertYMux.sel)

    this.link(this.invertXMux.out, this.adder16.inA)
    this.link(this.invertYMux.out, this.adder16.inB)

    this.link(this.invertXMux.out, this.and16.inA)
    this.link(this.invertYMux.out, this.and16.inB)

    this.link(this.and16.out, this.resultMux.inA)
    this.link(this.adder16.out, this.resultMux.inB)
    this.link(this.f, this.resultMux.sel)

    this.link(this.resultMux.out, this.resultInvertNot.in)

    this.link(this.resultMux.out, this.resultInvertMux.inA)
    this.link(this.resultInvertNot.out, this.resultInvertMux.inB)
    this.link(this.no, this.resultInvertMux.sel)

    this.link(this.resultInvertMux.out, this.out)

    this.link(this.resultInvertMux.out.pins[15], this.ng)

    this.link(this.resultInvertMux.out, this.resultZeroOr.in)
    this.link(this.resultZeroOr.out, this.resultZeroNot.in)
    this.link(this.resultZeroNot.out, this.zr)
  }
}
