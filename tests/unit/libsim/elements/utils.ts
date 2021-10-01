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
type MultiPinSignals = Array<Array<Signal>>
type NamedMultiPinSignal = Record<string, Signal>
type NamedMultiPinSignals = Array<NamedMultiPinSignal>

type SignalFormatter = (signal: NamedMultiPinSignal) => string

export const randomNumber16 = (start = 0) => start + Math.ceil(Math.random() * (65535 - start))

export const makeSignals = (n: number): MultiPinSignals => {
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

const pinsToString = (signal: NamedMultiPinSignal): string => _(signal)
  .toPairs()
  .map(([k, v]) => `${k} = ${v}`)
  .join(', ')

export const toPins = (prefix: string, value: number): Record<string, Signal> => {
  const pins: Record<string, Signal> = {}

  for (let i = 0; i < 16; i++) {
    pins[`${prefix}${i}`] = value % 2

    value = Math.floor(value / 2)
  }

  return pins
}

export const fromPins = (pins: Record<string, Signal>, prefix: string): number => _(pins)
  .toPairs()
  .filter(([name]) => name.startsWith(prefix))
  .reduce(
    (acc, [name, signal]) => acc + signal * (2 ** parseInt(name.substring(prefix.length), 10)),
    0
  )

export const groupByPrefixFormatter = (re: RegExp, indexed: boolean): SignalFormatter => (signal: NamedMultiPinSignal): string => {
  const matched: Array<[string, string, number | string]> = []
  const notMatched: Array<string> = []

  for (const key of _.keys(signal)) {
    const m = key.match(re)

    if (m == null) {
      notMatched.push(key)
      continue
    }

    const name = m[0]
    const group = m[1]
    const index = m[2]

    if (name != null && group != null && index != null) {
      matched.push([name, group, index ? parseInt(index, 10) : index])
    }
  }

  const groupedValues = _(matched)
    .groupBy(m => m[1])
    .mapValues(gm =>
      _(gm)
        .sortBy(m => m[2])
        .map(m => m[0])
        .reduce(
          (acc, f) => signal[f] + acc,
          ''
        )
    )
    .value()

  for (const v of notMatched) {
    groupedValues[v] = signal[v].toString()
  }

  return _(groupedValues)
    .toPairs()
    .map(([k, v]) => `${k} = ${v}`)
    .join(', ')
}

export const wrap2In1Out = (impl: Device2In1OutImplementationFunction): DeviceImplementationFunction =>
  ({ inA, inB }) => ({ out: impl(inA, inB) })

export const makeSpec = (name: string, provider: DeviceProvider, impl: DeviceImplementationFunction, customSignals?: NamedMultiPinSignals, signalFormatter?: SignalFormatter): Suite => describe(name, () => {
  const engine = new Engine()

  const device = provider(engine)

  const inputPins: Array<UpdatablePin> = []
  const outputPins: Array<Pin> = []

  for (const [pin, type] of device.getPins()) {
    if (type === DevicePinType.INTERNAL) {
      continue
    }

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

  const inputSignals: MultiPinSignals = customSignals?.map(sigs => inputPins.map(p => sigs[p.name])) ?? makeSignals(inputPins.length)

  const formatter = signalFormatter ?? pinsToString

  for (const signals of inputSignals) {
    const input = _(inputPins)
      .map((p, idx) => [p.name, signals[idx]])
      .fromPairs()
      .value()

    const expectedOut = impl(input)

    it(`${name}(${formatter(input)}) === (${formatter(expectedOut)})`, async () => {
      for (let i = 0; i < signals.length; i++) {
        inputPins[i].setSignal(signals[i])
      }

      expect(await engine.run()).to.be.true

      for (const pin of outputPins) {
        expect(pin.getSignal()).to.be.equal(expectedOut[pin.name], pin.name)
      }
    })
  }
})
