import * as BABYLON from "babylonjs";
import * as HEX from "./Hex";

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
    skyboxMaterial.specularColor = skyboxMaterial.diffuseColor = BABYLON.Color3.Black();
    skybox.material = skyboxMaterial;
    skybox.isPickable = false;
  }
}

export function drawFlatTopHexTexture(scene: BABYLON.Scene, resolution: number) {
  let texture = new BABYLON.DynamicTexture("svgTexture", { width: resolution, height: resolution*HEX.root3/2.0 }, scene, true);
  texture.hasAlpha = true;
  let ctx = texture.getContext();
  ctx.beginPath();
  ctx.lineWidth = resolution/32;
  let pts = HEX.flatTopHexPixelPoints.map(v => v.scale(resolution-ctx.lineWidth*2)); //.addInPlace(ctx.lineWidth)) 
  let last = pts[pts.length-1];
  ctx.moveTo(last.x, last.y);
  pts.forEach(p => ctx.lineTo(p.x, p.y));
  let wrap = last.add(pts[0].addInPlace(last).scale(0.1));
  ctx.lineTo(wrap.x, wrap.y);
  ctx.strokeStyle = "white";
  ctx.stroke();
  texture.update();
  return texture;
}