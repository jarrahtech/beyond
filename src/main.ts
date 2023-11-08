import { AssetsManager, type Scene, type MeshAssetTask } from '@babylonjs/core'
// import { Inspector } from '@babylonjs/inspector'
import { setupRtsCamera } from './kassite/RtsCamera'
import { ControlManager } from './kassite/InputControl'
import { createSceneContext } from './util'
import { BeyondGrid } from './grid'
import { OffsetCoord } from './hex/Coords'
import { ScenarioDef, EntityDef } from './entity'

const scenario = new ScenarioDef([
  new EntityDef('HeavyDestroyer', 'Blue', ['Engine', 'Pilot'], new OffsetCoord(3, 3)),
  new EntityDef('HeavyDestroyer', 'Red', ['Widget']),
  new EntityDef('HeavyDestroyer', 'Blue', [])
])

const ctx = createSceneContext()

const grid = BeyondGrid.empty(0.75)
const loader = new AssetsManager(ctx.scene)
scenario.loadTo(grid, loader)
loader.loadAsync().then(_ => { ctx.engine.runRenderLoop(() => { ctx.scene.render() }) }, (r) => { console.log(`Load error: ${r}`) })

const ctrls = new ControlManager() // TODO: split -> util?
ctrls.attach(ctx.scene)
setupRtsCamera(ctx.camera, ctrls)

grid.drawOutline(ctx.scene, OffsetCoord.zero)
// Inspector.Show(ctx.scene, {})

export class Loader {
  private readonly mgr: AssetsManager
  private readonly loaded = new Map<string, MeshAssetTask>()
  constructor (scene: Scene) {
    this.mgr = new AssetsManager(scene)
  }

  // TODO: handle multiple meshNames
  loadMesh (meshName: string, rootUrl: string, sceneFilename: string, onSuccess: (task: MeshAssetTask) => void): void {
    const key = `${rootUrl}${sceneFilename}@${meshName}`
    const prev = this.loaded.get(key) as MeshAssetTask
    if (prev !== undefined) {
      if (prev.isCompleted) {
        onSuccess(prev)
      } else {
        prev.onSuccess = (t) => { onSuccess(t); prev.onSuccess(t) }
      }
    } else {
      const task = this.mgr.addMeshTask(meshName, meshName, rootUrl, sceneFilename)
      this.loaded.set(key, task)
      task.onSuccess = onSuccess
    }
  }
}
