import { CircuitElement } from '@/libsim/CircuitElement'
import { Pin, Signal, UpdatablePin } from '@/libsim/Pins'
import { Device } from '@/libsim/Devices'
import { CircuitDefinition, validateDefinition } from '@/libsim/CircuitDefinition'
import { Bus, PinBus } from '@/libsim/Buses'

type ExceptionConstructor = new(msg: string) => Error
const throwError = (constr: ExceptionConstructor, msg: string): never => {
  // eslint-disable-next-line new-cap
  throw new constr(msg)
}

export class LinkError extends Error {
}

export class ConfigurationError extends Error {
}

export class InvalidArgumentError extends Error {
}

export class Link {
  readonly src: Pin
  readonly dst: Pin

  constructor (src: Pin, dst: Pin) {
    this.src = src
    this.dst = dst
  }
}

const sleep = (interval: number) => new Promise(resolve => setTimeout(resolve, interval))

export class Engine {
  private queue: Array<CircuitElement> = []
  private pinsLinks: Map<Pin, Array<Pin>> = new Map()
  private pinsLinksInverted: Map<Pin, Pin> = new Map()

  private devicesConstructors: Map<string, DeviceConstructor> = new Map()

  async run (callback?: ((e: CircuitElement) => boolean), sleepInterval?: number, executionLimit = 100): Promise<boolean> {
    let iterationCounter = 0
    const startTime = Date.now()

    const shouldContinue = () => {
      if (++iterationCounter % 1000 !== 0) {
        return true
      }

      return Date.now() - startTime <= executionLimit
    }

    while (this.queue.length > 0 && shouldContinue()) {
      const [e] = this.queue.splice(0, 1)

      if (e.propagate() && e instanceof Pin) {
        this.queue.push(...(this.pinsLinks.get(e) ?? []))
      }

      let doSleep = true

      if (callback !== undefined) {
        doSleep = doSleep && callback(e)
      }

      if (sleepInterval !== undefined && doSleep) {
        await sleep(sleepInterval)
      }
    }

    return this.queue.length === 0
  }

  propagate (elements: Array<CircuitElement> | CircuitElement): void {
    this.queue.push(...(Array.isArray(elements) ? elements : [elements]))
  }

  private linkPins (src: Pin, dst: Pin): void {
    if (src === dst) {
      throw new LinkError('Self links are not allowed')
    }

    if (this.pinsLinksInverted.has(dst)) {
      throw new LinkError(`There is a link already defined with dst ${dst.name}`)
    }

    const links = this.pinsLinks.get(src) ?? []

    if (links.indexOf(dst) !== -1) {
      throw new LinkError(`There is a link already defined between ${src.name} and ${dst.name}`)
    }

    links.push(dst)

    this.pinsLinksInverted.set(dst, src)
    this.pinsLinks.set(src, links)
  }

  link (src: Pin | Bus | PinBus, dst: Pin | Bus | PinBus): void {
    const _src = src instanceof Pin ? [src] : Array.isArray(src) ? src : src.pins
    const _dst = dst instanceof Pin ? [dst] : Array.isArray(dst) ? dst : dst.pins

    if (_src.length !== _dst.length) {
      throw new LinkError(`Cannot link buses of different length: ${_src.length} and ${_dst.length}`)
    }

    for (let i = 0; i < _src.length; i++) {
      this.linkPins(_src[i], _dst[i])
    }
  }

  getSignalFromLinkedPin (pin: Pin): Signal | undefined {
    return this.pinsLinksInverted.get(pin)?.getSignal()
  }

  registerDeviceConstructor (deviceConstructor: DeviceConstructor, name: string): void {
    if (this.devicesConstructors.has(name)) {
      throw new ConfigurationError(`Duplicate device constructor name ${name} specified`)
    }

    this.devicesConstructors.set(name, deviceConstructor)
  }

  loadDefinition (definition: CircuitDefinition): void {
    validateDefinition(definition)

    const pins = new Map<string, Pin>()

    for (const pinDef of definition.pins) {
      const pin = new UpdatablePin(this, pinDef.name ?? `pin-${pins.size}`)
      if (pinDef.signal !== undefined) {
        pin.setSignal(pinDef.signal)
      }

      if (pins.has(pinDef.id)) {
        throw new Error(`Multiple pins with same id ${pinDef.id} found`)
      }

      pins.set(pinDef.id, pin)
    }

    const devices = new Map<string, Device>()

    for (const deviceDef of definition.devices) {
      const deviceConstructor = this.devicesConstructors.get(deviceDef.type) ?? throwError(InvalidArgumentError, `Unknown device type specified ${deviceDef.type}`)

      // eslint-disable-next-line new-cap
      const device = new deviceConstructor(this, deviceDef.name ?? deviceDef.type)

      device.init()

      if (devices.has(deviceDef.id)) {
        throw new Error(`Duplicate device id ${deviceDef.id} specified`)
      }

      devices.set(deviceDef.id, device)
    }

    const resolvePin = (pinId: string): Pin => {
      const dotIndex = pinId.indexOf('.')

      if (dotIndex === -1) {
        return pins.get(pinId) ?? throwError(InvalidArgumentError, `Ping with specified id ${pinId} not found`)
      }

      const deviceId = pinId.substring(0, dotIndex)

      const device = devices.get(deviceId) ?? throwError(InvalidArgumentError, `Device with specified id ${deviceId} not found`)

      const devicePins = device.getPins()
      const pinName = pinId.substring(dotIndex + 1)

      return devicePins.map(p => p[0]).find(p => p.name === pinName) ?? throwError(InvalidArgumentError, `Pin with name ${pinName} not found in device ${deviceId}`)
    }

    for (const linkDef of definition.links) {
      const srcPin = resolvePin(linkDef.srcId)
      const dstPin = resolvePin(linkDef.dstId)

      this.link(srcPin, dstPin)
    }
  }

  getPins (): Array<Pin> {
    const allPins = new Set([
      ...Array.from(this.pinsLinks.keys()),
      ...Array.from(this.pinsLinksInverted.keys())
    ])

    return Array.from(allPins)
  }

  getLinks (): Array<Link> {
    return Array.from(this.pinsLinksInverted.entries()).map(([dst, src]) => ({
      src,
      dst
    }))
  }
}

type DeviceConstructor = new(engine: Engine, name: string, device?: Device) => Device
