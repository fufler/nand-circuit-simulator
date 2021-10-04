import { Signal } from '@/libsim/Pins'
import { fromPins, groupByPrefixFormatter, makeDeviceSpec, randomNumber16, toPins } from '../utils'

import _ from 'lodash'
import { Or16Way } from '@/libsim/elements/logic/Or16Way'

const RANDOM_INPUT = _.times(50, randomNumber16)

makeDeviceSpec(Or16Way, (input: Record<string, Signal>) => {
  const a = fromPins(input, 'in-')

  return { out: a !== 0 ? Signal.HIGH : Signal.LOW }
}, [0, ...RANDOM_INPUT].map(a => toPins('in-', a)), groupByPrefixFormatter(/(in)-(\d)/))
