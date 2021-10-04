import { Signal } from '@/libsim/Pins'
import { makeDeviceSpec } from '../utils'
import { DMux } from '@/libsim/elements/selectors/DMux'

makeDeviceSpec(DMux, (input) => {
  return {
    outA: input.sel === Signal.LOW ? input.in : Signal.LOW,
    outB: input.sel === Signal.HIGH ? input.in : Signal.LOW
  }
})
