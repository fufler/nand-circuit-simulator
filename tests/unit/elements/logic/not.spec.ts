import { Engine } from '@/libsim/Engine'
import { Signal } from '@/libsim/Pins'
import { Not } from '@/libsim/elements/logic/Not'
import { makeSpec } from '../utils'

makeSpec(
  'Not',
  (engine: Engine) => new Not(engine, 'not'),
  input => ({ out: input.in === Signal.HIGH ? Signal.LOW : Signal.HIGH })
)
