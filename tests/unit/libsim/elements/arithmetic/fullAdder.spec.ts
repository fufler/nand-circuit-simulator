import { Signal } from '@/libsim/Pins'
import { makeDeviceSpec } from '../utils'
import { FullAdder } from '@/libsim/elements/arithmetic/FullAdder'

makeDeviceSpec(FullAdder, ({
  inA,
  inB,
  inC
}) => {
  const a = inA === Signal.LOW ? 0 : 1
  const b = inB === Signal.LOW ? 0 : 1
  const c = inC === Signal.LOW ? 0 : 1

  const s = a + b + c

  return {
    outSum: s % 2,
    outCarry: Math.floor(s / 2)
  }
})
