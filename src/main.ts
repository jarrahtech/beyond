import * as BABYLON from 'babylonjs'
import { setupRtsCamera } from './kassite/RtsCamera'
import { ControlManager } from './kassite/InputControl'
import { basicSkybox } from './kassite/Util'
import { BabylonGrid } from './kassite/Hex'
import { OffsetCoord } from './hex/Coords'

const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement
const engine = new BABYLON.Engine(canvas, true)
engine.setHardwareScalingLevel(1 / window.devicePixelRatio)

const createScene = function (): { scene: BABYLON.Scene, camera: BABYLON.FreeCamera } {
  const scene = new BABYLON.Scene(engine)
  scene.useRightHandedSystem = true // to match Blender
  const camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), scene)
  camera.setTarget(BABYLON.Vector3.Zero())
  camera.speed = 0.2
  camera.fov = 1.0
  const ctrls = new ControlManager()
  setupRtsCamera(camera, ctrls)
  basicSkybox(scene, `${import.meta.env.BASE_URL ?? '/'}skybox/green_nebula/green-nebula`, 1000)
  ctrls.attach(scene)
  const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene)
  light.intensity = 1
  // let sphere = BABYLON.MeshBuilder.CreateSphere('sphere1', { segments: 16,  diameter: 2}, scene);
  // sphere.position.y = 1;
  // let ground = BABYLON.MeshBuilder.CreateGround('ground1', { width: 6, height: 6, subdivisions: 2 }, scene)
  return { scene, camera }
}

const ctx = createScene()
window.addEventListener('resize', _ => { engine.resize() })
window.addEventListener('load', _ => { engine.resize() })

// const tex = drawFlatTopHexTexture(ctx.scene, 512)
const grid = new BabylonGrid(0.75)
grid.drawHex(ctx.scene, OffsetCoord.zero)

engine.runRenderLoop(() => { ctx.scene.render() })

window.addEventListener('resize', function () {
  engine.resize()
})
