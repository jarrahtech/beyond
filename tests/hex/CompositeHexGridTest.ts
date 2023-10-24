import { OffsetCoord, evenVerticalCoords, evenHorizontalCoords, EvenVerticalCoordSystem } from "../../src/hex/Coords";
import { RectangularHexGrid, CompositeHexGrid, SparseHexGrid } from "../../src/hex/Grids";

test("HexGridOverlay Constructor", () => {
  let grid = CompositeHexGrid.overlay([RectangularHexGrid.generate(evenVerticalCoords, [-2,1],[0,4], (c,r) => `(${c},${r})`)]);
  expect(grid.hexAt(OffsetCoord.zero)).toBe("(0,0)");
  expect(grid.hexAt(new OffsetCoord(21, 1))).toBeUndefined();
});

test("HexGridOverlay Constructor underlying exists", () => {
  const t1 = () => {
    CompositeHexGrid.overlay<number, EvenVerticalCoordSystem>([]);
  }
  expect(t1).toThrow("overlay grids.length<1");
});

test("HexGridOverlay Iterator", () => {
  let iter = CompositeHexGrid.overlay([RectangularHexGrid.generate0(evenVerticalCoords, 1, 1, (c,r) => `(${c},${r})`)])[Symbol.iterator]();
  expect(iter.next().value[1]).toBe("(0,0)");
  expect(iter.next().value[1]).toBe("(0,1)");
  expect(iter.next().value[1]).toBe("(1,0)");
  expect(iter.next().value[1]).toBe("(1,1)");
  expect(iter.next().done).toBe(true);
});

test("HexGridOverlay allHexAt", () => {
  let grid =CompositeHexGrid.overlay([RectangularHexGrid.generate0(evenVerticalCoords, 1, 1, (c,r) => `(${c},${r})`)]);
  grid.set(new OffsetCoord(1, 1), "b");
  expect(grid.allHexAt(new OffsetCoord(1, 1))).toStrictEqual(["b","(1,1)"]);
});

test("HexGridOverlay Set", () => {
  let underlying = RectangularHexGrid.generate0(evenVerticalCoords, 1, 1, (c,r) => `(${c},${r})`)
  let grid =CompositeHexGrid.overlay([underlying]);
  expect(grid.hexAt(new OffsetCoord(1, 1))).toBe("(1,1)");
  grid.set(new OffsetCoord(1, 1), "b")
  expect(grid.hexAt(new OffsetCoord(1, 1))).toBe("b");
  expect(underlying.hexAt(new OffsetCoord(1, 1))).toBe("(1,1)");
});

test("HexGridOverlay SetMult", () => {
  let underlying = RectangularHexGrid.generate0(evenVerticalCoords, 1, 1, (c,r) => `(${c},${r})`)
  let grid =CompositeHexGrid.overlay([underlying])
  expect(grid.hexAt(new OffsetCoord(1, 1))).toBe("(1,1)");
  expect(grid.hexAt(new OffsetCoord(21, 1))).toBeUndefined();
  grid.setAll(new Map([[new OffsetCoord(1, 1) , "b"], [new OffsetCoord(21, 1), "c"]]));
  expect(grid.hexAt(new OffsetCoord(1, 1))).toBe("b");
  expect(underlying.hexAt(new OffsetCoord(1, 1))).toBe("(1,1)");
  expect(grid.hexAt(new OffsetCoord(21, 1))).toBe("c");
  expect(underlying.hexAt(new OffsetCoord(21, 1))).toBeUndefined();
});

test("CompositeHexGrids requirements", () => {
  const t5 = () => {
    new CompositeHexGrid([RectangularHexGrid.generate0(evenVerticalCoords, 4, 4, (c,r) => `(${c},${r})`)]);
  }
  expect(t5).toThrow("grids.length<2");
  // the below should not compile
  //new CompositeHexGrid([RectangularHexGrid.generate0(evenVerticalCoords, 4, 4, (c,r) => "x"), RectangularHexGrid.generate0(evenHorizontalCoords, 4, 4, (c,r) => "x")]);
});

test("CompositeHexGrids constructor", () => {
  let grid = new CompositeHexGrid([new SparseHexGrid(evenHorizontalCoords, new Map([[OffsetCoord.zero, "a"], [new OffsetCoord(1,1), "b"]])),
                          new SparseHexGrid(evenHorizontalCoords, new Map([[OffsetCoord.zero, "1"], [new OffsetCoord(2,20), "2"]])),
                          RectangularHexGrid.generate0(evenHorizontalCoords, 4, 4, (c,r) => `(${c},${r})`)]);
  //expect(grid.size()).toBe(26);
  expect(grid.hexAt(OffsetCoord.zero)).toBe("a");
  expect(grid.allHexAt(OffsetCoord.zero)).toStrictEqual(["a", "1", "(0,0)"]);
  expect(grid.hexAt(new OffsetCoord(2,2))).toBe("(2,2)");
  expect(grid.hexAt(new OffsetCoord(2, 20))).toBe("2");
  expect(grid.hexAt(new OffsetCoord(1, 20))).toBeUndefined();
});