import { CircuitElement } from '@/libsim/CircuitElement'
import { Engine } from '@/libsim/Engine'
import { Device, DevicePart } from '@/libsim/Devices'

export enum Signal {
    LOW,
    HIGH
}

export class Pin extends CircuitElement implements DevicePart {
    protected readonly engine: Engine
    readonly name: string
    public readonly device?: Device
    protected signal?: Signal

    constructor (engine: Engine, name: string, device?: Device) {
      super()
      this.engine = engine
      this.device = device
      this.name = name
      this.signal = undefined
    }

    getSignal (): Signal | undefined {
      return this.engine.getSignalFromLinkedPin(this) ?? this.signal
    }

    propagate (): boolean {
      const signalFromLinkedPin = this.engine.getSignalFromLinkedPin(this)

      if (signalFromLinkedPin === undefined) { return true }

      if (this.signal === signalFromLinkedPin) { return false }

      this.signal = signalFromLinkedPin

      if (this.device == null || !this.device.hasCustomLogic) { return true }

      this.engine.propagate(this.device)
      return false
    }
}

export class FalsePin extends Pin {
  getSignal (): Signal {
    return Signal.LOW
  }
}

export class TruePin extends Pin {
  getSignal (): Signal {
    return Signal.HIGH
  }
}

export class UpdatablePin extends Pin {
  setSignal (signal: Signal): void {
    if (signal === this.signal) { return }

    this.signal = signal
    this.engine.propagate([this])
  }
}
