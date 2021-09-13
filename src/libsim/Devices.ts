import { CircuitElement } from '@/libsim/CircuitElement'
import { Pin } from '@/libsim/Pins'
import { Engine } from '@/libsim/Engine'

export interface DevicePart extends CircuitElement {
  readonly device?: Device
}

export abstract class Device extends CircuitElement implements DevicePart {
    protected engine: Engine
    readonly name: string;
    readonly device?: Device

    abstract getPins(): Array<Pin>

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

    abstract getPins(): Array<Pin>;
    abstract propagate(): boolean;

    getDevices (): Array<Device> {
      return []
    }
}

export abstract class CompoundDevice extends Device {
    readonly hasCustomLogic = false

    abstract getDevices(): Array<Device>;
    abstract getPins(): Array<Pin>;

    propagate (): boolean {
      return false
    }
}
