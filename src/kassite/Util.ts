import * as BABYLON from 'babylonjs'
import { lerp } from '../util/Interp'
import { type ParameterisedShaderMaterial } from './shader/ParameterisedShaderMaterial'
import { unlitTransparent } from './shader/Shaders'

export function vector2lerp (v: number, a: BABYLON.Vector2, b: BABYLON.Vector2): BABYLON.Vector2 {
  return new BABYLON.Vector2(lerp(v, a.x, b.x), lerp(v, a.y, b.y))
}
export function vector3lerp (v: number, a: BABYLON.Vector3, b: BABYLON.Vector3): BABYLON.Vector3 {
  return new BABYLON.Vector3(lerp(v, a.x, b.x), lerp(v, a.y, b.y), lerp(v, a.z, b.z))
}
export function color3lerp (v: number, a: BABYLON.Color3, b: BABYLON.Color3): BABYLON.Color3 {
  return new BABYLON.Color3(lerp(v, a.r, b.r), lerp(v, a.g, b.g), lerp(v, a.b, b.b))
}

export function basicSkybox (scene: BABYLON.Scene, imagesUrl: string, size: number): void {
  // see https://doc.babylonjs.com/features/featuresDeepDive/environment/skybox
  // or alternative method https://playground.babylonjs.com/#UXGCPG
  const skybox = BABYLON.MeshBuilder.CreateBox('skyBox', { size }, scene)
  const skyboxMaterial = new BABYLON.StandardMaterial('skyBox', scene)
  skyboxMaterial.backFaceCulling = false
  skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(imagesUrl, scene)
  skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE
  skyboxMaterial.specularColor = skyboxMaterial.diffuseColor = BABYLON.Color3.Black()
  skybox.material = skyboxMaterial
  skybox.isPickable = false
}

export function drawTexture (scene: BABYLON.Scene, width: number, height: number, texture: BABYLON.DynamicTexture): { mesh: BABYLON.Mesh, material: ParameterisedShaderMaterial } {
  const plane = BABYLON.MeshBuilder.CreatePlane('plane', { width, height }, scene)
  const material = unlitTransparent().toMaterial(scene)
  material.setTexture('tex', texture)
  material.setFloat('opacity', 0.9)
  material.alpha = 0.9
  plane.material = material
  return { mesh: plane, material }
}
