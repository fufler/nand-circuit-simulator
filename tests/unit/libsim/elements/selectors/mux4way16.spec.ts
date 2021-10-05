import { generateRandomNumbers16, makeDeviceSpec, makeInput, prependSignals, wrapBuses } from '../utils'
import { Mux4Way16 } from '@/libsim/elements/selectors/Mux4Way16'

const RANDOM_INPUT = prependSignals(
  2,
  generateRandomNumbers16(15, 4)
)

const DATA_BUSES = ['inA', 'inB', 'inC', 'inD']

makeDeviceSpec(
  Mux4Way16,
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
