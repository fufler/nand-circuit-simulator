import { Signal } from '@/libsim/Pins'
import { makeDeviceSpec, wrap2In1Out } from '../utils'
import { And } from '@/libsim/elements/logic/And'

makeDeviceSpec(
  And,
  wrap2In1Out((a, b) => a === Signal.HIGH && b === Signal.HIGH ? Signal.HIGH : Signal.LOW)
)
