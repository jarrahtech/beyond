import * as BABYLON from "babylonjs";

export class Inputs {

  private static count = 0;
  private static readonly emptyPrefix = "empty";
  static empty() { return `${this.emptyPrefix}${this.count++}`}
  static isEmpty(input: string) { return input.startsWith(this.emptyPrefix); }

  private static modifierKey(alt?: boolean, ctrl?: boolean, meta?: boolean, shift?: boolean) { return `${alt?1:0}${ctrl?1:0}${meta?1:0}${shift?1:0}`; }
  static keyboard(key: string, alt?: boolean, ctrl?: boolean, meta?: boolean, shift?: boolean) { return `keyboard_${key}_${this.modifierKey(alt, ctrl, meta, shift)}`; }
  static pointerButton(button: number, alt?: boolean, ctrl?: boolean, meta?: boolean, shift?: boolean) { return `pointerButton_${button}_${this.modifierKey(alt, ctrl, meta, shift)}`; }
  static pointerPosition(alt?: boolean, ctrl?: boolean, meta?: boolean, shift?: boolean) { return `pointerPosition_${this.modifierKey(alt, ctrl, meta, shift)}`; }
  static wheel(alt?: boolean, ctrl?: boolean, meta?: boolean, shift?: boolean) { return `wheel_${this.modifierKey(alt, ctrl, meta, shift)}`; }

  static fromKeyboard(ev: BABYLON.IKeyboardEvent) { return this.keyboard(ev.key, ev.altKey, ev.ctrlKey, ev.metaKey, ev.shiftKey); }
  static fromButton(ev: BABYLON.IMouseEvent) { return this.pointerButton(ev.button, ev.altKey, ev.ctrlKey, ev.metaKey, ev.shiftKey); }
  static fromPosition(ev: BABYLON.IMouseEvent) { return this.pointerPosition(ev.altKey, ev.ctrlKey, ev.metaKey, ev.shiftKey); }
  static fromWheel(ev: BABYLON.IMouseEvent) { return this.wheel(ev.altKey, ev.ctrlKey, ev.metaKey, ev.shiftKey); }

  static readonly a = this.keyboard("a");
  static readonly b = this.keyboard("b");
  static readonly c = this.keyboard("c");
  static readonly d = this.keyboard("d");
  static readonly e = this.keyboard("e");
  static readonly f = this.keyboard("f");
  static readonly g = this.keyboard("g");
  static readonly h = this.keyboard("h");
  static readonly i = this.keyboard("i");
  static readonly j = this.keyboard("j");
  static readonly k = this.keyboard("k");
  static readonly l = this.keyboard("l");
  static readonly m = this.keyboard("m");
  static readonly n = this.keyboard("n");
  static readonly o = this.keyboard("o");
  static readonly p = this.keyboard("p");
  static readonly q = this.keyboard("q");
  static readonly r = this.keyboard("r");
  static readonly s = this.keyboard("s");
  static readonly t = this.keyboard("t");
  static readonly u = this.keyboard("u");
  static readonly v = this.keyboard("v");
  static readonly w = this.keyboard("w");
  static readonly x = this.keyboard("x");
  static readonly y = this.keyboard("y");
  static readonly z = this.keyboard("z");

  static readonly mouse0 = this.pointerButton(0);
  static readonly mouse1 = this.pointerButton(1);
  static readonly mouse2 = this.pointerButton(2);
  static readonly mousePosition = this.pointerPosition();
  static readonly mouseWheel = this.wheel();

  static readonly arrowLeft = this.keyboard("ArrowLeft")
  static readonly arrowRight = this.keyboard("ArrowRight")
  static readonly arrowUp = this.keyboard("ArrowUp")
  static readonly arrowDown = this.keyboard("ArrowDown")
  static readonly esc = this.keyboard("Escape")
}

type InputInfo = BABYLON.PointerInfo | BABYLON.KeyboardInfo;

export interface InputControl {
  readonly name: string;
  editable: boolean;
  start(info: InputInfo): void;
  end(info: InputInfo): void;
}

export class PressInputControl implements InputControl {
  editable: boolean = true;
  onStart = new BABYLON.Observable<InputInfo>();
  lastStart: number = 0;
  readonly name: string;
  constructor(name: string) { this.name = name; }

  start(info: InputInfo) { this.onStart.notifyObservers(info); this.lastStart = Date.now(); }
  end(_: InputInfo): void { }
}

export class OnceInputControl implements InputControl {
  editable: boolean= true;
  onStart = new BABYLON.Observable<InputInfo>();
  lastStart: number = 0;
  onEnd = new BABYLON.Observable<InputInfo>();
  lastEnd: number = 0;
  readonly name: string;
  constructor(name: string) { this.name = name; }

  pressOngoing() { return this.lastStart>this.lastEnd; }
  start(info: InputInfo) { if (!this.pressOngoing()) { this.onStart.notifyObservers(info); this.lastStart = Date.now(); } }
  end(info: InputInfo) { this.lastEnd = Date.now(); this.onEnd.notifyObservers(info); }
}
  
