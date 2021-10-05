import { Signal } from '@/libsim/Pins'
import { fromPins, generateRandomNumbers16, make1InBusInputValues, makeDeviceSpec, toPins } from '../utils'
import { Incrementer16 } from '@/libsim/elements/arithmetic/Incrementer16'

makeDeviceSpec(
  Incrementer16,
  (input: Record<string, Signal>) => {
    const a = fromPins(input, 'in-')

    return toPins('out-', (a + 1) % 2 ** 16)
  },
  make1InBusInputValues([0, 65535, ...generateRandomNumbers16(50).flat()])
)
