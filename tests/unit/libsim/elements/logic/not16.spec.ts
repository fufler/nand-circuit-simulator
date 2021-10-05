import { Signal } from '@/libsim/Pins'
import { fromPins, generateRandomNumbers16, make1InBusInputValues, makeDeviceSpec, toPins } from '../utils'
import { Not16 } from '@/libsim/elements/logic/Not16'

makeDeviceSpec(
  Not16,
  (input: Record<string, Signal>) => {
    const a = fromPins(input, 'in-')

    return toPins('out-', 0xFFFFFFFF - a)
  },
  make1InBusInputValues(generateRandomNumbers16(50).flat())
)
