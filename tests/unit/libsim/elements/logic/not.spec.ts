import { Signal } from '@/libsim/Pins'
import { Not } from '@/libsim/elements/logic/Not'
import { makeDeviceSpec } from '../utils'

makeDeviceSpec(
  Not,
  input => ({ out: input.in === Signal.HIGH ? Signal.LOW : Signal.HIGH })
)
