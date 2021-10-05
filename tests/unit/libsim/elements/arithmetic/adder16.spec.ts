import { generateRandomNumbers16, make2InBusInputValues, makeDeviceSpec, wrap2In1Out16 } from '../utils'
import { Adder16 } from '@/libsim/elements/arithmetic/Adder16'

makeDeviceSpec(
  Adder16,
  wrap2In1Out16((a, b) => (a + b) % 2 ** 16),
  make2InBusInputValues(
    [
      [0, 0],
      [65535, 1],
      ...generateRandomNumbers16(50, 2)
    ]
  )
)
