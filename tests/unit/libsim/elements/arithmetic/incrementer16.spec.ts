import { Signal } from '@/libsim/Pins'
import { fromPins, make1InBusInputValues, makeDeviceSpec, randomNumber16, toPins } from '../utils'

import _ from 'lodash'
import { Incrementer16 } from '@/libsim/elements/arithmetic/Incrementer16'

const RANDOM_INPUT = _.times(50, () => randomNumber16(1))

makeDeviceSpec(
  Incrementer16,
  (input: Record<string, Signal>) => {
    const a = fromPins(input, 'in-')

    return toPins('out-', (a + 1) % 2 ** 16)
  },
  make1InBusInputValues([0, 65535, ...RANDOM_INPUT])
)
