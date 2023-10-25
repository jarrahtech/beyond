import { type Opt, getOrElse, ifDef } from '../util/Opt'
import { type CoordSystem, type OffsetCoord } from './Coords'
import { type HexGrid, SparseHexGrid } from './Grids'

export function fill<H, C extends CoordSystem> (grid: HexGrid<H, C>, origin: OffsetCoord, dist: number): SparseHexGrid<H, C> {
  return fillMap(grid, origin, grid.hexAt.bind(grid), dist)
}

export function fillMap<H, C extends CoordSystem, T> (grid: HexGrid<H, C>, origin: OffsetCoord, valid: (c: OffsetCoord) => Opt<T>, dist: number): SparseHexGrid<T, C> {
  if (dist < 0) { throw RangeError(`distance ${dist}<0`) }
  let fringes = [origin]
  const visited = new SparseHexGrid(grid.coords, new Map([[origin, getOrElse(valid(origin), () => { throw RangeError('origin must be valid') })]]))
  for (let d = 0; d < dist; d++) {
    const nextFringe: OffsetCoord[] = []
    for (const f of fringes) {
      for (const c of grid.coords.neighbors(f)) {
        if (!visited.has(c)) {
          ifDef(valid(c), (h) => { nextFringe.push(c); visited.set(c, h) })
        }
      }
    }
    fringes = nextFringe
  }
  return visited
}
