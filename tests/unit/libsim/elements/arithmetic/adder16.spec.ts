import { Engine } from '@/libsim/Engine'
import { Signal } from '@/libsim/Pins'
import { fromPins, groupByPrefixFormatter, makeSpec, toPins } from '../utils'

import _ from 'lodash'
import { Adder16 } from '@/libsim/elements/arithmetic/Adder16'

const randomNumber16 = (start = 0) => start + Math.ceil(Math.random() * (65535 - start))
const RANDOM_INPUT = _.times(10, () => [randomNumber16(1), randomNumber16()])

makeSpec(
  'Adder16',
  (engine: Engine) => new Adder16(engine, 'adder16'),
  (input: Record<string, Signal>) => {
    const [a, b] = _.map(
      ['inA-', 'inB-'],
      p => fromPins(input, p)
    )

    return toPins('out-', (a + b) % 2 ** 16)
  },
  [
    [0, 0],
    [65535, 1],
    ...RANDOM_INPUT
  ].map(([a, b]) => ({
    ...toPins('inA-', a),
    ...toPins('inB-', b)
  })),
  groupByPrefixFormatter(/(in\w|out)-(\d)/, true)
)