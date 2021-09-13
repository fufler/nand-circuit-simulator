import { Engine } from '@/libsim/Engine'
import { UpdatablePin, Signal } from '@/libsim/Pins'
import { expect } from 'chai'
import { Not } from '@/libsim/elements/logic/Not'

import { SIGNALS } from './constants'

describe('Not', () => {
  const engine = new Engine()

  const src = new UpdatablePin(engine, 'src')
  const result = new UpdatablePin(engine, 'result')

  const not = new Not(engine, 'not')

  engine.linkPins(src, not.in)
  engine.linkPins(not.out, result)

  for (const signal of SIGNALS) {
    const expectedOut = signal === Signal.HIGH ? Signal.LOW : Signal.HIGH

    it(`Not(${signal}) === ${expectedOut}`, async () => {
      src.setSignal(signal)

      expect(await engine.run()).to.be.true
      expect(result.getSignal()).to.be.equal(expectedOut)
    })
  }
})
