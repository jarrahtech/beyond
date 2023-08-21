import * as BABYLON from "babylonjs";

import { RTSCameraMouseKeyboardInput } from "./kassite/RtsCamera";
import { ControlManager, Inputs } from "./kassite/InputControl";

let canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
let engine = new BABYLON.Engine(canvas, true);

let createScene = function() {
  let scene = new BABYLON.Scene(engine);
  let camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), scene);
  camera.setTarget(BABYLON.Vector3.Zero());
  camera.speed = 0.2
  camera.fov = 1.0
  camera.inputs.clear();
  let camCtrl = new RTSCameraMouseKeyboardInput<BABYLON.FreeCamera>();
  camera.inputs.add(camCtrl);
  let ctrls = new ControlManager();
  ctrls.add(Inputs.a, camCtrl.left);
  ctrls.attach(scene);
  let light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
  let sphere = BABYLON.MeshBuilder.CreateSphere('sphere1', { segments: 16,  diameter: 2}, scene);
  sphere.position.y = 1;
  let ground = BABYLON.MeshBuilder.CreateGround('ground1', { width: 6, height: 6, subdivisions: 2} , scene);
  return { scene, camera };
}

let ctx = createScene();

engine.runRenderLoop(function(){
  ctx.scene.render();
});

window.addEventListener('resize', function(){
  engine.resize();
});
