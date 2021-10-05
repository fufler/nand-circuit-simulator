import { generateRandomNumbers16, make2InBusInputValues, makeDeviceSpec, wrap2In1Out16 } from '../utils'
import { Or16 } from '@/libsim/elements/logic/Or16'

makeDeviceSpec(
  Or16,
  wrap2In1Out16((a, b) => a | b),
  make2InBusInputValues(generateRandomNumbers16(50, 2))
)
