import { Engine } from '@/libsim/Engine'
import { Signal } from '@/libsim/Pins'
import { Or } from '@/libsim/elements/logic/Or'
import { makeDeviceSpec, wrap2In1Out } from '../utils'

makeDeviceSpec(
  'Or',
  (engine: Engine) => new Or(engine, 'or'),
  wrap2In1Out((a, b) => a === Signal.HIGH || b === Signal.HIGH ? Signal.HIGH : Signal.LOW)
)
