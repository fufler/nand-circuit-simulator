import { Engine } from '@/libsim/Engine'
import { Pin, Signal, UpdatablePin } from '@/libsim/Pins'
import { expect } from 'chai'
import { Device, DeviceConstructor, DevicePinType } from '@/libsim/Devices'

import _ from 'lodash'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DeviceImplementationFunction = (input: any) => any
type Device2In1OutImplementationFunction = (inA: Signal, inB: Signal) => Signal
type Device2In1Out16ImplementationFunction = (inA: number, inB: number) => number
type MultiPinSignals = Array<Array<Signal>>
type NamedMultiPinSignal = Record<string, Signal>
type NamedMultiPinSignals = Array<NamedMultiPinSignal>

export const randomNumber8 = (start = 0): number => start + Math.ceil(Math.random() * (255 - start))
export const randomNumber16 = (start = 0): number => start + Math.ceil(Math.random() * (65535 - start))

export const generateRandomNumbers = (count: number, tupleLength: number, generator: () => number): number[][] =>
  _.times(count, () => _.times(tupleLength, generator))

export const generateRandomNumbers8 = (count: number, tupleLength = 1): number[][] => generateRandomNumbers(count, tupleLength, randomNumber8)
export const generateRandomNumbers16 = (count: number, tupleLength = 1): number[][] => generateRandomNumbers(count, tupleLength, randomNumber16)

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

export const prependSignals = (n: number, values: number[][]): number[][] => {
  const extraSignals = makeSignals(n)

  return values.flatMap(v => extraSignals.map(s => [...s, ...v]))
}

export const toPins = (prefix: string, value: number): Record<string, Signal> => {
  const pins: Record<string, Signal> = {}

  for (let i = 0; i < 16; i++) {
    pins[`${prefix}${i}`] = value % 2

    value = Math.floor(value / 2)
  }

  return pins
}

export const makeInput = (pins: string[], buses: string[], values: number[][] | number[]): NamedMultiPinSignals => {
  const _values = <number[][]>(Array.isArray(values[0]) ? values : (<number[]>values).map(v => [v]))

  return _values.map(v =>
    Object.assign(
      {},
      ..._.map(pins, (p, idx) => ({ [p]: v[idx] })),
      ..._.map(buses, (b, idx) => toPins(`${b}-`, v[pins.length + idx]))
    )
  )
}

export const make2InBusInputValues = (values: number[][]): NamedMultiPinSignals => makeInput([], ['inA', 'inB'], values)
export const make1InBusInputValues = (values: number[]): NamedMultiPinSignals => makeInput([], ['in'], values)

export const fromPins = (pins: Record<string, Signal>, prefix: string): number => _(pins)
  .toPairs()
  .filter(([name]) => name.startsWith(prefix))
  .reduce(
    (acc, [name, signal]) => acc + signal * (2 ** parseInt(name.substring(prefix.length), 10)),
    0
  )

function formatSignals (device: Device, signals: Array<Map<string, Signal>>): Array<string> {
  const busesPins: Record<string, [string, number]> = {}
  const busesLengths: Record<string, number> = {}

  for (const bus of device.getBuses()) {
    busesLengths[bus.name] = bus.pins.length

    for (let i = 0; i < bus.pins.length; i++) {
      busesPins[bus.pins[i].name] = [bus.name, i]
    }
  }

  const result = []

  for (const signalsSet of signals) {
    const values: Record<string, Array<Signal | undefined>> = {}

    for (const [pinName, signal] of _.toPairs(signalsSet)) {
      const pinInfo = busesPins[pinName]

      if (pinInfo !== undefined) {
        const [busName, pinIndex] = pinInfo
        const value = values[busName] ?? _.times(<number>busesLengths[busName], () => undefined)

        value[pinIndex] = signal

        values[busName] = value
      } else {
        values[pinName] = [signal]
      }
    }

    const formattedValues = _(values)
      .toPairs()
      .map(p => `${p[0]} = ${p[1].map(v => (v ?? '?').toString()).reverse().join('')}`)
      .join(', ')

    result.push(formattedValues)
  }

  return result
}

export const wrap2In1Out = (impl: Device2In1OutImplementationFunction): DeviceImplementationFunction =>
  ({
    inA,
    inB
  }) => ({ out: impl(inA, inB) })

export const wrap2In1Out16 = (impl: Device2In1Out16ImplementationFunction): DeviceImplementationFunction => input =>
  toPins(
    'out-',
    impl(
      fromPins(input, 'inA-'),
      fromPins(input, 'inB-')
    )
  )

export function makeDeviceSpec<T extends Device> (ctor: DeviceConstructor<T>, impl: DeviceImplementationFunction, customSignals?: NamedMultiPinSignals): void {
  describe(ctor.name, () => {
    const engine = new Engine()

    // eslint-disable-next-line new-cap
    const device = new ctor(engine, ctor.name)

    device.init()

    const inputPins: Array<UpdatablePin> = []
    const outputPins: Array<Pin> = []

    for (const [pin, type] of device.getPins()) {
      if (type === DevicePinType.INTERNAL) {
        continue
      }

      if (type === DevicePinType.INPUT) {
        const p = new UpdatablePin(engine, pin.name)
        inputPins.push(p)
        engine.link(p, pin)
      } else {
        const p = new Pin(engine, pin.name)
        outputPins.push(p)
        engine.link(pin, p)
      }
    }

    const inputSignals: MultiPinSignals = customSignals?.map(sigs => inputPins.map(p => sigs[p.name])) ?? makeSignals(inputPins.length)

    for (const signals of inputSignals) {
      const input = _(inputPins)
        .map((p, idx) => [p.name, signals[idx]])
        .fromPairs()
        .value()

      const expectedOut = impl(input)

      const [formattedInput, formattedOutput] = formatSignals(device, [input, expectedOut])

      it(`${ctor.name}(${(formattedInput)}) === { ${formattedOutput} }`, async () => {
        for (let i = 0; i < signals.length; i++) {
          inputPins[i].setSignal(signals[i])
        }

        expect(await engine.run()).to.be.true

        for (const pin of outputPins) {
          if (expectedOut[pin.name] !== undefined) {
            expect(pin.getSignal()).to.be.equal(expectedOut[pin.name], pin.name)
          }
        }
      })
    }
  })
}
