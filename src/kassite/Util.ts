import { Vector2, Vector3, StandardMaterial, MeshBuilder, CubeTexture, Color3, Texture, type Mesh, type Scene } from '@babylonjs/core'
import { lerp } from '../util/Interp'
import { type ParameterisedShaderMaterial } from './shader/ParameterisedShaderMaterial'
import { unlitTransparent } from './shader/Shaders'

export function vector2lerp (v: number, a: Vector2, b: Vector2): Vector2 {
  return new Vector2(lerp(v, a.x, b.x), lerp(v, a.y, b.y))
}
export function vector3lerp (v: number, a: Vector3, b: Vector3): Vector3 {
  return new Vector3(lerp(v, a.x, b.x), lerp(v, a.y, b.y), lerp(v, a.z, b.z))
}
export function color3lerp (v: number, a: Color3, b: Color3): Color3 {
  return new Color3(lerp(v, a.r, b.r), lerp(v, a.g, b.g), lerp(v, a.b, b.b))
}

export function basicSkybox (scene: Scene, imagesUrl: string, size: number): void {
  // see https://doc.babylonjs.com/features/featuresDeepDive/environment/skybox
  // or alternative method https://playground.babylonjs.com/#UXGCPG
  const skybox = MeshBuilder.CreateBox('skyBox', { size }, scene)
  const skyboxMaterial = new StandardMaterial('skyBox', scene)
  skyboxMaterial.backFaceCulling = false
  skyboxMaterial.reflectionTexture = new CubeTexture(imagesUrl, scene)
  skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE
  skyboxMaterial.specularColor = skyboxMaterial.diffuseColor = Color3.Black()
  skybox.material = skyboxMaterial
  skybox.isPickable = false
}

export interface MeshMaterial { mesh: Mesh, material: ParameterisedShaderMaterial }

export function drawTexture (scene: Scene, size: { width: number, length: number }, texture: Texture): MeshMaterial {
  const plane = MeshBuilder.CreatePlane('plane', size, scene)
  const material = unlitTransparent().toMaterial(scene)
  material.setTexture('tex', texture)
  material.setFloat('opacity', 0.9)
  material.alpha = 0.9
  plane.material = material
  return { mesh: plane, material }
}
