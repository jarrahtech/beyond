import { ifDef, ifDefElse, append, flatmap, defined } from "../util/Opt";
import { PriorityQueue } from "../util/PriorityQueue";
import { OffsetCoord, CoordSystem } from "./Coords";
import { HexGrid } from "./Grids";

type CoordCost = [number, OffsetCoord]

// TODO: incremental A* that takes an existing A* map and extends it if necessary
export class AStar {
  constructor(public origin: OffsetCoord, public paths: Map<string, OffsetCoord>) {}

  hasPathTo(dest: OffsetCoord) {return this.paths.has(dest.toString()); }
  private getPath(c: OffsetCoord): OffsetCoord[] { return ifDefElse(this.paths.get(c.toString()), (v) => append(this.getPath(v), v), () => []); }
  pathTo(dest: OffsetCoord): OffsetCoord[] { return (this.hasPathTo(dest)) ? append(this.getPath(dest), dest): []; }

  static empty(origin: OffsetCoord): AStar { return new AStar(origin, new Map<string, OffsetCoord>()); }
  private static frontierOrdering = (x:CoordCost, y:CoordCost) => y[0]-x[0];

  static neighborsCost1<H, C extends CoordSystem>(grid: HexGrid<H, C>) { return function (cc: CoordCost): CoordCost[] { return defined(grid.neighborsMap(cc[1], c => flatmap(grid.hexAt(c), (_x) => [cc[0]+1, c]))); }} // take neighbors if exist and all moves cost 1
  static sparseNeighborsCost1<H, C extends CoordSystem>(grid: HexGrid<H, C>) { return function (cc: CoordCost): CoordCost[] { return grid.neighborsMap(cc[1], c => [cc[0]+1, c]); }} // take neighbors even if don't exist and all moves cost 1
  static untilAllChecked(_paths: Map<string, OffsetCoord>) { return true; }
  static untilReach(dest: OffsetCoord) { return function (paths: Map<string, OffsetCoord>) { return !paths.has(dest.toString()); }}

  // It is the responsibility of the caller to ensure that the neighbors/continue combination terminates!
  static buildFrom(origin: OffsetCoord, neighbors: (c: CoordCost) => CoordCost[], proceed: (paths: Map<string, OffsetCoord>) => boolean): AStar {
    const costSoFar = new Map([[origin.toString(), Number.MIN_SAFE_INTEGER]]);
    const paths = new Map<string, OffsetCoord>();
    const frontier = new PriorityQueue<CoordCost>(AStar.frontierOrdering, [0, origin]); // lowest cost first 

    while (!frontier.isEmpty() && proceed(paths)) {
      ifDef(frontier.dequeue(), (curr) => // get next hex on the frontier to check
        neighbors(curr).forEach((cc) => { // find the neighbors of the frontier hex and the cost to get to them from it
          const prevCost = costSoFar.get(cc[1].toString()); // check if there was a path to the neighbor previously 
          if (prevCost===undefined) { // not seen before, so add it
            frontier.enqueue(cc);
            costSoFar.set(cc[1].toString(), cc[0]);
            paths.set(cc[1].toString(), curr[1]);
          } else if (prevCost>cc[0]) { // seen before but new path is cheaper so update  
            frontier.mapInPlace((x) => (x[1]===cc[1])?cc:x);
            costSoFar.set(cc[1].toString(), cc[0]);
            paths.set(cc[1].toString(), curr[1]);
          } // else seen before on a cheaper path so ignore it
        })
      )
    }
    return new AStar(origin, paths);
  }

  static buildDefault<H, C extends CoordSystem>(grid: HexGrid<H, C>, origin: OffsetCoord) { return AStar.buildFrom(origin, AStar.neighborsCost1(grid), AStar.untilAllChecked); }
  private static originNotDest(origin: OffsetCoord, dest: OffsetCoord, neighbors: (c: CoordCost) => CoordCost[], proceed: (paths: Map<string, OffsetCoord>) => boolean) { 
    return (origin===dest) ? AStar.empty(origin) : AStar.buildFrom(origin, neighbors, proceed);
  }
  static path<H, C extends CoordSystem>(grid: HexGrid<H, C>, origin: OffsetCoord, dest: OffsetCoord) {  return AStar.originNotDest(origin, dest, AStar.neighborsCost1(grid), AStar.untilReach(dest)).pathTo(dest); }
  static sparsePath<H, C extends CoordSystem>(grid: HexGrid<H, C>, origin: OffsetCoord, dest: OffsetCoord) { return AStar.originNotDest(origin, dest, AStar.sparseNeighborsCost1(grid), AStar.untilReach(dest)).pathTo(dest); }
}