import { Engine } from '@/libsim/Engine'
import { Signal } from '@/libsim/Pins'
import { fromPins, makeSpec } from '../utils'
import { DMux4Way } from '@/libsim/elements/selectors/DMux4Way'

import _ from 'lodash'

makeSpec(
  'DMux4Way',
  (engine: Engine) => new DMux4Way(engine, 'dmux4way'),
  (input) => {
    const sel = fromPins(input, 'sel-')

    return _(['outA', 'outB', 'outC', 'outD'])
      .map((p, idx) => [p, idx === sel ? input.in : Signal.LOW])
      .fromPairs()
      .value()
  }
)
