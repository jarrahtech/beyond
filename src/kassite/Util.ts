import * as BABYLON from "babylonjs";

export function clamp(val: number, min: number, max: number) { return Math.max(min, Math.min(max, val)); }
export function clamp01(val: number) { return Math.max(0, Math.min(1, val)); }

export class Skybox {

  // see https://doc.babylonjs.com/features/featuresDeepDive/environment/skybox
  // or alternative method https://playground.babylonjs.com/#UXGCPG
  static basic(scene: BABYLON.Scene, imagesUrl: string, size: number) { 
    let skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: size }, scene);
    let skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(imagesUrl, scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = BABYLON.Color3.Black();
    skyboxMaterial.specularColor = BABYLON.Color3.Black();
    skybox.material = skyboxMaterial;
    skybox.isPickable = false;
  }
}