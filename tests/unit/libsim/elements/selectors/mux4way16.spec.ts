import { Signal } from '@/libsim/Pins'
import { fromPins, generateRandomNumbers16, makeDeviceSpec, makeInput, prependSignals, toPins } from '../utils'

import _ from 'lodash'
import { Mux4Way16 } from '@/libsim/elements/selectors/Mux4Way16'

const RANDOM_INPUT = prependSignals(
  2,
  generateRandomNumbers16(15, 4)
)

makeDeviceSpec(
  Mux4Way16,
  (input: Record<string, Signal>) => {
    const inputValues = _.map(
      ['inA-', 'inB-', 'inC-', 'inD-'],
      p => fromPins(input, p)
    )

    const sel = fromPins(input, 'sel-')

    return toPins('out-', inputValues[sel])
  },
  makeInput(
    [],
    ['sel', 'inA', 'inB', 'inC', 'inD'],
    RANDOM_INPUT
  )
)
