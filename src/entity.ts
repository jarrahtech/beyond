import type * as BABYLON from 'babylonjs'
import { type OffsetCoord } from './hex/Coords'

export class Def {
  constructor (public entities: Entity[]) {}
  // def loadTo(scene: BABYLON.Scene): Future[Scenario] = ???
}

export class Entity {
  constructor (public entity: string, public colour: string, public cards: string[], public pos?: OffsetCoord) { }

  /*
  loadTo (scene: BABYLON.Scene) {
    const p = new Promise<Entity>()
    const mat = new BABYLON.StandardMaterial('mat', scene)
    const folder = `${BuildInfo.baseUrl.trim()}entity/${this.entity}/`
    const textureFolder = `${folder}512/${this.entity}`
    mat.specularPower = 200
    mat.ambientTexture = new BABYLON.Texture(`${textureFolder}AO.png`, scene)
    mat.diffuseTexture = new BABYLON.Texture(`${textureFolder}${this.colour}AlbedoAO.png`, scene)
    mat.specularTexture = new BABYLON.Texture(`${textureFolder}PBRSpecular.png`, scene)
    mat.emissiveTexture = new BABYLON.Texture(`${textureFolder}Illumination.png`, scene)
    mat.bumpTexture = new BABYLON.Texture(`${textureFolder}Normal.png`, scene)
    return BABYLON.SceneLoader.ImportMesh(`${this.entity}.1`, folder, `${this.entity}Hull.glb`, scene, (meshes) => {
      meshes[1].material = mat
      const e = new EntityDisplay(meshes[0], this.cards)
      e.position(this.pos)
      p.success(e)
    }, {}, {}, {}, this.entity)
  }
  */
}

export class EntityDisplay {
  constructor (public mesh: BABYLON.AbstractMesh, public cards: string[]) { }
  pos?: OffsetCoord = undefined

  position (np?: OffsetCoord): void { this.pos = np; this.display() }
  display (): void {
    if (this.pos === undefined) { this.mesh.scaling.scaleInPlace(0) } else { this.mesh.scaling.scaleInPlace(0.03) }
  }
}
