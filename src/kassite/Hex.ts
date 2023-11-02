import * as BABYLON from 'babylonjs'
import { drawTexture, type MeshMaterial } from './Util'
import { root3 } from '../hex/Common'
import { type OffsetCoord, RadiiCoord, type CoordSystem } from '../hex/Coords'
import { type SparseHexGrid } from '../hex/Grids'
import { type Opt } from '../util/Opt'

const defaultResolution = 512
const hexRotateVector = new BABYLON.Vector3(1, 0, 0)
const hexRotateMagnitude = Math.PI / 2

function toV3xzFlat (v: RadiiCoord): BABYLON.Vector3 { return new BABYLON.Vector3(v.x, 0, v.y) }
function toV2xzFlat (v: BABYLON.Vector3): RadiiCoord { return new RadiiCoord(v.x, v.z) }

const flatTopHexPixelPoints = [new BABYLON.Vector2(0, root3 / 4.0), new BABYLON.Vector2(0.25, root3 / 2.0), new BABYLON.Vector2(0.75, root3 / 2.0), new BABYLON.Vector2(1, root3 / 4.0), new BABYLON.Vector2(0.75, 0), new BABYLON.Vector2(0.25, 0)]
const pointyTopHexPixelPoints = [new BABYLON.Vector2(0, 0.25), new BABYLON.Vector2(0, 0.75), new BABYLON.Vector2(root3 / 4.0, 1), new BABYLON.Vector2(root3 / 2.0, 0.75), new BABYLON.Vector2(root3 / 2.0, 0.25), new BABYLON.Vector2(root3 / 4.0, 0)]

function drawHexOutline (scene: BABYLON.Scene | undefined, points: BABYLON.Vector2[], resolution: number): BABYLON.DynamicTexture {
  const texture = new BABYLON.DynamicTexture('svgTexture', { width: resolution, height: resolution * root3 / 2.0 }, scene, true)

  texture.hasAlpha = true
  const ctx = texture.getContext()
  ctx.beginPath()
  ctx.lineWidth = resolution / 32
  const mult = resolution - ctx.lineWidth * 2
  const widthVec = new BABYLON.Vector2(ctx.lineWidth, ctx.lineWidth)
  const pts = points.map((p) => p.scale(mult).addInPlace(widthVec))
  const last = pts[pts.length - 1]
  ctx.moveTo(last.x, last.y)
  pts.forEach((p) => { ctx.lineTo(p.x, p.y) })
  const wrap = last.addInPlace(pts[0].subtract(pts[0]).scaleInPlace(0.1))
  ctx.lineTo(wrap.x, wrap.y)
  ctx.strokeStyle = 'white'
  ctx.stroke()
  texture.update()
  return texture
}

export interface HexTextures {
  outlineTexture: () => BABYLON.Texture
  hexTexture: () => BABYLON.Texture
}

export class FlatTopHexTextures implements HexTextures {
  public readonly outline: BABYLON.Texture
  public readonly hex: BABYLON.Texture

  constructor (scene: BABYLON.Scene | undefined = undefined, resolution: number = defaultResolution) {
    this.outline = drawHexOutline(scene, flatTopHexPixelPoints, resolution)
    this.hex = drawHexOutline(scene, flatTopHexPixelPoints, resolution)
  }

  outlineTexture (): BABYLON.Texture { return this.outline }
  hexTexture (): BABYLON.Texture { return this.hex }
}

export class PointyTopHexTextures implements HexTextures {
  public readonly outline: BABYLON.Texture
  public readonly hex: BABYLON.Texture

  constructor (scene: BABYLON.Scene | undefined = undefined, resolution: number = defaultResolution) {
    this.outline = drawHexOutline(scene, pointyTopHexPixelPoints, resolution)
    this.hex = drawHexOutline(scene, pointyTopHexPixelPoints, resolution)
  }

  outlineTexture (): BABYLON.Texture { return this.outline }
  hexTexture (): BABYLON.Texture { return this.hex }
}

export function defaultTextures (coords: CoordSystem): HexTextures {
  return coords.isHorizontal ? new FlatTopHexTextures() : new PointyTopHexTextures()
}

export class SparseGridDisplay<M, D, C extends CoordSystem> {
  hexSize: { width: number, length: number }

  constructor (public model: SparseHexGrid<M, C>, public display: SparseHexGrid<D, C>, public hexRadius: number, public textures: HexTextures) {
    this.hexSize = { width: this.model.coords.hexRadiiWidth * hexRadius, length: this.model.coords.hexRadiiHeight * hexRadius }
  }

  fromPixel (p: BABYLON.Vector3): OffsetCoord { return this.model.coords.fromRadii(toV2xzFlat(p.scaleInPlace(1 / this.hexRadius))) }
  toPixel (c: OffsetCoord): BABYLON.Vector3 { return toV3xzFlat(this.model.coords.toRadii(c)).scaleInPlace(this.hexRadius) }

  get (coord: OffsetCoord): { model: Opt<M>, display: Opt<D> } { return { model: this.model.hexAt(coord), display: this.display.hexAt(coord) } }

  drawOutline (scene: BABYLON.Scene, coord: OffsetCoord, opacity: number = 0.9, colour: BABYLON.Color3 = BABYLON.Color3.White()): MeshMaterial {
    return this.drawAtCoord(scene, coord, this.textures.outlineTexture(), opacity, colour)
  }

  // TODO: drawHex
  // TODO: drawStamp

  protected drawAtCoord (scene: BABYLON.Scene, coord: OffsetCoord, texture: BABYLON.Texture, opacity: number, colour: BABYLON.Color3): MeshMaterial {
    const tex = drawTexture(scene, this.hexSize, texture)
    tex.mesh.rotate(hexRotateVector, hexRotateMagnitude)
    tex.mesh.position = this.toPixel(coord)
    tex.material.setFloat('opacity', opacity)
    tex.material.setColor3('color', colour)
    tex.mesh.isPickable = false
    return tex
  }
}
