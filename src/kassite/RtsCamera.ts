import * as BABYLON from "babylonjs";
import * as KASSITE from "./InputControl";

export class RTSCameraMouseKeyboardInput<TCamera extends BABYLON.TargetCamera> implements BABYLON.ICameraInput<TCamera> {
  camera: BABYLON.Nullable<TCamera> = null;
  delta = BABYLON.Vector3.Zero()

  left = new KASSITE.OnceInputControl();
  constructor() {
    this.left.onStart.add(_ => this.delta.addInPlaceFromFloats(-this.camSpeed(), 0, 0));
    this.left.onEnd.add(_ => this.delta.addInPlaceFromFloats(this.camSpeed(), 0, 0));
  }
  camSpeed() { return this.camera ? this.camera.speed : 0; } 
  getClassName() { return "RTSCameraMouseKeyboardInput"; }
  getSimpleName() { return "mouse_keyboard"; }
  attachControl(_: boolean) { }
  detachControl() { }
  checkInputs() { this.camera?.position.addInPlace(this.delta); }
}
