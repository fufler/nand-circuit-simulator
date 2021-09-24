import { Engine } from '@/libsim/Engine'
import { Pin, Signal, UpdatablePin } from '@/libsim/Pins'
import { expect } from 'chai'
import { Suite } from 'mocha'
import { Device, DevicePinType } from '@/libsim/Devices'

import _ from 'lodash'

export type DeviceProvider = ((engine: Engine) => Device)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DeviceImplementationFunction = (input: any) => any
type Device2In1OutImplementationFunction = (inA: Signal, inB: Signal) => Signal

export const makeSignals = (n: number): Array<Array<Signal>> => {
  if (n === 1) {
    return [[Signal.LOW], [Signal.HIGH]]
  }

  const signals = makeSignals(n - 1)

  return [
    ...signals.map(s => [Signal.LOW, ...s]),
    ...signals.map(s => [Signal.HIGH, ...s])
  ]
}

export const SIGNALS = makeSignals(1)
export const SIGNALS2 = makeSignals(2)
export const SIGNALS3 = makeSignals(3)

const objectToString = (obj: unknown): string => _(obj)
  .toPairs()
  .map(([k, v]) => `${k} = ${v}`)
  .join(', ')

export const wrap2In1Out = (impl: Device2In1OutImplementationFunction): DeviceImplementationFunction =>
  ({ inA, inB }) => ({ out: impl(inA, inB) })

export const makeSpec = (name: string, provider: DeviceProvider, impl: DeviceImplementationFunction): Suite => describe(name, () => {
  const engine = new Engine()

  const device = provider(engine)

  const inputPins: Array<UpdatablePin> = []
  const outputPins: Array<Pin> = []

  for (const [pin, type] of device.getPins()) {
    if (type === DevicePinType.INPUT) {
      const p = new UpdatablePin(engine, pin.name)
      inputPins.push(p)
      engine.linkPins(p, pin)
    } else {
      const p = new Pin(engine, pin.name)
      outputPins.push(p)
      engine.linkPins(pin, p)
    }
  }

  for (const signals of makeSignals(inputPins.length)) {
    const input = _(inputPins)
      .map((p, idx) => [p.name, signals[idx]])
      .fromPairs()
      .value()

    const expectedOut = impl(input)

    it(`${name}(${objectToString(input)}) === (${objectToString(expectedOut)})`, async () => {
      for (let i = 0; i < signals.length; i++) {
        inputPins[i].setSignal(signals[i])
      }

      expect(await engine.run()).to.be.true

      for (const pin of outputPins) {
        expect(pin.getSignal()).to.be.equal(expectedOut[pin.name])
      }
    })
  }
})
