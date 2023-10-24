import { OffsetCoord, evenVerticalCoords } from "../../src/hex/Coords";
import { RectangularHexGrid, SparseHexGrid } from "../../src/hex/Grids";
import { fill } from "../../src/hex/Flood";

test("Flood dist<0", () => {
  const t1 = () => {
    fill(RectangularHexGrid.generate0(evenVerticalCoords, 5, 5, (c,r) => `(${c},${r})`), OffsetCoord.zero, -1);
  }
  expect(t1).toThrow("distance -1<0");
});

test("Flood dist=0", () => {
  let grid = RectangularHexGrid.generate0(evenVerticalCoords, 5, 5, (c,r) => `(${c},${r})`);
  expect(fill(grid, OffsetCoord.zero, 0)).toStrictEqual(new SparseHexGrid(evenVerticalCoords, new Map([[OffsetCoord.zero, "(0,0)"]])));
});

test("Flood dist=2", () => {
  let grid = RectangularHexGrid.generate0(evenVerticalCoords, 5, 5, (c,r) => `(${c},${r})`);
  let f = fill(grid, new OffsetCoord(1, 1), 2);
  expect(f.size()).toStrictEqual(13);
  expect(f.hexAt(new OffsetCoord(2, 2))).toStrictEqual("(2,2)");
  expect(f.hexAt(new OffsetCoord(1, 0))).toStrictEqual("(1,0)");
  expect(f.hexAt(new OffsetCoord(3, 1))).toStrictEqual("(3,1)");
  expect(f.hexAt(new OffsetCoord(1, 1))).toStrictEqual("(1,1)");
  expect(f.hexAt(new OffsetCoord(0, 2))).toStrictEqual("(0,2)");
  expect(f.hexAt(new OffsetCoord(0, 1))).toStrictEqual("(0,1)");
  expect(f.hexAt(new OffsetCoord(0, 0))).toStrictEqual("(0,0)");
  expect(f.hexAt(new OffsetCoord(2, 0))).toStrictEqual("(2,0)");
  expect(f.hexAt(new OffsetCoord(3, 2))).toStrictEqual("(3,2)");
  expect(f.hexAt(new OffsetCoord(2, 1))).toStrictEqual("(2,1)");
  expect(f.hexAt(new OffsetCoord(3, 0))).toStrictEqual("(3,0)");
  expect(f.hexAt(new OffsetCoord(1, 2))).toStrictEqual("(1,2)");
  expect(f.hexAt(new OffsetCoord(1, 3))).toStrictEqual("(1,3)");
  expect(f.hexAt(new OffsetCoord(1, 4))).toBeUndefined();
});