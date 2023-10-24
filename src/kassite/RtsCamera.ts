import * as BABYLON from "babylonjs";
import { OnceInputControl, PressInputControl, ControlManager, Inputs } from "./InputControl";
import { clamp } from "../util/Math";

export class RTSCameraMouseKeyboardInput<TCamera extends BABYLON.TargetCamera> implements BABYLON.ICameraInput<TCamera> {
  camera: BABYLON.Nullable<TCamera> = null;
  delta = BABYLON.Vector3.Zero()

  getClassName() { return "RTSCameraMouseKeyboardInput"; }
  getSimpleName() { return "mouse_keyboard"; }
  attachControl(_: boolean) { }
  detachControl() { }
  checkInputs() { this.camera?.position.addInPlace(this.delta); }
}

export class RTSCameraMouseWheelInput<TCamera extends BABYLON.TargetCamera> implements BABYLON.ICameraInput<TCamera> {
  camera: BABYLON.Nullable<TCamera> = null;
  step: number;
  speed: number;
  max: number;
  min: number;
  wheelDeltaY: number = 0;

  constructor(options?: { step?: number; speed?: number; max?: number; min?: number; }) {
    this.step = options?.step ?? 0.4;
    this.speed = options?.speed ?? 0.01;
    this.max = options?.max ?? 1.4;
    this.min = options?.min ?? 0.5;
  }
  
  getClassName() { return "RTSCameraMouseWheelInput"; }
  getSimpleName() { return "mouseWheel"; }
  attachControl(_: boolean) { }
  detachControl() { }
  checkInputs() {
    if (this.camera!= null && this.wheelDeltaY != 0) {    
      let target = clamp(this.camera.fov + this.step * ((this.wheelDeltaY < 0) ? 1 : -1), this.min, this.max);
      this.wheelDeltaY = 0
      if (Math.abs(this.camera.fov - target) < this.speed) {
        this.camera.fov = target
      } else if (this.camera.fov < target) { // add/subtract value from camera fov, until targetZoom is reached
        this.camera.fov += this.speed
      } else {
        this.camera.fov -= this.speed
      }
    }
  }
}

export class RtsCamera {

  static readonly left = "rtsCamera_left";
  static readonly right = "rtsCamera_right";
  static readonly up = "rtsCamera_up";
  static readonly down = "rtsCamera_down";
  static readonly inOut = "rtsCamera_inOut";

  static setup<T extends BABYLON.TargetCamera>(cam: T, ctrls: ControlManager) {
    cam.inputs.clear();

    let mouseKeyboardCtrl = new RTSCameraMouseKeyboardInput<T>();

    let left = ctrls.getOrCreate(new OnceInputControl(RtsCamera.left), Inputs.a, Inputs.arrowLeft);
    left.onStart.add(_ => mouseKeyboardCtrl.delta.addInPlaceFromFloats(cam ? -cam.speed : 0, 0, 0));
    left.onEnd.add(_ => mouseKeyboardCtrl.delta.addInPlaceFromFloats(cam ? cam.speed : 0, 0, 0));   

    let right = ctrls.getOrCreate(new OnceInputControl(RtsCamera.right), Inputs.s, Inputs.arrowRight);
    right.onStart.add(_ => mouseKeyboardCtrl.delta.addInPlaceFromFloats(cam ? cam.speed : 0, 0, 0));
    right.onEnd.add(_ => mouseKeyboardCtrl.delta.addInPlaceFromFloats(cam ? -cam.speed : 0, 0, 0));

    let up = ctrls.getOrCreate(new OnceInputControl(RtsCamera.up), Inputs.w, Inputs.arrowUp);
    up.onStart.add(_ => mouseKeyboardCtrl.delta.addInPlaceFromFloats(0, 0, cam ? cam.speed : 0));
    up.onEnd.add(_ => mouseKeyboardCtrl.delta.addInPlaceFromFloats(0, 0, cam ? -cam.speed : 0));

    let down = ctrls.getOrCreate(new OnceInputControl(RtsCamera.down), Inputs.s, Inputs.arrowDown);
    down.onStart.add(_ => mouseKeyboardCtrl.delta.addInPlaceFromFloats(0, 0, cam ? -cam.speed : 0));
    down.onEnd.add(_ => mouseKeyboardCtrl.delta.addInPlaceFromFloats(0, 0, cam ? cam.speed : 0));

    let wheelCtrl = new RTSCameraMouseWheelInput<T>();
    let inOut = ctrls.getOrCreate(new PressInputControl(RtsCamera.inOut), Inputs.mouseWheel);
    inOut.onStart.add((e, _) => { wheelCtrl.wheelDeltaY -= (e.event as BABYLON.IWheelEvent)?.deltaY; } );

    cam.inputs.add(mouseKeyboardCtrl);
    cam.inputs.add(wheelCtrl);
  }
}
