import { Signal } from '@/libsim/Pins'
import { fromPins, makeDeviceSpec, makeInput, randomNumber16, SIGNALS2, toPins } from '../utils'

import _ from 'lodash'
import { Mux4Way16 } from '@/libsim/elements/selectors/Mux4Way16'

const RANDOM_INPUT = _(15)
  .times(() => _.times(4, randomNumber16))
  .flatMap(values => SIGNALS2.map(s => [...s, ...values]))

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
