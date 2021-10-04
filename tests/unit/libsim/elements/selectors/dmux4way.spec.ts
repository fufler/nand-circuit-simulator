import { Signal } from '@/libsim/Pins'
import { fromPins, makeDeviceSpec } from '../utils'
import { DMux4Way } from '@/libsim/elements/selectors/DMux4Way'

import _ from 'lodash'

makeDeviceSpec(DMux4Way, (input) => {
  const sel = fromPins(input, 'sel-')

  return _(['outA', 'outB', 'outC', 'outD'])
    .map((p, idx) => [p, idx === sel ? input.in : Signal.LOW])
    .fromPairs()
    .value()
})
