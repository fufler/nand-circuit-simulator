import { Signal } from '@/libsim/Pins'
import { fromPins, makeDeviceSpec, makeInput, randomNumber16, toPins } from '../utils'

import _ from 'lodash'
import { Mux16 } from '@/libsim/elements/selectors/Mux16'

const RANDOM_INPUT = _(50)
  .times(() => [randomNumber16(), randomNumber16()])
  .flatMap(values => [
    [Signal.LOW, ...values],
    [Signal.HIGH, ...values]
  ])

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
