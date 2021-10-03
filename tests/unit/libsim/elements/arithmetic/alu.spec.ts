import { Engine } from '@/libsim/Engine'
import { Signal } from '@/libsim/Pins'
import { fromPins, groupByPrefixFormatter, makeSpec, randomNumber16, SIGNALS6, toPins } from '../utils'

import _ from 'lodash'
import { ALU } from '@/libsim/elements/arithmetic/ALU'

const RANDOM_INPUT = _.times(50, () => [randomNumber16(1), randomNumber16(1)])

const INPUT = [
  [0, 0],
  [65535, 1],
  [2 ** 15, 0],
  [0, 2 ** 15],
  ...RANDOM_INPUT
]
  .flatMap(v => SIGNALS6.map(x => [...x, ...v]))

makeSpec(
  'ALU',
  (engine: Engine) => new ALU(engine, 'alu'),
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
  INPUT.map(([zx, nx, zy, ny, f, no, a, b]) => ({
    zx,
    nx,
    zy,
    ny,
    f,
    no,
    ...toPins('inX-', a),
    ...toPins('inY-', b)
  })),
  groupByPrefixFormatter(/(in\w|out)-(\d)/)
)
