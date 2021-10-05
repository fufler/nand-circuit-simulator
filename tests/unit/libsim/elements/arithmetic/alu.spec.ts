import { Signal } from '@/libsim/Pins'
import { fromPins, generateRandomNumbers16, makeDeviceSpec, makeInput, prependSignals, toPins } from '../utils'

import _ from 'lodash'
import { ALU } from '@/libsim/elements/arithmetic/ALU'

const INPUT = prependSignals(
  6,
  [
    [0, 0],
    [65535, 1],
    [2 ** 15, 0],
    [0, 2 ** 15],
    ...generateRandomNumbers16(50, 2)
  ]
)

makeDeviceSpec(
  ALU,
  (input: Record<string, Signal>) => {
    let [x, y] = _.map(
      ['inX-', 'inY-'],
      p => fromPins(input, p)
    )

    if (input.zx === Signal.HIGH) {
      x = 0
    }

    if (input.nx === Signal.HIGH) {
      x = 65535 - x
    }

    if (input.zy === Signal.HIGH) {
      y = 0
    }

    if (input.ny === Signal.HIGH) {
      y = 65535 - y
    }

    let out = (input.f === Signal.HIGH ? x + y : x & y) % 65536

    if (input.no === Signal.HIGH) {
      out = 65535 - out
    }

    return {
      zr: out === 0 ? Signal.HIGH : Signal.LOW,
      ng: out >= 2 ** 15 ? Signal.HIGH : Signal.LOW,
      ...toPins('out-', out)
    }
  },
  makeInput(
    ['zx', 'nx', 'zy', 'ny', 'f', 'no'],
    ['inX', 'inY'],
    INPUT
  )
)
