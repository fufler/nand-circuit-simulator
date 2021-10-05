import { Signal } from '@/libsim/Pins'
import { makeDeviceSpec, wrapBuses } from '../utils'
import { DMux4Way } from '@/libsim/elements/selectors/DMux4Way'

import _ from 'lodash'

makeDeviceSpec(
  DMux4Way,
  wrapBuses(buses => _(['outA', 'outB', 'outC', 'outD'])
    .map((p, idx) => [p, idx === buses.sel ? buses.in : Signal.LOW])
    .fromPairs()
    .value()
  )
)
