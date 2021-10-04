import { Engine } from '@/libsim/Engine'
import { Signal } from '@/libsim/Pins'
import { makeDeviceSpec } from '../utils'
import { Mux } from '@/libsim/elements/selectors/Mux'

makeDeviceSpec(
  'Mux',
  (engine: Engine) => new Mux(engine, 'mux'),
  ({ inA, inB, sel }) => {
    return {
      out: sel === Signal.LOW ? inA : inB
    }
  }
)
