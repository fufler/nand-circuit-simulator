import { Signal } from '@/libsim/Pins'
import { makeDeviceSpec, wrap2In1Out } from '../utils'
import { Xor } from '@/libsim/elements/logic/Xor'

makeDeviceSpec(
  Xor,
  wrap2In1Out((a, b) => a !== b ? Signal.HIGH : Signal.LOW)
)
