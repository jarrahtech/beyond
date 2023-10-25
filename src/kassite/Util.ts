import * as BABYLON from 'babylonjs'

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
