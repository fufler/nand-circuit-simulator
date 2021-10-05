import { generateRandomNumbers16, make1InBusInputValues, makeDeviceSpec, wrapBuses } from '../utils'
import { Not16 } from '@/libsim/elements/logic/Not16'

makeDeviceSpec(
  Not16,
  wrapBuses(buses => ({
    buses: {
      out: 0xFFFFFFFF - buses.in
    }
  })),
  make1InBusInputValues(generateRandomNumbers16(50).flat())
)
