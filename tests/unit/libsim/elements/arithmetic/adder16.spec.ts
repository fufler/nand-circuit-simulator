import { make2InBusInputValues, makeDeviceSpec, randomNumber16, wrap2In1Out16 } from '../utils'

import _ from 'lodash'
import { Adder16 } from '@/libsim/elements/arithmetic/Adder16'

const RANDOM_INPUT = _.times(50, () => [randomNumber16(1), randomNumber16()])

makeDeviceSpec(
  Adder16,
  wrap2In1Out16((a, b) => (a + b) % 2 ** 16),
  make2InBusInputValues(
    [
      [0, 0],
      [65535, 1],
      ...RANDOM_INPUT
    ]
  )
)
