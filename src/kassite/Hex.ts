import * as BABYLON from 'babylonjs'
import { drawTexture, type MeshMaterial } from './Util'
import { root3 } from '../hex/Common'
import { type OffsetCoord, type EvenVerticalCoordSystem, evenVerticalCoords, RadiiCoord } from '../hex/Coords'
import { type HexGrid, SparseHexGrid } from '../hex/Grids'

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

export class SparseGridDisplay<H> {
  model: HexGrid<H, EvenVerticalCoordSystem>
  hexSize: { width: number, length: number }

  constructor (public hexRadius: number, public textures: HexTextures) {
    this.model = SparseHexGrid.empty<H, EvenVerticalCoordSystem>(evenVerticalCoords)
    this.hexSize = { width: this.model.coords.hexRadiiWidth * hexRadius, length: this.model.coords.hexRadiiHeight * hexRadius }
  }

  fromPixel (p: BABYLON.Vector3): OffsetCoord { return this.model.coords.fromRadii(toV2xzFlat(p.scaleInPlace(1 / this.hexRadius))) }
  toPixel (c: OffsetCoord): BABYLON.Vector3 { return toV3xzFlat(this.model.coords.toRadii(c)).scaleInPlace(this.hexRadius) }
  /*
  display(coord: Coord) = hexDisplays.get(coord).foreach(_.display(this, coord))
  createHexDisplay(coord: Coord) = HexDisplay().tap(d => hexDisplays.addOne((coord, d)))
  addDisplay(coord: Coord, reason: HexDisplayReason) = hexDisplays.getOrElseUpdate(coord, createHexDisplay(coord)).tap(_.add(reason)).display(this, coord)
  removeDisplay(coord: Coord, reason: HexDisplayReason) = hexDisplays.get(coord).foreach(d => if (d.remove(reason)) hexDisplays.remove(coord) else d.display(this, coord))

  add(entity: Entity, coord: Coord) = {
    addDisplay(coord, EntityReason(entity))
    val reason = EntityZoneReason(coord)
    grid.set(coord, entity)
    grid.neighbors(coord, Some(_)).foreach(addDisplay(_, reason))
  }
  def entityAt = grid.hexAt

  def select(coord: Coord) = addDisplay(coord, SelectionReason())
  def unselect(coord: Coord) = removeDisplay(coord, SelectionReason())

  def moveEntity(from: Coord, to: Coord) = {
    grid.clear(from).foreach { e =>
      removeDisplay(from, EntityReason(e))
      add(e, to)
    }
  }

*/

  drawOutline (scene: BABYLON.Scene, coord: OffsetCoord, opacity: number = 0.9, colour: BABYLON.Color3 = BABYLON.Color3.White()): MeshMaterial {
    return this.drawAtCoord(scene, coord, this.textures.outlineTexture(), opacity, colour)
  }

  // drawHex
  // drawStamp

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
