import { Signal } from '@/libsim/Pins'
import { generateRandomNumbers8, make1InBusInputValues, makeDeviceSpec, wrapBuses } from '../utils'
import { Or8Way } from '@/libsim/elements/logic/Or8Way'

makeDeviceSpec(
  Or8Way,
  wrapBuses(buses => ({
    pins: {
      out: buses.in !== 0 ? Signal.HIGH : Signal.LOW
    }
  })),
  make1InBusInputValues([0, ...generateRandomNumbers8(50).flat()])
)
