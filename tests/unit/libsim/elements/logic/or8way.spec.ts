import { Signal } from '@/libsim/Pins'
import { fromPins, makeDeviceSpec, randomNumber8, toPins } from '../utils'

import _ from 'lodash'
import { Or8Way } from '@/libsim/elements/logic/Or8Way'

const RANDOM_INPUT = _.times(50, randomNumber8)

makeDeviceSpec(Or8Way, (input: Record<string, Signal>) => {
  const a = fromPins(input, 'in-')

  return { out: a !== 0 ? Signal.HIGH : Signal.LOW }
}, [0, ...RANDOM_INPUT].map(a => toPins('in-', a)))
