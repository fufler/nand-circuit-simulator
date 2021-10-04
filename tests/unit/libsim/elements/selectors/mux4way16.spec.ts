import { Signal } from '@/libsim/Pins'
import { fromPins, groupByPrefixFormatter, makeDeviceSpec, randomNumber16, SIGNALS2, toPins } from '../utils'

import _ from 'lodash'
import { Mux4Way16 } from '@/libsim/elements/selectors/Mux4Way16'

const RANDOM_INPUT = _(15)
  .times(() => _.times(4, randomNumber16))
  .flatMap(values => SIGNALS2.map(s => [...s, ...values]))

makeDeviceSpec(Mux4Way16, (input: Record<string, Signal>) => {
  const inputValues = _.map(
    ['inA-', 'inB-', 'inC-', 'inD-'],
    p => fromPins(input, p)
  )

  const sel = fromPins(input, 'sel-')

  return toPins('out-', inputValues[sel])
}, RANDOM_INPUT.map(([sel1, sel0, a, b, c, d]) => ({
  'sel-0': sel0,
  'sel-1': sel1,
  ...toPins('inA-', a),
  ...toPins('inB-', b),
  ...toPins('inC-', c),
  ...toPins('inD-', d)
})), groupByPrefixFormatter(/(sel|in\w|out)-(\d)/))
