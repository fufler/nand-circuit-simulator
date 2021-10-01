import { Engine } from '@/libsim/Engine'
import { Signal } from '@/libsim/Pins'
import { fromPins, groupByPrefixFormatter, makeSpec, randomNumber8, toPins } from '../utils'

import _ from 'lodash'
import { Or8 } from '@/libsim/elements/logic/Or8Way'

const RANDOM_INPUT = _.times(50, randomNumber8)

makeSpec(
  'Or8',
  (engine: Engine) => new Or8(engine, 'Or8'),
  (input: Record<string, Signal>) => {
    const a = fromPins(input, 'in-')

    return { out: a !== 0 ? Signal.HIGH : Signal.LOW }
  },
  [0, ...RANDOM_INPUT].map(a => toPins('in-', a)),
  groupByPrefixFormatter(/(in)-(\d)/)
)
