import { CircuitElement } from '@/libsim/CircuitElement'
import { FalsePin, Pin, TruePin } from '@/libsim/Pins'
import { Engine } from '@/libsim/Engine'
import { Bus, PinBus } from '@/libsim/Buses'

import _ from 'lodash'

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

export type DeviceConstructor<T extends Device> = new (engine: Engine, name: string, device?: Device) => T

export abstract class Device extends CircuitElement implements DevicePart {
  protected engine: Engine
  readonly name: string
  readonly device?: Device

  abstract getPins (): DevicePins
  abstract getBuses (): Array<Bus>

  abstract getDevices (): Array<Device>

  abstract init (): void

  abstract readonly hasCustomLogic: boolean

  constructor (engine: Engine, name: string, device?: Device) {
    super()
    this.engine = engine
    this.name = name
    this.device = device
  }

  linkPins (src: Pin, dst: Pin): void {
    this.engine.linkPins(src, dst)
  }

  linkBuses (src: Bus | PinBus, dst: Bus | PinBus): void {
    this.engine.linkBuses(src, dst)
  }

  abstract propagate (): boolean
}

export abstract class CustomLogicDevice extends Device {
  readonly hasCustomLogic = true

  getDevices (): Array<Device> {
    return []
  }
}

export abstract class CompoundDevice extends Device {
  readonly hasCustomLogic = false

  private pins: DevicePins = []
  private buses: Array<Bus> = []
  private devices: Array<Device> = []

  private storePin<T extends Pin> (pin: T, type: DevicePinType): T {
    this.pins.push([pin, type])

    return pin
  }

  private makePin (name: string, type: DevicePinType): Pin {
    return this.storePin(
      new Pin(this.engine, name, this),
      type
    )
  }

  protected makeInPin (name: string): Pin {
    return this.makePin(name, DevicePinType.INPUT)
  }

  protected makeOutPin (name: string): Pin {
    return this.makePin(name, DevicePinType.OUTPUT)
  }

  private makeBus (length: number, name: string, type: DevicePinType): Bus {
    const bus = new Bus(length, this.engine, name, this)

    this.buses.push(bus)

    bus.pins.forEach(p => this.storePin(p, type))

    return bus
  }

  protected makeInBus (length: number, name: string): Bus {
    return this.makeBus(length, name, DevicePinType.INPUT)
  }

  protected makeOutBus (length: number, name: string): Bus {
    return this.makeBus(length, name, DevicePinType.OUTPUT)
  }

  protected makeDevices<T extends Device> (count: number, ctor: DeviceConstructor<T>, name: string): Array<T> {
    // eslint-disable-next-line new-cap
    const devices = _.times(count, n => new ctor(this.engine, `${name}-${n + 1}`, this))

    devices.forEach(d => d.init())

    this.devices.push(...devices)

    return devices
  }

  protected makeDevice<T extends Device> (ctor: DeviceConstructor<T>, name: string): T {
    return this.makeDevices(1, ctor, name)[0]
  }

  protected makeFalsePin (name: string): FalsePin {
    return this.storePin(
      new FalsePin(this.engine, name, this),
      DevicePinType.INTERNAL
    )
  }

  protected makeTruePin (name: string): TruePin {
    return this.storePin(
      new TruePin(this.engine, name, this),
      DevicePinType.INTERNAL
    )
  }

  getPins (): DevicePins {
    return this.pins
  }

  getBuses (): Array<Bus> {
    return this.buses
  }

  getDevices (): Array<Device> {
    return this.devices
  }

  propagate (): boolean {
    return false
  }
}

export abstract class Compound2In1OutDevice extends CompoundDevice {
  readonly inA = this.makeInPin('inA')
  readonly inB = this.makeInPin('inB')
  readonly out = this.makeOutPin('out')
}

export abstract class Compound2In1OutDevice16 extends CompoundDevice {
  readonly inA = this.makeInBus(16, 'inA')
  readonly inB = this.makeInBus(16, 'inB')
  readonly out = this.makeOutBus(16, 'out')
}
