import { CircuitElement } from '@/libsim/CircuitElement'
import { Pin } from '@/libsim/Pins'
import { Engine } from '@/libsim/Engine'

export interface DevicePart extends CircuitElement {
  readonly device?: Device
}

export enum DevicePinType {
  INPUT,
  OUTPUT
}

export type DevicePins = Array<[Pin, DevicePinType]>

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

    abstract getDevices(): Array<Device>;
    abstract getPins(): DevicePins;

    propagate (): boolean {
      return false
    }
}

export interface Device2In {
  readonly inA: Pin
  readonly inB: Pin
}

export interface Device1Out {
  readonly out: Pin
}

export interface Device2In1Out extends Device2In, Device1Out {}

export const listDevice2In1OutPins = (device: Device2In1Out): DevicePins => {
  return [
    [device.inA, DevicePinType.INPUT],
    [device.inB, DevicePinType.INPUT],
    [device.out, DevicePinType.OUTPUT]
  ]
}
