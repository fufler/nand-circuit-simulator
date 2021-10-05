import { Signal } from '@/libsim/Pins'
import { generateRandomNumbers16, make1InBusInputValues, makeDeviceSpec, wrapBuses } from '../utils'
import { Or16Way } from '@/libsim/elements/logic/Or16Way'

makeDeviceSpec(
  Or16Way,
  wrapBuses(buses => ({
    pins: {
      out: buses.in !== 0 ? Signal.HIGH : Signal.LOW
    }
  })),
  make1InBusInputValues([0, ...generateRandomNumbers16(50).flat()])
)
