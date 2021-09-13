<template>
  <div class="circuit-simulator">
    <div
      v-show="editDefinitionMode"
      class="definition"
    >
      <textarea v-model="definition" />
      <button
        @click="loadDefinition"
      >
        Load
      </button>
    </div>
    <div
      v-show="!editDefinitionMode"
      class="simulator"
    >
      <div
        class="cytoscape-container"
        ref="cytoscape"
      />
      <div class="controls">
        <button
          @click="loadDefinition"
        >
          Reset
        </button>
        <button
          class="run"
          @click="run"
        >
          Run
        </button>
        <input
          placeholder="Graph display depth"
          v-model="graphDisplayDepth"
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import { CircuitDefinition, parseDefinitionString } from '@/libsim/CircuitDefinition'

import cytoscape, { BaseLayoutOptions, ElementDefinition } from 'cytoscape'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import coseBilkent from 'cytoscape-cose-bilkent'
import cytoscapeDagre from 'cytoscape-dagre'
import { Engine } from '@/libsim/Engine'
import { Device, DevicePart } from '@/libsim/Devices'
import { And } from '@/libsim/elements/logic/And'
import { Or } from '@/libsim/elements/logic/Or'
import { Not } from '@/libsim/elements/logic/Not'
import { CircuitElement } from '@/libsim/CircuitElement'
import { Pin, Signal } from '@/libsim/Pins'

const defaultCircuitDefinition: CircuitDefinition = {
  pins: [
    {
      id: 'src-a',
      name: 'srcA',
      signal: Signal.LOW
    },
    {
      id: 'src-b',
      name: 'srcB',
      signal: Signal.HIGH
    },
    {
      id: 'src-c',
      name: 'srcC',
      signal: Signal.HIGH
    },
    {
      id: 'src-d',
      name: 'srcD',
      signal: Signal.LOW
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
}

interface CircuitSimulatorData {
  definition: string
  editDefinitionMode: boolean,
  graphDisplayDepth: string,
  simulationInterval: string
}

interface CustomThis$Options {
  cy: cytoscape.Core,
  engine: Engine
}

class CustomCyLayoutOptions implements BaseLayoutOptions {
  name = 'dagre'
  nodeDimensionsIncludeLabels = true
}

export default Vue.extend({
  name: 'CircuitSimulator',

  data (): CircuitSimulatorData {
    return {
      definition: JSON.stringify(defaultCircuitDefinition, null, 2),
      editDefinitionMode: true,
      graphDisplayDepth: '1',
      simulationInterval: '100'
    }
  },

  mounted (): void {
    cytoscape.use(coseBilkent)
    cytoscape.use(cytoscapeDagre)

    const opts = this.$options as unknown as CustomThis$Options

    opts.cy = cytoscape({
      container: this.$refs.cytoscape as HTMLElement,
      style: [
        {
          selector: 'node',
          style: {
            label: 'data(label)'
          }
        },
        {
          selector: 'node.device:selected',
          style: {
            'background-color': '#f5e663' // --color3
          }
        },
        {
          selector: 'node.device',
          style: {
            shape: 'round-rectangle'
          }
        },
        {
          selector: 'node.high-signal',
          style: {
            'background-color': '#73a580' // --color5
          }
        },
        {
          selector: 'node.low-signal',
          style: {
            'background-color': '#bc4b51' // --color4
          }
        }
      ]
    })
  },

  methods: {
    loadDefinition (): void {
      const engine = (this.$options as CustomThis$Options).engine = new Engine()
      engine.registerDeviceConstructor(And, 'And')
      engine.registerDeviceConstructor(Or, 'Or')
      engine.registerDeviceConstructor(Not, 'Not')

      const def = parseDefinitionString(this.definition)
      engine.loadDefinition(def)

      const cy = (this.$options as unknown as CustomThis$Options).cy as cytoscape.Core

      const elements: Array<ElementDefinition> = []

      const links = engine.getLinks()

      const devices = new Set<Device>()

      const depths = new Map<string, number>()

      const getElementDepth = (e?: DevicePart): number => {
        if (e === undefined) {
          return 0
        }

        if (depths.has(e.id)) {
          return depths.get(e.id) as number
        }

        const depth = getElementDepth(e.device) + (e instanceof Device ? 1 : 0)

        depths.set(e.id, depth)

        return depth
      }

      const allowedDepth = parseInt(this.graphDisplayDepth, 10)

      for (const { src, dst } of links) {
        let skip = false

        for (const e of [src, dst]) {
          if (getElementDepth(e) > allowedDepth) {
            skip = true
            break
          }

          elements.push({
            group: 'nodes',
            classes: 'pin',
            data: {
              id: e.id,
              label: e.name,
              parent: e.device?.id
            }
          })

          if (e.device !== undefined) {
            devices.add(e.device)
          }
        }

        if (skip) {
          continue
        }

        elements.push({
          group: 'edges',
          data: {
            id: `${src.id} - ${dst.id}`,
            source: src.id,
            target: dst.id
          }
        })
      }

      const q = Array.from(devices)

      while (q.length > 0) {
        const d = q.pop() as Device

        if (d.device !== undefined && !devices.has(d.device)) {
          devices.add(d.device)
          q.push(d.device)
        }
      }

      for (const device of devices) {
        elements.push({
          group: 'nodes',
          classes: 'device',
          data: {
            id: device.id,
            parent: device.device?.id,
            label: device.name
          }
        })
      }

      cy.startBatch()
      cy.elements().remove()
      cy.add(elements)
      cy.endBatch()

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      cy.layout(new CustomCyLayoutOptions()).run()

      this.editDefinitionMode = false
    },

    run (): void {
      const options = this.$options as CustomThis$Options
      options.engine.run(
        (e: CircuitElement) => {
          if (!(e instanceof Pin)) {
            return false
          }

          options.cy.startBatch()
          const cyEl = options.cy.getElementById(e.id)
          cyEl.removeClass(['high-signal', 'low-signal'])

          const signal = e.getSignal()

          if (signal !== undefined) {
            cyEl.addClass(signal === Signal.LOW ? 'low-signal' : 'high-signal')
          }

          options.cy.endBatch()

          return true
        },
        parseInt(this.simulationInterval, 10)
      )
    }
  }
})

</script>

<style scoped lang="scss">
.circuit-simulator {
  flex: 1;
  display: flex;

  .definition {
    flex: 1;

    display: flex;
    flex-direction: column;
    row-gap: 20px;

    padding: 100px 500px;

    justify-content: center;
    align-items: center;

    > textarea {
      flex: 1;
      width: 100%;
    }

    > button  {
      align-self: flex-end;
    }
  }

  .simulator {
    flex: 1;

    display: flex;
    flex-direction: column;

    .cytoscape-container {
      flex: 1;
    }

    .controls {
      z-index: 1;
      display: flex;
      column-gap: 20px;

      background-color: var(--color7);

      box-shadow: 0 0 10px var(--color2);

      padding: 10px 0;
      justify-content: center;
    }
  }
}
</style>
