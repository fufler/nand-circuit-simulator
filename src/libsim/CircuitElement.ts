import { v4 } from 'uuid'
import { Engine } from '@/libsim/Engine'

export abstract class CircuitElement {
    readonly id = v4()
    abstract readonly name: string
    protected abstract engine: Engine

    abstract propagate(): boolean;
}
