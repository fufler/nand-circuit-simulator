import { Signal } from '@/libsim/Pins'
import { Or } from '@/libsim/elements/logic/Or'
import { makeDeviceSpec, wrap2In1Out } from '../utils'

makeDeviceSpec(
  Or,
  wrap2In1Out((a, b) => a === Signal.HIGH || b === Signal.HIGH ? Signal.HIGH : Signal.LOW)
)
