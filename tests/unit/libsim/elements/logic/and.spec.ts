import { Engine } from '@/libsim/Engine'
import { Signal } from '@/libsim/Pins'
import { makeSpec, wrap2In1Out } from '../utils'
import { And } from '@/libsim/elements/logic/And'

makeSpec(
  'And',
  (engine: Engine) => new And(engine, 'and'),
  wrap2In1Out((a, b) => a === Signal.HIGH && b === Signal.HIGH ? Signal.HIGH : Signal.LOW)
)
