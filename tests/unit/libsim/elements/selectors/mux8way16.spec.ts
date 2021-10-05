import { Signal } from '@/libsim/Pins'
import { fromPins, generateRandomNumbers16, makeDeviceSpec, makeInput, prependSignals, toPins } from '../utils'

import _ from 'lodash'
import { Mux8Way16 } from '@/libsim/elements/selectors/Mux8Way16'

const RANDOM_INPUT = prependSignals(
  3,
  generateRandomNumbers16(10, 8)
)

makeDeviceSpec(
  Mux8Way16,
  (input: Record<string, Signal>) => {
    const inputValues = _.map(
      ['inA-', 'inB-', 'inC-', 'inD-', 'inE-', 'inF-', 'inG-', 'inH-'],
      p => fromPins(input, p)
    )

    const sel = fromPins(input, 'sel-')

    return toPins('out-', inputValues[sel])
  },
  makeInput(
    [],
    ['sel', 'inA', 'inB', 'inC', 'inD', 'inE', 'inF', 'inG', 'inH'],
    RANDOM_INPUT
  )
)
