import { Signal } from '@/libsim/Pins'
import { fromPins, makeDeviceSpec, makeInput, randomNumber16, SIGNALS3, toPins } from '../utils'

import _ from 'lodash'
import { Mux8Way16 } from '@/libsim/elements/selectors/Mux8Way16'

const RANDOM_INPUT = _(10)
  .times(() => _.times(8, randomNumber16))
  .flatMap(values => SIGNALS3.map(s => [...s, ...values]))

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
