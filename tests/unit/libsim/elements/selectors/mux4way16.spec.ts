import { Engine } from '@/libsim/Engine'
import { Signal } from '@/libsim/Pins'
import { fromPins, groupByPrefixFormatter, makeSpec, randomNumber16, toPins } from '../utils'

import _ from 'lodash'
import { Mux4Way16 } from '@/libsim/elements/selectors/Mux4Way16'

const RANDOM_INPUT = _(15)
  .times(() => [randomNumber16(), randomNumber16(), randomNumber16(), randomNumber16()])
  .flatMap(values => [
    [Signal.LOW, Signal.LOW, ...values],
    [Signal.LOW, Signal.HIGH, ...values],
    [Signal.HIGH, Signal.LOW, ...values],
    [Signal.HIGH, Signal.HIGH, ...values]
  ])

makeSpec(
  'Mux4Way16',
  (engine: Engine) => new Mux4Way16(engine, 'Mux4Way16'),
  (input: Record<string, Signal>) => {
    const inputValues = _.map(
      ['inA-', 'inB-', 'inC-', 'inD-'],
      p => fromPins(input, p)
    )

    const sel = fromPins(input, 'sel-')

    return toPins('out-', inputValues[sel])
  },
  RANDOM_INPUT.map(([sel1, sel0, a, b, c, d]) => ({
    'sel-0': sel0,
    'sel-1': sel1,
    ...toPins('inA-', a),
    ...toPins('inB-', b),
    ...toPins('inC-', c),
    ...toPins('inD-', d)
  })),
  groupByPrefixFormatter(/(sel|in\w|out)-(\d)/)
)
