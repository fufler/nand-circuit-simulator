import { CompoundDevice, Device, DevicePins, DevicePinType } from '@/libsim/Devices'
import { Engine } from '@/libsim/Engine'
import { FalsePin } from '@/libsim/Pins'

import _ from 'lodash'
import { FullAdder } from '@/libsim/elements/arithmetic/FullAdder'
import { Bus16 } from '@/libsim/Buses'

export class Adder16 extends CompoundDevice {
  readonly inA: Bus16
  readonly inB: Bus16
  readonly out: Bus16

  private readonly fullAdders: Array<FullAdder>
  private readonly falsePin: FalsePin

  constructor (engine: Engine, name: string, device?: Device) {
    super(engine, name, device)

    this.falsePin = new FalsePin(engine, 'false', this)

    this.inA = new Bus16(engine, 'inA', this)
    this.inB = new Bus16(engine, 'inB', this)
    this.out = new Bus16(engine, 'out', this)

    this.fullAdders = _.times(16, n => new FullAdder(engine, `full-adder-${n}`, this))

    engine.linkPins(this.falsePin, this.fullAdders[0].inC)

    engine.linkBuses(
      this.inA,
      this.fullAdders.map(fa => fa.inA)
    )

    engine.linkBuses(
      this.inB,
      this.fullAdders.map(fa => fa.inB)
    )

    engine.linkBuses(
      this.fullAdders.map(fa => fa.outSum),
      this.out
    )

    engine.linkBuses(
      this.fullAdders.map(fa => fa.outCarry).slice(0, 15),
      this.fullAdders.map(fa => fa.inC).slice(1)
    )
  }

  getDevices (): Array<Device> {
    return this.fullAdders
  }

  getPins (): DevicePins {
    const inPins: DevicePins = _.map(
      [...this.inA.pins, ...this.inB.pins],
      p => [p, DevicePinType.INPUT]
    )

    const outPins: DevicePins = _.map(this.out.pins, p => [p, DevicePinType.OUTPUT])

    return [...inPins, ...outPins]
  }
}
