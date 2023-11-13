import { AssetsManager } from '@babylonjs/core'
// import { Inspector } from '@babylonjs/inspector'
import { setupRtsCamera } from './kassite/RtsCamera'
import { ControlManager } from './kassite/InputControl'
import { createSceneContext } from './util'
import { BeyondGrid } from './grid'
import { OffsetCoord } from './hex/Coords'
import { ScenarioDef, EntityDef } from './entity'

const ctx = createSceneContext()

const scenarioDef = new ScenarioDef([
  new EntityDef('HeavyDestroyer', ['Engine', 'Pilot'], new OffsetCoord(3, 3)),
  new EntityDef('HeavyDestroyer', ['Widget']),
  new EntityDef('HeavyDestroyer', [])
])
const grid = BeyondGrid.empty(0.75)
const loader = new AssetsManager(ctx.scene)
scenarioDef.loadTo(grid, loader)
loader.onTaskError = (t) => { console.log(`Err: ${t.errorObject.exception}: ${t.errorObject.message}`) }
loader.loadAsync()
  .then(_ => { ctx.engine.runRenderLoop(() => { ctx.scene.render() }) }, (r) => { console.log(`Load error: ${JSON.stringify(r)}`) })

const ctrls = new ControlManager() // TODO: split -> util?
ctrls.attach(ctx.scene)
setupRtsCamera(ctx.camera, ctrls)

grid.drawOutline(ctx.scene, OffsetCoord.zero)
// Inspector.Show(ctx.scene, {})
