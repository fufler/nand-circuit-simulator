import { Engine } from '@/libsim/Engine'
import { Signal } from '@/libsim/Pins'
import { fromPins, groupByPrefixFormatter, makeDeviceSpec, randomNumber16, toPins } from '../utils'

import _ from 'lodash'
import { Not16 } from '@/libsim/elements/logic/Not16'

const RANDOM_INPUT = _.times(50, randomNumber16)

makeDeviceSpec(
  'Not16',
  (engine: Engine) => new Not16(engine, 'Not16'),
  (input: Record<string, Signal>) => {
    const a = fromPins(input, 'in-')

    return toPins('out-', 0xFFFFFFFF - a)
  },
  RANDOM_INPUT.map(a => toPins('in-', a)),
  groupByPrefixFormatter(/(in|out)-(\d)/)
)
