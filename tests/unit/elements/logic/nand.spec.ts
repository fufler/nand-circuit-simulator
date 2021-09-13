import { Engine } from '@/libsim/Engine'
import { Signal } from '@/libsim/Pins'
import { make2In1OutSpec } from './utils'
import { Nand } from '@/libsim/elements/logic/Nand'

make2In1OutSpec(
  'Nand',
  (engine: Engine) => new Nand(engine, 'nand'),
  (inputA, inputB) => inputA === Signal.HIGH && inputB === Signal.HIGH ? Signal.LOW : Signal.HIGH
)
