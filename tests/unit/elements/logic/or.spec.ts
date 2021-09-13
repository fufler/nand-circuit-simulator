import { Engine } from '@/libsim/Engine'
import { Signal } from '@/libsim/Pins'
import { Or } from '@/libsim/elements/logic/Or'
import { make2In1OutSpec } from './utils'

make2In1OutSpec(
  'Or',
  (engine: Engine) => new Or(engine, 'or'),
  (inputA, inputB) => inputA === Signal.HIGH || inputB === Signal.HIGH ? Signal.HIGH : Signal.LOW
)
