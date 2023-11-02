import * as BABYLON from 'babylonjs'
import { setupRtsCamera } from './kassite/RtsCamera'
import { ControlManager } from './kassite/InputControl'
import { basicSkybox } from './kassite/Util'
import { BeyondGrid } from './grid'
import { OffsetCoord } from './hex/Coords'
import * as Scenario from './entity'

const scenario = new Scenario.Def([
  new Scenario.Entity('HeavyDestroyer', 'Blue', ['Engine', 'Pilot'], OffsetCoord.zero),
  new Scenario.Entity('HeavyDestroyer', 'Red', ['Widget'], new OffsetCoord(3, 3)),
  new Scenario.Entity('HeavyDestroyer', 'Blue', [])
])
console.log(scenario)

const createScene = function (): { scene: BABYLON.Scene, camera: BABYLON.FreeCamera } { // TODO: -> utils
  const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement
  const engine = new BABYLON.Engine(canvas, true)
  engine.setHardwareScalingLevel(1 / window.devicePixelRatio)
  window.addEventListener('resize', _ => { engine.resize() })
  window.addEventListener('load', _ => { engine.resize() })
  engine.runRenderLoop(() => { ctx.scene.render() })
  window.addEventListener('resize', function () { engine.resize() })

  const scene = new BABYLON.Scene(engine)
  scene.useRightHandedSystem = true // to match Blender
  const camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 10, -4), scene)
  camera.setTarget(BABYLON.Vector3.Zero())
  camera.speed = 0.2
  camera.fov = 1.0

  const ctrls = new ControlManager() // TODO: split -> util
  setupRtsCamera(camera, ctrls)
  ctrls.attach(scene)

  basicSkybox(scene, `${import.meta.env.BASE_URL ?? '/'}skybox/green_nebula/green-nebula`, 1000)
  const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene)
  light.intensity = 1
  // let sphere = BABYLON.MeshBuilder.CreateSphere('sphere1', { segments: 16,  diameter: 2}, scene);
  // sphere.position.y = 1;
  // let ground = BABYLON.MeshBuilder.CreateGround('ground1', { width: 6, height: 6, subdivisions: 2 }, scene)
  return { scene, camera }
}

const ctx = createScene()

const grid = BeyondGrid.empty(0.75)
grid.drawOutline(ctx.scene, OffsetCoord.zero)
