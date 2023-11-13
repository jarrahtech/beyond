import { type AbstractMesh, type AssetsManager, type MeshAssetTask, type Nullable } from '@babylonjs/core'
import { type OffsetCoord } from './hex/Coords'
import { type BeyondGrid, HexDisplay, HexModel } from './grid'

import '@babylonjs/loaders/glTF'

export class ScenarioDef {
  constructor (public entities: EntityDef[]) {}
  loadTo (grid: BeyondGrid, mgr: AssetsManager): void {
    const wait = new Map<string, EntityDef[] | null>()
    this.entities.forEach((e) => { e.loadCached(grid, mgr, wait) })
  }
}

export class EntityDef {
  static readonly folder = `${import.meta.env.BASE_URL.trim()}entity/`
  constructor (public entity: string, public cards: string[], public pos?: OffsetCoord) {
  }

  loadCached (grid: BeyondGrid, mgr: AssetsManager, wait: Map<string, EntityDef[] | null>): void {
    const waiting = wait.get(this.entity)
    switch (waiting) {
      case undefined: // this is the first
        wait.set(this.entity, [])
        this.forceLoad(grid, mgr, wait)
        break
      case null: // sucessfully loaded, so just get it from browser cache
        this.forceLoad(grid, mgr, wait)
        break
      default: // ongoing or error, so chain onto the first one
        waiting.push(this)
    }
    // TODO: handle errors
    // TODO: handle progress
    // TODO: how to know when all loaded
  }

  forceLoad (grid: BeyondGrid, mgr: AssetsManager, wait: Map<string, EntityDef[] | null>): MeshAssetTask {
    const task = mgr.addMeshTask(this.entity, `${this.entity}.1`, EntityDef.folder, `${this.entity}.glb`)
    task.onSuccess = this.completeLoadTo(grid, wait).bind(this)
    task.onError = (_, m, e) => { console.log(`Err: ${e}: ${m}`) }
    return task
  }

  private completeLoadTo (grid: BeyondGrid, wait: Map<string, EntityDef[] | null>): (task: MeshAssetTask) => void {
    return (task: MeshAssetTask) => {
      const mesh = task.loadedMeshes[0]
      wait.get(this.entity)?.forEach((w) => { w.initialise(grid, mesh.clone(w.entity, null)) })
      wait.set(this.entity, null)
      this.initialise(grid, mesh)
    }
  }

  initialise (grid: BeyondGrid, mesh: Nullable<AbstractMesh>): void {
    if (mesh != null) {
      const e = new EntityDisplay(mesh, this.cards)
      if (this.pos !== undefined) {
        grid.add(new HexModel(), e, this.pos)
        e.mesh.position = grid.toPixel(this.pos)
      }
    }
  }
}

export class EntityDisplay extends HexDisplay {
  constructor (public mesh: AbstractMesh, public cards: string[]) { super() }
  pos?: OffsetCoord = undefined

  position (np?: OffsetCoord): void { this.pos = np; this.display() }
  display (): void { this.mesh.setEnabled(this.pos !== undefined) }
}
