import { type AbstractMesh } from '@babylonjs/core'
import { type OffsetCoord } from './hex/Coords'

export class ScenarioDef {
  constructor (public entities: EntityDef[]) {}
  // def loadTo(scene: Scene): Future[Scenario] = ???
}

export class EntityDef {
  constructor (public entity: string, public colour: string, public cards: string[], public pos?: OffsetCoord) { }
/*
  loadTo (scene: Scene) {
    const p = new Promise<Entity>()
    const mat = new StandardMaterial('mat', scene)
    const folder = `${import.meta.env.BASE_URL.trim()}entity/${this.entity}/`
    const textureFolder = `${folder}512/${this.entity}`
    mat.specularPower = 200
    mat.ambientTexture = new Texture(`${textureFolder}AO.png`, scene)
    mat.diffuseTexture = new Texture(`${textureFolder}${this.colour}AlbedoAO.png`, scene)
    mat.specularTexture = new Texture(`${textureFolder}PBRSpecular.png`, scene)
    mat.emissiveTexture = new Texture(`${textureFolder}Illumination.png`, scene)
    mat.bumpTexture = new Texture(`${textureFolder}Normal.png`, scene)
    return SceneLoader.ImportMesh(`${this.entity}.1`, folder, `${this.entity}Hull.glb`, scene, (meshes) => {
      meshes[1].material = mat
      const e = new EntityDisplay(meshes[0], this.cards)
      e.position(this.pos)
      p.success(e)
    }, {}, {}, {}, this.entity)
  }
  */
}

export class EntityDisplay {
  constructor (public mesh: AbstractMesh, public cards: string[]) { }
  pos?: OffsetCoord = undefined

  position (np?: OffsetCoord): void { this.pos = np; this.display() }
  display (): void {
    if (this.pos === undefined) { this.mesh.scaling.scaleInPlace(0) } else { this.mesh.scaling.scaleInPlace(0.03) }
  }
}
