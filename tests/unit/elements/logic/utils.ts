import { Device2In1Out } from '@/libsim/elements/logic/LogicDevices'
import { Engine } from '@/libsim/Engine'
import { Signal, UpdatablePin } from '@/libsim/Pins'
import { SIGNALS2 } from './constants'
import { expect } from 'chai'
import { Suite } from 'mocha'

export type DeviceProvider = ((engine: Engine) => Device2In1Out)
export type Implementation2In1Out = (inputA: Signal, inputB: Signal) => Signal

export const make2In1OutSpec = (name: string, provider: DeviceProvider, impl: Implementation2In1Out): Suite => describe(name, () => {
  const engine = new Engine()

  const srcA = new UpdatablePin(engine, 'src-a')
  const srcB = new UpdatablePin(engine, 'src-b')
  const result = new UpdatablePin(engine, 'result')

  const device = provider(engine)

  engine.linkPins(srcA, device.inA)
  engine.linkPins(srcB, device.inB)

  engine.linkPins(device.out, result)

  for (const [inA, inB] of SIGNALS2) {
    const expectedOut = impl(inA, inB)

    it(`${name}(${inA}, ${inB}) === ${expectedOut}`, async () => {
      srcA.setSignal(inA)
      srcB.setSignal(inB)

      expect(await engine.run()).to.be.true
      expect(result.getSignal()).to.be.equal(expectedOut)
    })
  }
})
