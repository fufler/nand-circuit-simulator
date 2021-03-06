import { Signal } from '@/libsim/Pins'
import { makeDeviceSpec, wrap2In1Out } from '../utils'
import { Nand } from '@/libsim/elements/logic/Nand'

makeDeviceSpec(
  Nand,
  wrap2In1Out((a, b) => a === Signal.HIGH && b === Signal.HIGH ? Signal.LOW : Signal.HIGH)
)
