import { Engine } from '@/libsim/Engine'
import { Signal } from '@/libsim/Pins'
import { fromPins, groupByPrefixFormatter, makeSpec, randomNumber16, toPins } from '../utils'

import _ from 'lodash'
import { And16 } from '@/libsim/elements/logic/And16'

const RANDOM_INPUT = _.times(50, () => [randomNumber16(1), randomNumber16()])

makeSpec(
  'And16',
  (engine: Engine) => new And16(engine, 'And16'),
  (input: Record<string, Signal>) => {
    const [a, b] = _.map(
      ['inA-', 'inB-'],
      p => fromPins(input, p)
    )

    return toPins('out-', a & b)
  },
  RANDOM_INPUT.map(([a, b]) => ({
    ...toPins('inA-', a),
    ...toPins('inB-', b)
  })),
  groupByPrefixFormatter(/(in\w|out)-(\d)/)
)
