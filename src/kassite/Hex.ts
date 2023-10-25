import * as BABYLON from 'babylonjs'
import { root3 } from '../hex/Common'
import { type EvenVerticalCoordSystem, evenVerticalCoords } from '../hex/Coords'
import { type HexGrid, SparseHexGrid } from '../hex/Grids'

export const flatTopHexPixelPoints = [new BABYLON.Vector2(0, root3 / 4.0), new BABYLON.Vector2(0.25, root3 / 2.0), new BABYLON.Vector2(0.75, root3 / 2.0), new BABYLON.Vector2(1, root3 / 4.0), new BABYLON.Vector2(0.75, 0), new BABYLON.Vector2(0.25, 0)]
export const pointyTopHexPixelPoints = [new BABYLON.Vector2(0, 0.25), new BABYLON.Vector2(0, 0.75), new BABYLON.Vector2(root3 / 4.0, 1), new BABYLON.Vector2(root3 / 2.0, 0.75), new BABYLON.Vector2(root3 / 2.0, 0.25), new BABYLON.Vector2(root3 / 4.0, 0)]

export function drawFlatTopHexTexture (scene: BABYLON.Scene | undefined, resolution: number): BABYLON.DynamicTexture {
  const texture = new BABYLON.DynamicTexture('svgTexture', { width: resolution, height: resolution * root3 / 2.0 }, scene, true)

  texture.hasAlpha = true
  const ctx = texture.getContext()
  ctx.beginPath()
  ctx.lineWidth = resolution / 32
  const mult = resolution - ctx.lineWidth * 2
  const widthVec = new BABYLON.Vector2(ctx.lineWidth, ctx.lineWidth)
  const pts = flatTopHexPixelPoints.map((p) => p.scale(mult).addInPlace(widthVec))
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

export class BabylonGrid {
  static readonly resolution = 512
  static readonly hexTexture = drawFlatTopHexTexture(undefined, BabylonGrid.resolution)
  static readonly hexRotateVector = new BABYLON.Vector3(1, 0, 0)
  static readonly hexRotateMagnitude = Math.PI / 2

  model: HexGrid<Entity, EvenVerticalCoordSystem>
  // hexSize: number
  hexDisplays = new Map<string, HexDisplay>()

  constructor (public hexRadius: number) {
    this.model = SparseHexGrid.empty<Entity, EvenVerticalCoordSystem>(evenVerticalCoords)
    // this.hexSize = this.model.coords.hexRadiiDimensions.multiply(hexRadius)
  }
  /*
  fromPixel(p: BABYLON.Vector3) { return grid.coords.fromRadii(toV2xzFlat(p).divide(hexRadius)) }
  toPixel(c: Coord): BABYLON.Vector3 { return toV3xzFlat(grid.coords.toRadii(c).multiply(hexRadius)) }

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

  drawHex(coord: OffsetCoord, opacity: number = 0.9, colour: BABYLON.Color3 = BABYLON.Color3.White()) {
    (mesh, mat) = drawTexture(null, hexSize, BabylonGrid.hexTexture)
    mesh.rotate(BabylonGrid.hexRotateVector, BabylonGrid.hexRotateMagnitude)
    mesh.position = toPixel(coord)
    mat.setFloat("opacity", opacity)
    mat.setColor3("color", colour)
    mesh.isPickable = false
    return [new StampDisplay(mesh, mat)]
  }
  */
}

class Entity {
  v: number = 2
}

class HexDisplay {
  v: number = 2
}
