import { Engine } from '@/libsim/Engine'
import { Signal } from '@/libsim/Pins'
import { makeSpec, wrap2In1Out } from '../utils'
import { Xor } from '@/libsim/elements/logic/Xor'

makeSpec(
  'Xor',
  (engine: Engine) => new Xor(engine, 'xor'),
  wrap2In1Out((a, b) => a !== b ? Signal.HIGH : Signal.LOW)
)
