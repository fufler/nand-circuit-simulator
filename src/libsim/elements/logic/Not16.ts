import { CompoundDevice, Device } from '@/libsim/Devices'
import { Engine } from '@/libsim/Engine'
import { Not } from '@/libsim/elements/logic/Not'

export class Not16 extends CompoundDevice {
  readonly in = this.makeInBus(16, 'in')
  readonly out = this.makeOutBus(16, 'out')
  private readonly nots = this.makeDevices(16, Not, 'not')

  constructor (engine: Engine, name: string, device?: Device) {
    super(engine, name, device)

    engine.linkBuses(
      this.in,
      this.nots.map(a => a.in)
    )

    engine.linkBuses(
      this.nots.map(a => a.out),
      this.out
    )
  }
}
