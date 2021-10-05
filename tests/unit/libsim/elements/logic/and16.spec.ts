import { generateRandomNumbers16, make2InBusInputValues, makeDeviceSpec, wrap2In1Out16 } from '../utils'
import { And16 } from '@/libsim/elements/logic/And16'

makeDeviceSpec(
  And16,
  wrap2In1Out16((a, b) => a & b),
  make2InBusInputValues(generateRandomNumbers16(50, 2))
)
