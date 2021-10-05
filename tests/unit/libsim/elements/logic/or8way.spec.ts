import { Signal } from '@/libsim/Pins'
import { fromPins, generateRandomNumbers8, make1InBusInputValues, makeDeviceSpec } from '../utils'
import { Or8Way } from '@/libsim/elements/logic/Or8Way'

makeDeviceSpec(
  Or8Way,
  (input: Record<string, Signal>) => {
    const a = fromPins(input, 'in-')

    return { out: a !== 0 ? Signal.HIGH : Signal.LOW }
  },
  make1InBusInputValues([0, ...generateRandomNumbers8(50).flat()])
)
