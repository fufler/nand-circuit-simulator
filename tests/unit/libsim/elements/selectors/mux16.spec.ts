import { Signal } from '@/libsim/Pins'
import { fromPins, generateRandomNumbers16, makeDeviceSpec, makeInput, prependSignals, toPins } from '../utils'

import _ from 'lodash'
import { Mux16 } from '@/libsim/elements/selectors/Mux16'

const RANDOM_INPUT = prependSignals(
  1,
  generateRandomNumbers16(50, 2)
)

makeDeviceSpec(
  Mux16,
  (input: Record<string, Signal>) => {
    const [a, b] = _.map(
      ['inA-', 'inB-'],
      p => fromPins(input, p)
    )

    return toPins('out-', input.sel === Signal.LOW ? a : b)
  },
  makeInput(['sel'], ['inA', 'inB'], RANDOM_INPUT)
)
