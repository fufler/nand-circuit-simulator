import { Signal } from '@/libsim/Pins'
import { makeDeviceSpec } from '../utils'
import { Mux } from '@/libsim/elements/selectors/Mux'

makeDeviceSpec(
  Mux,
  ({ inA, inB, sel }) => ({ out: sel === Signal.LOW ? inA : inB })
)
