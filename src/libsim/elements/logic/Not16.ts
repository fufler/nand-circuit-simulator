import { CompoundDevice } from '@/libsim/Devices'
import { Not } from '@/libsim/elements/logic/Not'

export class Not16 extends CompoundDevice {
  readonly in = this.makeInBus(16, 'in')
  readonly out = this.makeOutBus(16, 'out')
  private readonly nots = this.makeDevices(16, Not, 'not')

  init (): void {
    this.linkBuses(
      this.in,
      this.nots.map(a => a.in)
    )

    this.linkBuses(
      this.nots.map(a => a.out),
      this.out
    )
  }
}
