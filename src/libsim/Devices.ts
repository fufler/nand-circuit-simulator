import { CircuitElement } from '@/libsim/CircuitElement'
import { Pin } from '@/libsim/Pins'
import { Engine } from '@/libsim/Engine'
import { Bus, Bus16 } from '@/libsim/Buses'

export interface DevicePart extends CircuitElement {
  readonly device?: Device
}

export enum DevicePinType {
  INPUT,
  OUTPUT,
  INTERNAL
}

export type DevicePin = [Pin, DevicePinType]
export type DevicePins = Array<DevicePin>

export const inPin = (pin: Pin): DevicePin => [pin, DevicePinType.INPUT]
export const outPin = (pin: Pin): DevicePin => [pin, DevicePinType.OUTPUT]
export const internalPin = (pin: Pin): DevicePin => [pin, DevicePinType.INTERNAL]

export const inBus = (bus: Bus): DevicePins => bus.pins.map(inPin)
export const outBus = (bus: Bus): DevicePins => bus.pins.map(outPin)

export abstract class Device extends CircuitElement implements DevicePart {
    protected engine: Engine
    readonly name: string;
    readonly device?: Device

    abstract getPins(): DevicePins

    abstract getDevices(): Array<Device>

    abstract readonly hasCustomLogic: boolean

    protected constructor (engine: Engine, name: string, device?: Device) {
      super()
      this.engine = engine
      this.name = name
      this.device = device
    }

    abstract propagate(): boolean
}

export abstract class CustomLogicDevice extends Device {
    readonly hasCustomLogic = true

    abstract getPins(): DevicePins
    abstract propagate(): boolean

    getDevices (): Array<Device> {
      return []
    }
}

export abstract class CompoundDevice extends Device {
    readonly hasCustomLogic = false

    protected makePin (name: string): Pin {
      return new Pin(this.engine, name, this)
    }

    protected makeBus16 (name: string): Bus16 {
      return new Bus16(this.engine, name, this)
    }

    abstract getDevices(): Array<Device>;
    abstract getPins(): DevicePins;

    propagate (): boolean {
      return false
    }
}

export abstract class Compound2In1OutDevice extends CompoundDevice {
  readonly inA: Pin
  readonly inB: Pin
  readonly out: Pin

  protected constructor (engine: Engine, name: string, device?: Device) {
    super(engine, name, device)

    this.inA = new Pin(engine, 'inA', this)
    this.inB = new Pin(engine, 'inB', this)
    this.out = new Pin(engine, 'out', this)
  }

  getPins (): DevicePins {
    return [
      inPin(this.inA),
      inPin(this.inB),
      outPin(this.out)
    ]
  }
}

export abstract class Compound2In1OutDevice16 extends CompoundDevice {
  readonly inA: Bus16
  readonly inB: Bus16
  readonly out: Bus16

  protected constructor (engine: Engine, name: string, device?: Device) {
    super(engine, name, device)

    this.inA = new Bus16(engine, 'inA', this)
    this.inB = new Bus16(engine, 'inB', this)
    this.out = new Bus16(engine, 'out', this)
  }

  getPins (): DevicePins {
    return [
      ...inBus(this.inA),
      ...inBus(this.inB),
      ...outBus(this.out)
    ]
  }
}
