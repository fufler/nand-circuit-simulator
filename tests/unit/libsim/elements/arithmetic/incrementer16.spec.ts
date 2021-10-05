import { generateRandomNumbers16, make1InBusInputValues, makeDeviceSpec, wrapBuses } from '../utils'
import { Incrementer16 } from '@/libsim/elements/arithmetic/Incrementer16'

makeDeviceSpec(
  Incrementer16,
  wrapBuses(buses => ({
    buses: {
      out: (buses.in + 1) % 2 ** 16
    }
  })),
  make1InBusInputValues([0, 65535, ...generateRandomNumbers16(50).flat()])
)
