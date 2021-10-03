import { Engine } from '@/libsim/Engine'
import { Signal } from '@/libsim/Pins'
import { fromPins, makeSpec } from '../utils'

import _ from 'lodash'
import { DMux8Way } from '@/libsim/elements/selectors/DMux8Way'

makeSpec(
  'DMux8Way',
  (engine: Engine) => new DMux8Way(engine, 'dmux8way'),
  (input) => {
    const sel = fromPins(input, 'sel-')

    return _(['outA', 'outB', 'outC', 'outD', 'outE', 'outF', 'outG', 'outH'])
      .map((p, idx) => [p, idx === sel ? input.in : Signal.LOW])
      .fromPairs()
      .value()
  }
)
