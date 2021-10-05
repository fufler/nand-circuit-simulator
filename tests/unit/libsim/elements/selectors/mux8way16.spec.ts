import { generateRandomNumbers16, makeDeviceSpec, makeInput, prependSignals, wrapBuses } from '../utils'
import { Mux8Way16 } from '@/libsim/elements/selectors/Mux8Way16'

const RANDOM_INPUT = prependSignals(
  3,
  generateRandomNumbers16(10, 8)
)

const DATA_BUSES = ['inA', 'inB', 'inC', 'inD', 'inE', 'inF', 'inG', 'inH']

makeDeviceSpec(
  Mux8Way16,
  wrapBuses(buses => ({
    buses: {
      out: buses[DATA_BUSES[buses.sel]]
    }
  })),
  makeInput(
    [],
    ['sel', ...DATA_BUSES],
    RANDOM_INPUT
  )
)
