import { Observable, type PointerInfo, type KeyboardInfo, type Nullable, type Scene, KeyboardEventTypes, PointerEventTypes, type EventState } from '@babylonjs/core'
import { empty, isEmpty, fromPosition, fromButton, fromKeyboard, fromWheel } from './Inputs'
import { replacer, reviver } from '../util/MapUtils'
import { type Opt } from '../util/Opt'

type InputInfo = PointerInfo | KeyboardInfo

export interface InputControl {
  readonly name: string
  editable: boolean
  start: (info: InputInfo) => void
  end: (info: InputInfo) => void
}

export class PressInputControl implements InputControl {
  editable: boolean = true
  onStart = new Observable<InputInfo>()
  lastStart: number = 0
  readonly name: string
  constructor (name: string) { this.name = name }

  start (info: InputInfo): void { this.onStart.notifyObservers(info); this.lastStart = Date.now() }
  end (_: InputInfo): void { }
}

export class OnceInputControl implements InputControl {
  editable: boolean = true
  onStart = new Observable<InputInfo>()
  lastStart: number = 0
  onEnd = new Observable<InputInfo>()
  lastEnd: number = 0
  readonly name: string
  constructor (name: string) { this.name = name }

  pressOngoing (): boolean { return this.lastStart > this.lastEnd }
  start (info: InputInfo): void { if (!this.pressOngoing()) { this.onStart.notifyObservers(info); this.lastStart = Date.now() } }
  end (info: InputInfo): void { this.lastEnd = Date.now(); this.onEnd.notifyObservers(info) }
}

export class ExtendedInputControl extends OnceInputControl {
  onHold = new Observable<InputInfo>()
  onDouble = new Observable<InputInfo>()

  constructor (name: string, public doubleThreshold: number = 200 /* in milliseconds */) { super(name) }

  override start (info: InputInfo): void {
    if (this.pressOngoing()) {
      this.onHold.notifyObservers(info)
    } else {
      const now = Date.now()
      if ((now - this.lastStart) > this.doubleThreshold) {
        this.onStart.notifyObservers(info)
      } else {
        this.onDouble.notifyObservers(info)
      }
      this.lastStart = Date.now()
    }
  }
}

export class ControlManager {
  private readonly inputs: Map<string, InputControl>
  private detachFn: Nullable<() => void> = null

  constructor (inputs?: Map<string, InputControl>) {
    this.inputs = inputs ?? new Map<string, InputControl>()
  }

  hasInput (input: string): boolean { return this.inputs.has(input) }
  controlFor (input: string): Opt<InputControl> { return this.inputs.get(input) }

  controlNamed (name: string): Opt<InputControl> {
    for (const c of this.inputs.values()) {
      if (c.name === name) { return c }
    }
    return undefined
  }

  inputsFor (ctrl: InputControl): Set<string> {
    const result = new Set<string>()
    for (const e of this.inputs.entries()) {
      if (e[1] === ctrl) { result.add(e[0]) }
    }
    return result
  }

  addEmptyInput (ctrl: InputControl): boolean { return this.addInput(ctrl, empty()) }
  addInputs (ctrl: InputControl, ...input: string[]): boolean[] {
    const results: boolean[] = []
    for (const i of input) {
      results.push(this.addInput(ctrl, i))
    }
    return results
  }

  addInput (ctrl: InputControl, input: string): boolean {
    if (isEmpty(input) || !this.hasInput(input)) {
      // if ctrl already in inputs add new one anyway as could be secondary
      this.inputs.set(input, ctrl)
      return true
    }
    return false
  }

  getOrCreate<T extends InputControl>(ctrl: T, ...input: string[]): T {
    const c = this.controlNamed(ctrl.name) as T
    if (c === undefined) {
      this.addInputs(ctrl, ...input)
      return ctrl
    } else {
      return c
    }
  }

  clear (input: string): void {
    const ctrl = this.controlFor(input)
    if (!isEmpty(input) && ctrl !== undefined) {
      this.inputs.delete(input)
      if (this.inputsFor(ctrl).size === 0) {
        this.addEmptyInput(ctrl)
      }
    }
  }

  stringify (): string { return JSON.stringify(this.inputs, replacer) }
  static parse (json: string): ControlManager { return new ControlManager(JSON.parse(json, reviver)) }

  attach (scene: Scene): void {
    const ptrObs = scene.onPointerObservable.add(this.mouseEvent)
    const keyObs = scene.onKeyboardObservable.add(this.keyboardEvent)
    this.detachFn = function () { scene.onPointerObservable.remove(ptrObs); scene.onKeyboardObservable.remove(keyObs) }
  }

  detach (): void { this.detachFn?.(); this.detachFn = null }

  private readonly mouseEvent = (pInfo: PointerInfo, _: EventState): void => {
    if (pInfo.event.movementX !== 0 || pInfo.event.movementY !== 0) this.controlFor(fromPosition(pInfo.event))?.start(pInfo)

    switch (pInfo.type) {
      case PointerEventTypes.POINTERDOWN: this.controlFor(fromButton(pInfo.event))?.start(pInfo); break
      case PointerEventTypes.POINTERUP: this.controlFor(fromButton(pInfo.event))?.end(pInfo); break
      case PointerEventTypes.POINTERWHEEL: this.controlFor(fromWheel(pInfo.event))?.start(pInfo); break
      default: // do nothing
    }
    pInfo.event.preventDefault()
  }

  private readonly keyboardEvent = (kInfo: KeyboardInfo, _: EventState): void => {
    switch (kInfo.type) {
      case KeyboardEventTypes.KEYDOWN: this.controlFor(fromKeyboard(kInfo.event))?.start(kInfo); break
      case KeyboardEventTypes.KEYUP: this.controlFor(fromKeyboard(kInfo.event))?.end(kInfo); break
      default: // do nothing
    }
    kInfo.event.preventDefault()
  }
}
