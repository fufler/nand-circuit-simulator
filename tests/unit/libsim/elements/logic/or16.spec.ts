import { make2InBusInputValues, makeDeviceSpec, randomNumber16, wrap2In1Out16 } from '../utils'

import _ from 'lodash'
import { Or16 } from '@/libsim/elements/logic/Or16'

const RANDOM_INPUT = _.times(50, () => [randomNumber16(1), randomNumber16()])

makeDeviceSpec(
  Or16,
  wrap2In1Out16((a, b) => a | b),
  make2InBusInputValues(RANDOM_INPUT)
)
