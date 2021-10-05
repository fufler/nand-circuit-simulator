import { Signal } from '@/libsim/Pins'
import { fromPins, make1InBusInputValues, makeDeviceSpec, randomNumber16, toPins } from '../utils'

import _ from 'lodash'
import { Not16 } from '@/libsim/elements/logic/Not16'

const RANDOM_INPUT = _.times(50, randomNumber16)

makeDeviceSpec(
  Not16,
  (input: Record<string, Signal>) => {
    const a = fromPins(input, 'in-')

    return toPins('out-', 0xFFFFFFFF - a)
  },
  make1InBusInputValues(RANDOM_INPUT)
)
