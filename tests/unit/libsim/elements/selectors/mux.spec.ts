import { Engine } from '@/libsim/Engine'
import { Signal } from '@/libsim/Pins'
import { makeSpec } from '../utils'
import { Mux } from '@/libsim/elements/selectors/Mux'

makeSpec(
  'Mux',
  (engine: Engine) => new Mux(engine, 'mux'),
  ({ inA, inB, sel }) => {
    return {
      out: sel === Signal.LOW ? inA : inB
    }
  }
)
