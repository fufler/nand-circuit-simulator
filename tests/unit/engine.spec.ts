import { Engine, InvalidArgumentError, LinkError } from '@/libsim/Engine'
import { Pin, Signal, UpdatablePin } from '@/libsim/Pins'
import { expect } from 'chai'
import { And } from '@/libsim/elements/logic/And'
import { Or } from '@/libsim/elements/logic/Or'
import { SIGNALS2 } from './elements/logic/constants'
import { Not } from '@/libsim/elements/logic/Not'
import { CircuitDefinition } from '@/libsim/CircuitDefinition'

describe('Engine', () => {
  it('should not allow duplicate links', () => {
    const engine = new Engine()

    const pinA = new Pin(engine, 'a')
    const pinB = new Pin(engine, 'b')

    engine.linkPins(pinA, pinB)

    expect(
      () => engine.linkPins(pinA, pinB)
    ).to.throw(LinkError)
  })

  it('should not allow multiple in-links', () => {
    const engine = new Engine()

    const pinA = new Pin(engine, 'a')
    const pinB = new Pin(engine, 'b')
    const pinC = new Pin(engine, 'c')

    engine.linkPins(pinA, pinB)

    expect(
      () => engine.linkPins(pinC, pinB)
    ).to.throw(LinkError)
  })

  it('should fail to load definition if unknown device is specified', () => {
    const engine = new Engine()

    expect(() =>
      engine.loadDefinition({
        pins: [
          { id: 'a' }
        ],
        devices: [
          {
            type: 'Whatever',
            id: 'whatever'
          }
        ],
        links: [
          {
            srcId: 'a',
            dstId: 'whatever.in'
          }
        ]
      })
    ).to.throw(InvalidArgumentError)
  })

  it('should fail to load invalid definition', () => {
    const engine = new Engine()

    const def = { thisDefinitionIs: 'Invalid' }

    expect(() =>
      engine.loadDefinition(<CircuitDefinition><unknown>def)
    ).to.throw(InvalidArgumentError)
  })

  it('should properly load circuit from valid definition', () => {
    const engine = new Engine()

    engine.registerDeviceConstructor(And)
    engine.registerDeviceConstructor(Or)
    engine.registerDeviceConstructor(Not)

    // A && B || C && !D
    engine.loadDefinition({
      pins: [
        {
          id: 'src-a',
          name: 'srcA'
        },
        {
          id: 'src-b',
          name: 'srcB'
        },
        {
          id: 'src-c',
          name: 'srcC'
        },
        {
          id: 'src-d',
          name: 'srcD'
        },
        {
          id: 'dst',
          name: 'dst'
        }
      ],
      devices: [
        {
          type: 'And',
          id: 'and-a-b'
        },
        {
          type: 'Not',
          id: 'not-d'
        },
        {
          type: 'And',
          id: 'and-c-d'
        },
        {
          type: 'Or',
          id: 'or'
        }
      ],
      links: [
        {
          srcId: 'src-a',
          dstId: 'and-a-b.inA'
        },
        {
          srcId: 'src-b',
          dstId: 'and-a-b.inB'
        },
        {
          srcId: 'src-c',
          dstId: 'and-c-d.inA'
        },
        {
          srcId: 'src-d',
          dstId: 'not-d.in'
        },
        {
          srcId: 'not-d.out',
          dstId: 'and-c-d.inB'
        },
        {
          srcId: 'and-a-b.out',
          dstId: 'or.inA'
        },
        {
          srcId: 'and-c-d.out',
          dstId: 'or.inB'
        },
        {
          srcId: 'or.out',
          dstId: 'dst'
        }
      ]
    })

    const allPins = engine.getPins()

    const srcA = allPins.find(p => p.name === 'srcA') as UpdatablePin
    const srcB = allPins.find(p => p.name === 'srcB') as UpdatablePin
    const srcC = allPins.find(p => p.name === 'srcC') as UpdatablePin
    const srcD = allPins.find(p => p.name === 'srcD') as UpdatablePin
    const dst = allPins.find(p => p.name === 'dst') as Pin

    for (const [inA, inB] of SIGNALS2) {
      for (const [inC, inD] of SIGNALS2) {
        const expectedResult = (inA === Signal.HIGH && inB === Signal.HIGH) || (inC === Signal.HIGH && inD === Signal.LOW)
          ? Signal.HIGH
          : Signal.LOW

        srcA.setSignal(inA)
        srcB.setSignal(inB)
        srcC.setSignal(inC)
        srcD.setSignal(inD)

        engine.run()

        expect(dst.getSignal()).to.be.equal(expectedResult)
      }
    }
  })
})
