import { type TargetCamera, type ICameraInput, type Nullable, Vector3, type IWheelEvent, Tools } from '@babylonjs/core'
import { OnceInputControl, PressInputControl, type ControlManager } from './InputControl'
import * as Inputs from './Inputs'
import { clamp } from '../util/Math'

// https:// playground.babylonjs.com/#8SZ28Q#6

class RTSCameraMouseKeyboardInput<TCamera extends TargetCamera> implements ICameraInput<TCamera> {
  camera: Nullable<TCamera> = null
  delta = Vector3.Zero()

  getClassName (): string { return 'RTSCameraMouseKeyboardInput' }
  getSimpleName (): string { return 'mouse_keyboard' }
  attachControl (_: boolean): void { }
  detachControl (): void { }
  checkInputs (): void { this.camera?.position.addInPlace(this.delta) }
}

class RTSCameraRotateInput<TCamera extends TargetCamera> implements ICameraInput<TCamera> {
  camera: Nullable<TCamera> = null
  rotationSpeed = 0
  radius: number | undefined = undefined
  rotation: number | undefined = undefined

  getClassName (): string { return 'RTSCameraRotateInput' }
  getSimpleName (): string { return 'rotate' }
  attachControl (_: boolean): void { }
  detachControl (): void { }
  checkInputs (): void {
    if (this.rotationSpeed !== 0 && this.camera !== null) {
      const rad = this.radius ?? (this.radius = Math.sqrt(Math.pow(this.camera.position.x - this.camera.target.x, 2) + Math.pow(this.camera.position.z - this.camera.target.z, 2)))
      this.rotation = (this.rotation ?? (this.rotation = Tools.ToRadians(180) + this.camera.rotation.y)) + this.rotationSpeed
      const tx = this.camera.target.x
      const tz = this.camera.target.z
      const x = tx + rad * Math.sin(this.rotation)
      const z = tz + rad * Math.cos(this.rotation)
      this.camera.position = new Vector3(x, this.camera.position.y, z)
      this.camera.setTarget(new Vector3(tx, 0, tz))
    }
  }
}

class RTSCameraMouseWheelInput<TCamera extends TargetCamera> implements ICameraInput<TCamera> {
  camera: Nullable<TCamera> = null
  step: number
  speed: number
  max: number
  min: number
  wheelDeltaY: number = 0

  constructor (options?: { step?: number, speed?: number, max?: number, min?: number }) {
    this.step = options?.step ?? 0.4
    this.speed = options?.speed ?? 0.01
    this.max = options?.max ?? 1.4
    this.min = options?.min ?? 0.5
  }

  getClassName (): string { return 'RTSCameraMouseWheelInput' }
  getSimpleName (): string { return 'mouseWheel' }
  attachControl (_: boolean): void { }
  detachControl (): void { }
  checkInputs (): void {
    if (this.camera != null && this.wheelDeltaY !== 0) {
      const target = clamp(this.camera.fov + this.step * ((this.wheelDeltaY < 0) ? 1 : -1), this.min, this.max)
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

export const rtsLeft = 'rtsCamera_left'
export const rtsRight = 'rtsCamera_right'
export const rtsUp = 'rtsCamera_up'
export const rtsDown = 'rtsCamera_down'
export const rtsInOut = 'rtsCamera_inOut'
export const rtsClockwise = 'rtsCamera_clockwise'
export const rtsAnticlockwose = 'rtsCamera_anticlockwise'

export function setupRtsCamera<T extends TargetCamera> (cam: T, ctrls: ControlManager): void {
  cam.inputs.clear()

  const mouseKeyboardCtrl = new RTSCameraMouseKeyboardInput<T>()

  const left = ctrls.getOrCreate(new OnceInputControl(rtsLeft), Inputs.a, Inputs.arrowLeft)
  left.onStart.add(_ => mouseKeyboardCtrl.delta.addInPlaceFromFloats(-cam.speed, 0, 0))
  left.onEnd.add(_ => mouseKeyboardCtrl.delta.addInPlaceFromFloats(cam.speed, 0, 0))

  const right = ctrls.getOrCreate(new OnceInputControl(rtsRight), Inputs.d, Inputs.arrowRight)
  right.onStart.add(_ => mouseKeyboardCtrl.delta.addInPlaceFromFloats(cam.speed, 0, 0))
  right.onEnd.add(_ => mouseKeyboardCtrl.delta.addInPlaceFromFloats(-cam.speed, 0, 0))

  const up = ctrls.getOrCreate(new OnceInputControl(rtsUp), Inputs.w, Inputs.arrowUp)
  up.onStart.add(_ => mouseKeyboardCtrl.delta.addInPlaceFromFloats(0, 0, -cam.speed))
  up.onEnd.add(_ => mouseKeyboardCtrl.delta.addInPlaceFromFloats(0, 0, cam.speed))

  const down = ctrls.getOrCreate(new OnceInputControl(rtsDown), Inputs.s, Inputs.arrowDown)
  down.onStart.add(_ => mouseKeyboardCtrl.delta.addInPlaceFromFloats(0, 0, cam.speed))
  down.onEnd.add(_ => mouseKeyboardCtrl.delta.addInPlaceFromFloats(0, 0, -cam.speed))

  const rotateControl = new RTSCameraRotateInput<T>()
  const clockwise = ctrls.getOrCreate(new OnceInputControl(rtsClockwise), Inputs.e)
  clockwise.onStart.add(_ => { rotateControl.rotationSpeed -= 0.02 })
  clockwise.onEnd.add(_ => { rotateControl.rotationSpeed += 0.02 })
  const anticlockwise = ctrls.getOrCreate(new OnceInputControl(rtsAnticlockwose), Inputs.q)
  anticlockwise.onStart.add(_ => { rotateControl.rotationSpeed += 0.02 })
  anticlockwise.onEnd.add(_ => { rotateControl.rotationSpeed -= 0.02 })

  const wheelCtrl = new RTSCameraMouseWheelInput<T>()
  const inOut = ctrls.getOrCreate(new PressInputControl(rtsInOut), Inputs.mouseWheel)
  inOut.onStart.add((e, _) => { wheelCtrl.wheelDeltaY -= (e.event as IWheelEvent)?.deltaY })

  cam.inputs.add(mouseKeyboardCtrl)
  cam.inputs.add(rotateControl)
  cam.inputs.add(wheelCtrl)
}
