import { Signal } from '@/libsim/Pins'
import { makeDeviceSpec } from '../utils'
import { HalfAdder } from '@/libsim/elements/arithmetic/HalfAdder'

makeDeviceSpec(HalfAdder, ({
  inA,
  inB
}) => {
  const a = inA === Signal.LOW ? 0 : 1
  const b = inB === Signal.LOW ? 0 : 1
  const c = a + b

  return {
    outSum: c % 2,
    outCarry: Math.floor(c / 2)
  }
})
