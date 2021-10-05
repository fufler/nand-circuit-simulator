<template>
  <div class="circuit-simulator">
    <div
      v-show="editDefinitionMode"
      class="definition"
    >
      <textarea v-model="definition"/>
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
import { CircuitElement } from '@/libsim/CircuitElement'
import { Pin, Signal } from '@/libsim/Pins'

import _ from 'lodash'
import { ALU } from '@/libsim/elements/arithmetic/ALU'

const pins = [
  ..._(16).times(n => ({
    id: `inA-${n}`,
    name: `inA-${n}`,
    signal: n === 15 ? Signal.HIGH : Signal.LOW
  })),
  ..._(16).times(n => ({
    id: `inB-${n}`,
    name: `inB-${n}`,
    signal: n === 10 ? Signal.HIGH : Signal.LOW
  })),
  {
    id: 'f',
    name: 'f',
    signal: Signal.HIGH
  },
  {
    id: 'zx',
    name: 'zx',
    signal: Signal.LOW
  },
  {
    id: 'nx',
    name: 'nx',
    signal: Signal.LOW
  },
  {
    id: 'zy',
    name: 'zy',
    signal: Signal.LOW
  },
  {
    id: 'ny',
    name: 'ny',
    signal: Signal.LOW
  },
  {
    id: 'no',
    name: 'no',
    signal: Signal.HIGH
  }
]

const defaultCircuitDefinition: CircuitDefinition = {
  pins: [
    ...pins,
    ..._.times(16, n => ({
      id: `dst-${n}`,
      name: `dst-${n}`
    }))
  ],

  devices: [
    {
      type: 'ALU',
      id: 'alu'
    }
  ],
  links: [
    ...pins.map(p => ({
      srcId: p.id,
      dstId: `alu.${p.id}`
    })),
    ..._.times(16, n => ({
      srcId: `alu.out-${n}`,
      dstId: `dst-${n}`
    }))
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
  fit = false
  rankSep = 200
  nodeSep = 50
  edgeSep = 50
}

export default Vue.extend({
  name: 'CircuitSimulator',

  data (): CircuitSimulatorData {
    return {
      definition: JSON.stringify(defaultCircuitDefinition, null, 2),
      editDefinitionMode: true,
      graphDisplayDepth: '1',
      simulationInterval: '10'
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
      engine.registerDeviceConstructor(ALU, 'ALU')

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

          const cyEl = options.cy.getElementById(e.id)

          if (cyEl.size() === 0) {
            return false
          }

          cyEl.removeClass(['high-signal', 'low-signal'])

          const signal = e.getSignal()

          if (signal !== undefined) {
            cyEl.addClass(signal === Signal.LOW ? 'low-signal' : 'high-signal')
          }

          return true
        },
        parseInt(this.simulationInterval, 10),
        100000
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

    > button {
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
