import { Signal } from '@/libsim/Pins'
import { makeDeviceSpec, wrapBuses } from '../utils'

import _ from 'lodash'
import { DMux8Way } from '@/libsim/elements/selectors/DMux8Way'

makeDeviceSpec(
  DMux8Way,
  wrapBuses(buses => _(['outA', 'outB', 'outC', 'outD', 'outE', 'outF', 'outG', 'outH'])
    .map((p, idx) => [p, idx === buses.sel ? buses.in : Signal.LOW])
    .fromPairs()
    .value()
  )
)
