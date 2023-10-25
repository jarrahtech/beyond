import { OffsetCoord, CubeCoord } from '../../src/hex/Coords'

test('Coord', () => {
  expect(new OffsetCoord(3, 2).col).toBe(3)
  expect(new OffsetCoord(3, 2).row).toBe(2)
})

test('CoordAdd', () => {
  expect(OffsetCoord.zero.add(OffsetCoord.zero)).toStrictEqual(OffsetCoord.zero)
  expect(OffsetCoord.zero.add(OffsetCoord.south)).toStrictEqual(OffsetCoord.south)
  expect(new OffsetCoord(5, 2).add(new OffsetCoord(7, -58))).toStrictEqual(new OffsetCoord(12, -56))
})

test('CoordMinus', () => {
  expect(OffsetCoord.zero.subtract(OffsetCoord.zero)).toStrictEqual(OffsetCoord.zero)
  expect(OffsetCoord.zero.subtract(OffsetCoord.south)).toStrictEqual(OffsetCoord.north)
  expect(new OffsetCoord(5, 2).subtract(new OffsetCoord(7, -58))).toStrictEqual(new OffsetCoord(-2, 60))
})

test('CubeCoordAdd', () => {
  expect(CubeCoord.zero.add(CubeCoord.zero)).toStrictEqual(CubeCoord.zero)
  expect(CubeCoord.zero.add(new CubeCoord(1, 1, -2))).toStrictEqual(new CubeCoord(1, 1, -2))
  expect(new CubeCoord(5, 2, -7).add(new CubeCoord(7, -5, -2))).toStrictEqual(new CubeCoord(12, -3, -9))
})

test('CubeCoordMinus', () => {
  expect(CubeCoord.zero.subtract(CubeCoord.zero)).toStrictEqual(CubeCoord.zero)
  expect(CubeCoord.zero.subtract(new CubeCoord(-1, -1, 2))).toStrictEqual(new CubeCoord(1, 1, -2))
  expect(new CubeCoord(5, 2, -7).subtract(new CubeCoord(7, -5, -2))).toStrictEqual(new CubeCoord(-2, 7, -5))
})

test('CubeCoordDistance', () => {
  expect(CubeCoord.zero.distance(CubeCoord.zero)).toBe(0)
  expect(new CubeCoord(0, -1, 1).distance(CubeCoord.zero)).toBe(1)
  expect(new CubeCoord(-1, -3, 4).distance(new CubeCoord(3, 0, -3))).toBe(7)
})

test('CubeCoordRound', () => {
  expect(CubeCoord.zero.round()).toStrictEqual(CubeCoord.zero)
  expect(new CubeCoord(1.25, 2, -3.25).round()).toStrictEqual(new CubeCoord(1, 2, -3))
  expect(new CubeCoord(-1.3, -2, 3.3).round()).toStrictEqual(new CubeCoord(-1, -2, 3))
})

// TODO: scale, rotate
