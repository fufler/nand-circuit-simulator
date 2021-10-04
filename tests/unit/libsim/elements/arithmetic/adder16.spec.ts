import { Signal } from '@/libsim/Pins'
import { fromPins, makeDeviceSpec, randomNumber16, toPins } from '../utils'

import _ from 'lodash'
import { Adder16 } from '@/libsim/elements/arithmetic/Adder16'

const RANDOM_INPUT = _.times(50, () => [randomNumber16(1), randomNumber16()])

makeDeviceSpec(Adder16, (input: Record<string, Signal>) => {
  const [a, b] = _.map(
    ['inA-', 'inB-'],
    p => fromPins(input, p)
  )

  return toPins('out-', (a + b) % 2 ** 16)
}, [
  [0, 0],
  [65535, 1],
  ...RANDOM_INPUT
].map(([a, b]) => ({
  ...toPins('inA-', a),
  ...toPins('inB-', b)
})))
