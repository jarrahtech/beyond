import { Coord, CubeCoord } from "../../src/kassite/Hex";

test("Coord", () => {
  expect(new Coord(3, 2).col).toBe(3);
  expect(new Coord(3, 2).row).toBe(2);
});

test("CoordAdd", () => {
  expect(Coord.zero.add(Coord.zero)).toStrictEqual(Coord.zero);
  expect(Coord.zero.add(Coord.south)).toStrictEqual(Coord.south);
  expect(new Coord(5, 2).add(new Coord(7, -58))).toStrictEqual(new Coord(12, -56));
});

test("CoordMinus", () => {
  expect(Coord.zero.subtract(Coord.zero)).toStrictEqual(Coord.zero);
  expect(Coord.zero.subtract(Coord.south)).toStrictEqual(Coord.north);
  expect(new Coord(5, 2).subtract(new Coord(7, -58))).toStrictEqual(new Coord(-2, 60));
});

test("CubeCoordAdd", () => {
  expect(CubeCoord.zero.add(CubeCoord.zero)).toStrictEqual(CubeCoord.zero);
  expect(CubeCoord.zero.add(new CubeCoord(1, 1, -2))).toStrictEqual(new CubeCoord(1, 1, -2));
  expect(new CubeCoord(5, 2, -7).add(new CubeCoord(7, -5, -2))).toStrictEqual(new CubeCoord(12, -3, -9));
});

test("CubeCoordMinus", () => {
  expect(CubeCoord.zero.subtract(CubeCoord.zero)).toStrictEqual(CubeCoord.zero);
  expect(CubeCoord.zero.subtract(new CubeCoord(-1, -1, 2))).toStrictEqual(new CubeCoord(1, 1, -2));
  expect(new CubeCoord(5, 2, -7).subtract(new CubeCoord(7, -5, -2))).toStrictEqual(new CubeCoord(-2, 7, -5));
});

test("CubeCoordDistance", () => {
  expect(CubeCoord.zero.distance(CubeCoord.zero)).toBe(0);
  expect(new CubeCoord(0, -1, 1).distance(CubeCoord.zero)).toBe(1);
  expect(new CubeCoord(-1, -3, 4).distance(new CubeCoord(3, 0, -3))).toBe(7);
});

test("CubeCoordRound", () => {
  expect(CubeCoord.zero.round()).toStrictEqual(CubeCoord.zero);
  expect(new CubeCoord(1.25, 2, -3.25).round()).toStrictEqual(new CubeCoord(1, 2, -3));
  expect(new CubeCoord(-1.3, -2, 3.3).round()).toStrictEqual(new CubeCoord(-1, -2, 3));
});

// TODO: scale, rotate