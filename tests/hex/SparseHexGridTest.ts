import { OffsetCoord, evenHorizontalCoords, oddVerticalCoords } from "../../src/hex/Coords";
import { SparseHexGrid } from "../../src/hex/Grids";

test("SparseHexGrid Constructor", () => {
  let grid = new SparseHexGrid(oddVerticalCoords, new Map([[OffsetCoord.zero, "a"], [new OffsetCoord(1,1), "b"]]));
  expect(oddVerticalCoords).toStrictEqual(grid.coords);
  expect(grid.size()).toBe(2);
  expect(grid.hexAt(OffsetCoord.zero)).toBe("a");
  expect(grid.hexAt(new OffsetCoord(1,1))).toBe("b");
  expect(grid.hexAt(new OffsetCoord(0, 1))).toBeUndefined();
});

test("SparseHexGrid Iterator", () => {
  let iter = new SparseHexGrid(evenHorizontalCoords, new Map([[OffsetCoord.zero, "a"], [new OffsetCoord(1,1), "b"], [new OffsetCoord(0,1), "c"]]))[Symbol.iterator]();
  expect(iter.next().value[1]).toBe("a");
  expect(iter.next().value[1]).toBe("b");
  expect(iter.next().value[1]).toBe("c");
  expect(iter.next().done).toBe(true);
});

test("SparseHexGrid Set", () => {
  let grid = new SparseHexGrid(evenHorizontalCoords, new Map([[OffsetCoord.zero, "a"], [new OffsetCoord(1,1), "b"]]));
  expect(grid.hexAt(new OffsetCoord(1,1))).toBe("b");
  expect(grid.hexAt(new OffsetCoord(0,2))).toBeUndefined();
  grid.setAll(new Map([[new OffsetCoord(0,2), "other"], [new OffsetCoord(1,2), "other2"]]));
  expect(grid.hexAt(new OffsetCoord(0,2))).toBe("other");
  expect(grid.hexAt(new OffsetCoord(1,2))).toBe("other2");
  expect(grid.hexAt(new OffsetCoord(1,1))).toBe("b");
});

test("SparseHexGrid clear", () => {
  let grid = SparseHexGrid.empty(oddVerticalCoords);
  grid.setAll(new Map(new Map([[OffsetCoord.zero, "a"], [new OffsetCoord(1,1), "b"]])));
  expect(grid.hexAt(OffsetCoord.zero)).toBe("a");
  grid.clear();
  expect(grid.hexAt(OffsetCoord.zero)).toBeUndefined();
});
