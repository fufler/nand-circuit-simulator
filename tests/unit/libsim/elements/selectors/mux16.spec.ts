import { Signal } from '@/libsim/Pins'
import { generateRandomNumbers16, makeDeviceSpec, makeInput, prependSignals, wrapBuses } from '../utils'
import { Mux16 } from '@/libsim/elements/selectors/Mux16'

const RANDOM_INPUT = prependSignals(
  1,
  generateRandomNumbers16(50, 2)
)

makeDeviceSpec(
  Mux16,
  wrapBuses(({
    inA,
    inB
  }, { sel }) => ({
    buses: {
      out: sel === Signal.LOW ? inA : inB
    }
  })),
  makeInput(['sel'], ['inA', 'inB'], RANDOM_INPUT)
)
