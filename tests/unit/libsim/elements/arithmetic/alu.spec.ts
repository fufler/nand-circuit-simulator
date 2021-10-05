import { Signal } from '@/libsim/Pins'
import { generateRandomNumbers16, makeDeviceSpec, makeInput, prependSignals, wrapBuses } from '../utils'
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
  wrapBuses(({
    inA,
    inB
  }, {
    zx,
    nx,
    zy,
    ny,
    f,
    no
  }) => {
    if (zx === Signal.HIGH) {
      inA = 0
    }

    if (nx === Signal.HIGH) {
      inA = 65535 - inA
    }

    if (zy === Signal.HIGH) {
      inB = 0
    }

    if (ny === Signal.HIGH) {
      inB = 65535 - inB
    }

    let out = (f === Signal.HIGH ? inA + inB : inA & inB) % 65536

    if (no === Signal.HIGH) {
      out = 65535 - out
    }

    return {
      buses: { out },
      pins: {
        zr: out === 0 ? Signal.HIGH : Signal.LOW,
        ng: out >= 2 ** 15 ? Signal.HIGH : Signal.LOW
      }
    }
  }),
  makeInput(
    ['zx', 'nx', 'zy', 'ny', 'f', 'no'],
    ['inA', 'inB'],
    INPUT
  )
)
