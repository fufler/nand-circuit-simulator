import { Engine } from '@/libsim/Engine'
import { Signal } from '@/libsim/Pins'
import { fromPins, groupByPrefixFormatter, makeSpec, randomNumber16, toPins } from '../utils'

import _ from 'lodash'
import { Mux8Way16 } from '@/libsim/elements/selectors/Mux8Way16'

const RANDOM_INPUT = _(10)
  .times(() => _.times(8, randomNumber16))
  .flatMap(values => [
    [Signal.LOW, Signal.LOW, Signal.LOW, ...values],
    [Signal.LOW, Signal.LOW, Signal.HIGH, ...values],
    [Signal.LOW, Signal.HIGH, Signal.LOW, ...values],
    [Signal.LOW, Signal.HIGH, Signal.HIGH, ...values],
    [Signal.HIGH, Signal.LOW, Signal.LOW, ...values],
    [Signal.HIGH, Signal.LOW, Signal.HIGH, ...values],
    [Signal.HIGH, Signal.HIGH, Signal.LOW, ...values],
    [Signal.HIGH, Signal.HIGH, Signal.HIGH, ...values]
  ])

makeSpec(
  'Mux8Way16',
  (engine: Engine) => new Mux8Way16(engine, 'Mux8Way16'),
  (input: Record<string, Signal>) => {
    const inputValues = _.map(
      ['inA-', 'inB-', 'inC-', 'inD-', 'inE-', 'inF-', 'inG-', 'inH-'],
      p => fromPins(input, p)
    )

    const sel = fromPins(input, 'sel-')

    return toPins('out-', inputValues[sel])
  },
  RANDOM_INPUT.map(([sel2, sel1, sel0, a, b, c, d, e, f, g, h]) => ({
    'sel-0': sel0,
    'sel-1': sel1,
    'sel-2': sel2,
    ...toPins('inA-', a),
    ...toPins('inB-', b),
    ...toPins('inC-', c),
    ...toPins('inD-', d),
    ...toPins('inE-', e),
    ...toPins('inF-', f),
    ...toPins('inG-', g),
    ...toPins('inH-', h)
  })),
  groupByPrefixFormatter(/(sel|in\w|out)-(\d)/)
)
