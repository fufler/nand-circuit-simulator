import { Engine } from '@/libsim/Engine'
import { Signal } from '@/libsim/Pins'
import { make2In1OutSpec } from './utils'
import { Xor } from '@/libsim/elements/logic/Xor'

make2In1OutSpec(
  'Xor',
  (engine: Engine) => new Xor(engine, 'xor'),
  (inputA, inputB) => inputA !== inputB ? Signal.HIGH : Signal.LOW
)
