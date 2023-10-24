import { Opt, getOrElse, ifDef } from "../util/Opt";
import { CoordSystem, OffsetCoord } from "./Coords";
import { HexGrid, SparseHexGrid } from "./Grids";

export function fill<H, C extends CoordSystem>(grid: HexGrid<H, C>, origin: OffsetCoord, dist: number) {
  return fillMap(grid, origin, grid.hexAt.bind(grid), dist)
}
  
export function fillMap<H, C extends CoordSystem, T>(grid: HexGrid<H, C>, origin: OffsetCoord, valid: (c: OffsetCoord) => Opt<T>, dist: number) {
  if (dist<0) { throw `distance ${dist}<0`; }
  let fringes = [origin];
  const visited = new SparseHexGrid(grid.coords, new Map([[origin, getOrElse(valid(origin), () => { throw "origin must be valid"; })]]));
  for (let d=0; d<dist; d++) {
    let nextFringe: OffsetCoord[] = [];
    for (let f of fringes) {
      for (let c of grid.coords.neighbors(f)) {
        if (!visited.has(c)) {
          ifDef(valid(c), (h) => { nextFringe.push(c); visited.set(c, h); });
        }
      }
    }
    fringes = nextFringe;
  }
  return visited;
}  