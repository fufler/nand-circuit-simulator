import { CompoundDevice, Device, DevicePins, DevicePinType } from '@/libsim/Devices'
import { Engine } from '@/libsim/Engine'
import { FalsePin, Pin } from '@/libsim/Pins'

import _ from 'lodash'
import { FullAdder } from '@/libsim/elements/arithmetic/FullAdder'

export class Adder16 extends CompoundDevice {
  readonly inA: Array<Pin>
  readonly inB: Array<Pin>
  readonly out: Array<Pin>

  private readonly fullAdders: Array<FullAdder>
  private readonly falsePin: FalsePin

  constructor (engine: Engine, name: string, device?: Device) {
    super(engine, name, device)

    this.falsePin = new FalsePin(engine, 'false', this)

    this.inA = _.times(16, n => new Pin(engine, `inA-${n}`, this))
    this.inB = _.times(16, n => new Pin(engine, `inB-${n}`, this))
    this.out = _.times(16, n => new Pin(engine, `out-${n}`, this))

    this.fullAdders = _.times(16, n => new FullAdder(engine, `full-adder-${n}`, this))

    engine.linkPins(this.falsePin, this.fullAdders[0].inC)

    for (let i = 0; i < 16; i++) {
      engine.linkPins(this.inA[i], this.fullAdders[i].inA)
      engine.linkPins(this.inB[i], this.fullAdders[i].inB)

      engine.linkPins(this.fullAdders[i].outSum, this.out[i])

      if (i !== 15) {
        engine.linkPins(this.fullAdders[i].outCarry, this.fullAdders[i + 1].inC)
      }
    }
  }

  getDevices (): Array<Device> {
    return this.fullAdders
  }

  getPins (): DevicePins {
    const inPins: DevicePins = _.map([...this.inA, ...this.inB], p => [p, DevicePinType.INPUT])
    const outPins: DevicePins = _.map(this.out, p => [p, DevicePinType.OUTPUT])

    return [
      ...inPins,
      ...outPins
    ]
  }
}
