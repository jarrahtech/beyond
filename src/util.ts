import { Vector3, Scene, FreeCamera, Engine, HemisphericLight, type ILoadingScreen } from '@babylonjs/core'
import { basicSkybox } from './kassite/Util'

// https://doc.babylonjs.com/features/featuresDeepDive/scene/customLoadingScreen
class CustomLoadingScreen implements ILoadingScreen { // TODO -> utils
  public loadingUIBackgroundColor: string = 'black'
  constructor (public loadingUIText: string) {}
  public displayLoadingUI (): void {
    console.log(this.loadingUIText)
  }

  public hideLoadingUI (): void {
    console.log('Loaded!')
  }
}

export interface SceneContext { scene: Scene, camera: FreeCamera, engine: Engine }

export function createSceneContext (): SceneContext {
  const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement
  const engine = new Engine(canvas, true)
  engine.setHardwareScalingLevel(1 / window.devicePixelRatio)
  window.addEventListener('resize', _ => { engine.resize() })
  window.addEventListener('load', _ => { engine.resize() })
  engine.loadingScreen = new CustomLoadingScreen("I'm loading!!")

  const scene = new Scene(engine)
  scene.useRightHandedSystem = true // to match Blender
  const camera = new FreeCamera('camera1', new Vector3(0, 10, 4), scene)
  camera.setTarget(Vector3.Zero())
  camera.speed = 0.2
  camera.fov = 1.0

  basicSkybox(scene, `${import.meta.env.BASE_URL ?? '/'}skybox/green_nebula/green-nebula`, 1000)
  const light = new HemisphericLight('light1', new Vector3(0, 1, 0), scene)
  light.intensity = 1
  // let sphere = BABYLON.MeshBuilder.CreateSphere('sphere1', { segments: 16,  diameter: 2}, scene);
  // sphere.position.y = 1;
  // let ground = BABYLON.MeshBuilder.CreateGround('ground1', { width: 6, height: 6, subdivisions: 2 }, scene)
  return { scene, camera, engine }
}
