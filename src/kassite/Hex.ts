import * as BABYLON from "babylonjs";

export const  root3 = Math.sqrt(3);
export const  root3div3 = root3/3.0;
export const  twoThirds = 2/3.0;
export const  hexSides = 6;
export const  sideAngle = 60;
export const  circleAngle = hexSides*sideAngle;

export const flatTopHexPixelPoints = [new BABYLON.Vector2(0, root3/4.0), new BABYLON.Vector2(0.25, root3/2.0), new BABYLON.Vector2(0.75, root3/2.0), new BABYLON.Vector2(1, root3/4.0), new BABYLON.Vector2(0.75, 0), new BABYLON.Vector2(0.25, 0)];
export const pointyTopHexPixelPoints = [new BABYLON.Vector2(0, 0.25), new BABYLON.Vector2(0, 0.75), new BABYLON.Vector2(root3/4.0, 1), new BABYLON.Vector2(root3/2.0, 0.75), new BABYLON.Vector2(root3/2.0, 0.25), new BABYLON.Vector2(root3/4.0, 0)];