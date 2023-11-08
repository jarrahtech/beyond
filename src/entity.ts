import { type AbstractMesh, StandardMaterial, Texture, type Scene, type Material, type AssetsManager, type MeshAssetTask, type AbstractAssetTask } from '@babylonjs/core'
import { type OffsetCoord } from './hex/Coords'
import { type BeyondGrid, HexDisplay, HexModel } from './grid'

import '@babylonjs/loaders/glTF'

export class ScenarioDef {
  constructor (public entities: EntityDef[]) {}
  loadTo (grid: BeyondGrid, mgr: AssetsManager): AbstractAssetTask[] {
    // TODO: combine duplicates
    const result: AbstractAssetTask[] = []
    this.entities.forEach((e) => result.push(e.loadTo(grid, mgr)))
    return result
  }
}

export class EntityDef {
  private readonly folder: string
  constructor (public entity: string, public colour: string, public cards: string[], public pos?: OffsetCoord) {
    this.folder = `${import.meta.env.BASE_URL.trim()}entity/${this.entity}/`
  }

  constructMaterial (scene: Scene): Material {
    const mat = new StandardMaterial('mat', scene)
    const textureFolder = `${this.folder}/${this.entity}`
    mat.specularPower = 200
    // TODO: load this async too?
    // mat.ambientTexture = new Texture(`${textureFolder}AO.png`, scene, undefined, false)
    mat.diffuseTexture = new Texture(`${textureFolder}${this.colour}AlbedoAO.png`, scene, undefined, false)
    // mat.specularTexture = new Texture(`${textureFolder}PBRSpecular.png`, scene, undefined, false)
    // mat.emissiveTexture = new Texture(`${textureFolder}Illumination.png`, scene, undefined, false)
    // mat.bumpTexture = new Texture(`${textureFolder}Normal.png`, scene, undefined, false)
    return mat
  }

  loadTo (grid: BeyondGrid, mgr: AssetsManager): MeshAssetTask {
    const task = mgr.addMeshTask(this.entity, `${this.entity}.1`, this.folder, `${this.entity}Hull.glb`)
    task.onSuccess = this.completeLoadTo(grid).bind(this)
    // TODO: handle errors
    // TODO: handle progress
    // TODO: how to know when all loaded
    return task
  }

  completeLoadTo (grid: BeyondGrid): (task: MeshAssetTask) => void {
    return (task: MeshAssetTask) => {
      task.loadedMeshes[1].material = this.constructMaterial(task.loadedMeshes[1]._scene)
      const e = new EntityDisplay(task.loadedMeshes[0], this.cards)
      e.mesh.scaling.scaleInPlace(0.03)
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
