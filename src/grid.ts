import { SparseGridDisplay, defaultTextures } from './kassite/Hex'
import { evenHorizontalCoords, type EvenHorizontalCoordSystem, type OffsetCoord } from './hex/Coords'
import { SparseHexGrid } from './hex/Grids'

export class HexModel {
  x: number = 9
}

export class HexDisplay {
  entity?: number = 9
  base?: number
  outline?: number = 9
  stamp?: number = 9

  isBlank (): boolean { return this.entity === undefined && this.base === undefined && this.outline === undefined && this.stamp === undefined }
}

export class BeyondGrid extends SparseGridDisplay<HexModel, HexDisplay, EvenHorizontalCoordSystem> {
  static empty (hexRadius: number): BeyondGrid {
    const coords = evenHorizontalCoords
    return new BeyondGrid(SparseHexGrid.empty<HexModel, EvenHorizontalCoordSystem>(coords), SparseHexGrid.empty<HexDisplay, EvenHorizontalCoordSystem>(coords), hexRadius, defaultTextures(coords))
  }

  add (m: HexModel, d: HexDisplay, coord: OffsetCoord): void {
    this.model.set(coord, m)
    this.display.set(coord, d)
  }

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
}
