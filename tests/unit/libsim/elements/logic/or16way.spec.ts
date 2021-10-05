import { Signal } from '@/libsim/Pins'
import { fromPins, generateRandomNumbers16, make1InBusInputValues, makeDeviceSpec } from '../utils'
import { Or16Way } from '@/libsim/elements/logic/Or16Way'

makeDeviceSpec(
  Or16Way,
  (input: Record<string, Signal>) => {
    const a = fromPins(input, 'in-')

    return { out: a !== 0 ? Signal.HIGH : Signal.LOW }
  },
  make1InBusInputValues([0, ...generateRandomNumbers16(50).flat()])
)
