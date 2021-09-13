import { Engine } from '@/libsim/Engine'
import { Signal } from '@/libsim/Pins'
import { make2In1OutSpec } from './utils'
import { And } from '@/libsim/elements/logic/And'

make2In1OutSpec(
  'And',
  (engine: Engine) => new And(engine, 'and'),
  (inputA, inputB) => inputA === Signal.HIGH && inputB === Signal.HIGH ? Signal.HIGH : Signal.LOW
)
