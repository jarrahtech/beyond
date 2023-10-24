import { OffsetCoord, oddHorizontalCoords } from "../../src/hex/Coords";
import { SparseHexGrid } from "../../src/hex/Grids";
import { AStar } from "../../src/hex/AStar";

// TODO: more tests

test("Sparse AStar", () => {
  let grid = new SparseHexGrid(oddHorizontalCoords, new Map([[OffsetCoord.zero,"a"],[new OffsetCoord(0,2),"e"],[new OffsetCoord(1,0),"b"],[new OffsetCoord(1,1),"c"],[new OffsetCoord(1,2),"c"],[new OffsetCoord(1,3),"x"]])); 
  // shortest through (0,1), but not defined

  expect(AStar.sparsePath(grid, OffsetCoord.zero, new OffsetCoord(0,2))).toStrictEqual([OffsetCoord.zero,new OffsetCoord(0,1),new OffsetCoord(0,2)]);
  expect(AStar.path(grid, OffsetCoord.zero, new OffsetCoord(0,2))).toStrictEqual([OffsetCoord.zero,new OffsetCoord(1,0),new OffsetCoord(1,1),new OffsetCoord(1,2),new OffsetCoord(0,2)]);
});