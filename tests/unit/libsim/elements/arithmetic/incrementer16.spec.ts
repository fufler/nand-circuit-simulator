import { Engine } from '@/libsim/Engine'
import { Signal } from '@/libsim/Pins'
import { fromPins, groupByPrefixFormatter, makeSpec, randomNumber16, toPins } from '../utils'

import _ from 'lodash'
import { Incrementer16 } from '@/libsim/elements/arithmetic/Incrementer16'

const RANDOM_INPUT = _.times(10, () => randomNumber16(1))

makeSpec(
  'Incrementer16',
  (engine: Engine) => new Incrementer16(engine, 'incrementer16'),
  (input: Record<string, Signal>) => {
    const a = fromPins(input, 'in-')

    return toPins('out-', (a + 1) % 2 ** 16)
  },
  [
    0,
    65535,
    ...RANDOM_INPUT
  ].map(a => toPins('in-', a)),
  groupByPrefixFormatter(/(in|out)-(\d)/, true)
)