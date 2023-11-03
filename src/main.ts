import { Scene, FreeCamera, Engine, Vector3, HemisphericLight } from '@babylonjs/core'
// import { Inspector } from '@babylonjs/inspector'
import { setupRtsCamera } from './kassite/RtsCamera'
import { ControlManager } from './kassite/InputControl'
import { basicSkybox } from './kassite/Util'
import { BeyondGrid } from './grid'
import { OffsetCoord } from './hex/Coords'
import { ScenarioDef, EntityDef } from './entity'

const scenario = new ScenarioDef([
  new EntityDef('HeavyDestroyer', 'Blue', ['Engine', 'Pilot'], OffsetCoord.zero),
  new EntityDef('HeavyDestroyer', 'Red', ['Widget'], new OffsetCoord(3, 3)),
  new EntityDef('HeavyDestroyer', 'Blue', [])
])
console.log(scenario)

const createScene = function (): { scene: Scene, camera: FreeCamera } { // TODO: -> utils
  const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement
  const engine = new Engine(canvas, true)
  engine.setHardwareScalingLevel(1 / window.devicePixelRatio)
  window.addEventListener('resize', _ => { engine.resize() })
  window.addEventListener('load', _ => { engine.resize() })
  engine.runRenderLoop(() => { ctx.scene.render() })
  window.addEventListener('resize', function () { engine.resize() })

  const scene = new Scene(engine)
  scene.useRightHandedSystem = true // to match Blender
  const camera = new FreeCamera('camera1', new Vector3(0, 10, -4), scene)
  camera.setTarget(Vector3.Zero())
  camera.speed = 0.2
  camera.fov = 1.0

  const ctrls = new ControlManager() // TODO: split -> util
  setupRtsCamera(camera, ctrls)
  ctrls.attach(scene)

  basicSkybox(scene, `${import.meta.env.BASE_URL ?? '/'}skybox/green_nebula/green-nebula`, 1000)
  const light = new HemisphericLight('light1', new Vector3(0, 1, 0), scene)
  light.intensity = 1
  // let sphere = BABYLON.MeshBuilder.CreateSphere('sphere1', { segments: 16,  diameter: 2}, scene);
  // sphere.position.y = 1;
  // let ground = BABYLON.MeshBuilder.CreateGround('ground1', { width: 6, height: 6, subdivisions: 2 }, scene)
  return { scene, camera }
}

const ctx = createScene()

const grid = BeyondGrid.empty(0.75)
grid.drawOutline(ctx.scene, OffsetCoord.zero)

// Inspector.Show(ctx.scene, {})