export class ExtendedInputControl extends OnceInputControl {
  doubleThreshold: number = 200; // in milliseconds
  onHold = new BABYLON.Observable<InputInfo>();
  onDouble = new BABYLON.Observable<InputInfo>();
  
  override start(info: InputInfo) {
    if (this.pressOngoing()) { 
      this.onHold.notifyObservers(info);
    } else {
      let now = Date.now()
      if ((now-this.lastStart)>this.doubleThreshold) {
        this.onStart.notifyObservers(info);
      } else {
        this.onDouble.notifyObservers(info);
      } 
      this.lastStart = Date.now();
    }
  }
}

// -----
// TODO: move to utils?
// https://stackoverflow.com/questions/29085197/how-do-you-json-stringify-an-es6-map
function replacer(_: any, value: any) {
  if (value instanceof Map) {
    return {
      dataType: 'Map',
      value: Array.from(value.entries()), // or with spread: value: [...value]
    };
  } else {
    return value;
  }
}
  
function reviver(_: any, value: any) {
  if (typeof value === 'object' && value !== null) {
    if (value.dataType === 'Map') {
      return new Map(value.value);
    }
  }
  return value;
}
// -----  

export class ControlManager {
  private readonly inputs: Map<string, InputControl>
  private detachFn: BABYLON.Nullable<() => void> = null

  constructor(inputs?: Map<string, InputControl>) { 
    this.inputs = (inputs==undefined) ? new Map<string, InputControl>() : inputs;
  }

  hasInput(input: string) { return this.inputs.has(input); }
  controlFor(input: string): InputControl | undefined { return this.inputs.get(input); }

  controlNamed(name: string) { 
    for (let c of this.inputs.values()) {
      if (c.name===name) { return c; }
    }
    return undefined;
  }
  inputsFor(ctrl: InputControl)  { 
    let result = new Set<string>();
    for (let e of this.inputs.entries()) {
      if (e[1]===ctrl) { result.add(e[0]); }
    }
    return result;
  }
  
  addEmptyInput(ctrl: InputControl) { return this.addInput(ctrl, Inputs.empty()); }
  addInputs(ctrl: InputControl, ...input: string[]) {
    let results: boolean[] = [];
    for (var i of input) {
      results.push(this.addInput(ctrl, i));
    }
    return results;
  }
  addInput(ctrl: InputControl, input: string) { 
    if (Inputs.isEmpty(input) || !this.hasInput(input)) {
      // if ctrl already in inputs add new one anyway as could be secondary
      this.inputs.set(input, ctrl);
      return true;
    }
    return false;
  }
  getOrCreate<T extends InputControl>(ctrl: T, ...input: string[]) {
    let c = this.controlNamed(ctrl.name) as T;
    if (c == undefined) { 
      this.addInputs(ctrl, ...input); 
      return ctrl;
    } else {
      return c;
    }
  }

  clear(input: string) {
    let ctrl = this.controlFor(input)
    if (!Inputs.isEmpty(input) && ctrl) {
      this.inputs.delete(input);
      if (this.inputsFor(ctrl).size==0) {
        this.addEmptyInput(ctrl);
      }
    }
  }
  stringify() { return JSON.stringify(this.inputs, replacer); }
  static parse(json: string) { return new ControlManager(JSON.parse(json, reviver)); }

  attach(scene: BABYLON.Scene) {
    let ptrObs = scene.onPointerObservable.add(this.mouseEvent);
    let keyObs = scene.onKeyboardObservable.add(this.keyboardEvent);
    this.detachFn = function() { scene.onPointerObservable.remove(ptrObs); scene.onKeyboardObservable.remove(keyObs); }
  }
  detach() { this.detachFn?.(); this.detachFn = null; }

  private mouseEvent = (pInfo: BABYLON.PointerInfo, _: BABYLON.EventState) => {
    if (pInfo.event.movementX!=0 || pInfo.event.movementY!=0) this.controlFor(Inputs.fromPosition(pInfo.event))?.start(pInfo);
    
    switch (pInfo.type) {
      case BABYLON.PointerEventTypes.POINTERDOWN: this.controlFor(Inputs.fromButton(pInfo.event))?.start(pInfo); break;
      case BABYLON.PointerEventTypes.POINTERUP: this.controlFor(Inputs.fromButton(pInfo.event))?.end(pInfo); break;
      case BABYLON.PointerEventTypes.POINTERWHEEL: this.controlFor(Inputs.fromWheel(pInfo.event))?.start(pInfo); break;
      default: // do nothing
    } 
    pInfo.event.preventDefault()
  }

  private keyboardEvent = (kInfo: BABYLON.KeyboardInfo, _: BABYLON.EventState) => {
    switch (kInfo.type) {
      case BABYLON.KeyboardEventTypes.KEYDOWN: this.controlFor(Inputs.fromKeyboard(kInfo.event))?.start(kInfo); break;
      case BABYLON.KeyboardEventTypes.KEYUP: this.controlFor(Inputs.fromKeyboard(kInfo.event))?.end(kInfo); break;
      default: // do nothing
    }
    kInfo.event.preventDefault()
  }
}