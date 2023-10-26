import { type Opt, flatmap } from './Opt'

export class State {
  constructor (public name: string, public onEnter: (action: string) => void = () => {}, public onExit: (action: string) => void = () => {}) { }
}

interface Transition {
  action: string
  to: State
  transit: (start: State, action: string) => Opt<State>
  onAction: (from: State, to: State) => boolean
}

export class BasicTransition implements Transition {
  constructor (public action: string, private readonly from: State[], public to: State, public onAction: (from: State, to: State) => boolean = () => true) { }
  transit (start: State, action: string): Opt<State> { return (action === this.action && this.from.findIndex((s) => s === start) > -1) ? this.to : undefined }
}

export class StateMachine {
  public current: State
  constructor (public initial: State, public transitions: Transition[]) {
    this.current = initial
  }

  transition (action: string): Opt<State> { return flatmap(this.peek(action), (t) => this.set(t)) }
  peek (action: string): Opt<Transition> { return this.transitions.find((t) => t.transit(this.current, action) !== undefined) }
  reset (): void { this.current = this.initial }
  private set (transition: Transition): Opt<State> {
    if (transition.onAction(this.current, transition.to)) {
      this.current.onExit(transition.action)
      this.current = transition.to
      this.current.onEnter(transition.action)
      return this.current
    } else return undefined
  }

  static Builder = class {
    private readonly transitions: Transition[] = []

    constructor (private readonly initialState: State) { }

    addTransition (action: string, to: State, ...from: State[]): this {
      this.transitions.push(new BasicTransition(action, from, to, () => true))
      return this
    }

    addCustomTransition (next: Transition): this {
      this.transitions.push(next)
      return this
    }

    addTransitionEvent (action: string, to: State, ev: (from: State, to: State) => boolean, ...from: State[]): this {
      this.transitions.push(new BasicTransition(action, from, to, ev))
      return this
    }

    build (): StateMachine {
      if (this.transitions.length === 0) { throw RangeError('>=1 transition') }
      return new StateMachine(this.initialState, this.transitions)
    }
  }
}
