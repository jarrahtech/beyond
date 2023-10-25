import { Direction } from '../../src/hex/Common'
import { OffsetCoord, evenVerticalCoords, evenHorizontalCoords, oddVerticalCoords, oddHorizontalCoords } from '../../src/hex/Coords'
import { RectangularHexGrid } from '../../src/hex/Grids'

test('Constructor', () => {
  const grid = new RectangularHexGrid(evenHorizontalCoords, [0, 1], [0, 1], [[1, 2], [3, 4]])
  expect(grid.numRows).toBe(2)
  expect(grid.numColumns).toBe(2)
  expect(grid.size()).toBe(4)
})

test('GeneratorConstructor', () => {
  const grid1 = RectangularHexGrid.generate(evenHorizontalCoords, [-2, 1], [0, 4], (c, r) => `(${c},${r})`)
  expect(grid1.numRows).toBe(5)
  expect(grid1.numColumns).toBe(4)
  expect(grid1.size()).toBe(20)
  expect(grid1.hexAt(new OffsetCoord(1, 2))).toStrictEqual('(1,2)')

  const grid2 = RectangularHexGrid.generate0(evenHorizontalCoords, 4, 5, (c, r) => `(${c},${r})`)
  expect(grid2.numRows).toBe(6)
  expect(grid2.numColumns).toBe(5)
  expect(grid2.size()).toBe(30)
  expect(grid2.hexAt(new OffsetCoord(1, 2))).toStrictEqual('(1,2)')

  const grid3 = RectangularHexGrid.fill(evenHorizontalCoords, 2, 2, 2.19)
  expect(grid3.numRows).toBe(3)
  expect(grid3.numColumns).toBe(3)
  expect(grid3.size()).toBe(9)
  expect(grid3.hexAt(new OffsetCoord(1, 2))).toBe(2.19)
})

test('Set', () => {
  const grid = RectangularHexGrid.generate(evenHorizontalCoords, [-2, 1], [0, 4], (c, r) => `(${c},${r})`)
  expect(grid.hexAt(new OffsetCoord(1, 2))).toStrictEqual('(1,2)')
  expect(grid.hexAt(new OffsetCoord(0, 2))).toStrictEqual('(0,2)')
  grid.setAll(new Map([[new OffsetCoord(1, 2), 'other']]))
  expect(grid.hexAt(new OffsetCoord(1, 2))).toStrictEqual('other')
  expect(grid.hexAt(new OffsetCoord(0, 2))).toStrictEqual('(0,2)')
})

test('Asserts', () => {
  const t1 = (): void => {
    RectangularHexGrid.generate(evenVerticalCoords, [-2, -3], [0, 4], (c, r) => `(${c},${r})`)
  }
  expect(t1).toThrow('column range reversed: [-2,-3]')

  const t2 = (): void => {
    RectangularHexGrid.generate(evenVerticalCoords, [-2, 1], [0, -4], (c, r) => `(${c},${r})`)
  }
  expect(t2).toThrow('row range reversed: [0,-4]')

  const t3 = (): void => {
    const x = new RectangularHexGrid(oddHorizontalCoords, [-1, 1], [-1, 1], [[1, 2, 3], [4, 5, 6], [7, 8]])
    console.log(x)
  }
  expect(t3).toThrow('grid not rectangular: height=3')

  const t4 = (): void => {
    const x = new RectangularHexGrid(oddHorizontalCoords, [-1, 1], [-1, 1], [[1, 2, 3], [4, 5, 6]])
    console.log(x)
  }
  expect(t4).toThrow('grid not rectangular: width=3')

  const t5 = (): void => {
    const x = new RectangularHexGrid(oddHorizontalCoords, [-1, 1], [-1, 1], [[1, 2, 3], [4, 5, 6], [4, 5, 6], [4, 5, 6]])
    console.log(x)
  }
  expect(t5).toThrow('grid not rectangular: width=3')
})

test('Valid', () => {
  const grid = RectangularHexGrid.generate(evenVerticalCoords, [-2, 1], [0, 4], (c, r) => `(${c},${r})`)
  expect(grid.has(new OffsetCoord(1, 2)))
  expect(!grid.has(new OffsetCoord(1, -2)))
})

test('Iterator col', () => {
  const iter = RectangularHexGrid.generate(evenVerticalCoords, [-2, 1], [0, 4], (c, r) => `(${c},${r})`)[Symbol.iterator]()
  expect(iter.next().value[1]).toBe('(-2,0)')
  expect(iter.next().value[1]).toBe('(-2,1)')
  expect(iter.next().value[1]).toBe('(-2,2)')
  expect(iter.next().value[1]).toBe('(-2,3)')
  expect(iter.next().value[1]).toBe('(-2,4)')
  expect(iter.next().value[1]).toBe('(-1,0)')
  expect(iter.next().value[1]).toBe('(-1,1)')
  expect(iter.next().value[1]).toBe('(-1,2)')
  expect(iter.next().value[1]).toBe('(-1,3)')
  expect(iter.next().value[1]).toBe('(-1,4)')
  expect(iter.next().value[1]).toBe('(0,0)')
  expect(iter.next().value[1]).toBe('(0,1)')
  expect(iter.next().value[1]).toBe('(0,2)')
  expect(iter.next().value[1]).toBe('(0,3)')
  expect(iter.next().value[1]).toBe('(0,4)')
  expect(iter.next().value[1]).toBe('(1,0)')
  expect(iter.next().value[1]).toBe('(1,1)')
  expect(iter.next().value[1]).toBe('(1,2)')
  expect(iter.next().value[1]).toBe('(1,3)')
  expect(iter.next().value[1]).toBe('(1,4)')
  expect(iter.next().done).toBe(true)
})

test('Distance', () => {
  expect(RectangularHexGrid.generate(evenVerticalCoords, [-2, 1], [0, 4], (c, r) => `(${c},${r})`).distance(OffsetCoord.zero, OffsetCoord.zero)).toBe(0)
  expect(RectangularHexGrid.generate(oddHorizontalCoords, [-2, 1], [0, 4], (c, r) => `(${c},${r})`).distance(OffsetCoord.zero, new OffsetCoord(2, -2))).toBe(3)
  expect(RectangularHexGrid.generate(evenHorizontalCoords, [-2, 1], [0, 4], (c, r) => `(${c},${r})`).distance(new OffsetCoord(-1, 1), new OffsetCoord(1, -2))).toBe(4)
  expect(RectangularHexGrid.generate(oddVerticalCoords, [-2, 1], [0, 4], (c, r) => `(${c},${r})`).distance(new OffsetCoord(-2, -1), new OffsetCoord(-1, 0))).toBe(2)
  expect(RectangularHexGrid.generate(evenHorizontalCoords, [-2, 2], [0, 4], (c, r) => `(${c},${r})`).distance(new OffsetCoord(1, 1), new OffsetCoord(1, 3))).toBe(2)
})

test('Neighbors with OffsetCoord', () => {
  const grid = RectangularHexGrid.generate(evenHorizontalCoords, [-2, 2], [0, 4], (c, r) => `(${c},${r})`)
  expect(grid.neighbors(new OffsetCoord(1, 1)).sort()).toStrictEqual(['(1,2)', '(2,1)', '(1,0)', '(0,0)', '(0,1)', '(0,2)'].sort())
})

test('Neighbors', () => {
  const grid = RectangularHexGrid.generate(evenHorizontalCoords, [-2, 1], [0, 4], (c, r) => `(${c},${r})`)
  expect(grid.neighbors(new OffsetCoord(1, 1)).sort()).toStrictEqual(['(1,2)', '(1,0)', '(0,0)', '(0,1)', '(0,2)'].sort())
})

test('Neighbor', () => {
  const grid = RectangularHexGrid.generate0(evenHorizontalCoords, 4, 4, (c, r) => `(${c},${r})`)
  expect(grid.neighbor(OffsetCoord.zero, Direction.North)).toBeUndefined()
  expect(grid.neighbor(new OffsetCoord(1, 1), Direction.SouthEast)).toBe('(1,0)')
})

test('Range', () => {
  const grid = RectangularHexGrid.generate(evenHorizontalCoords, [-2, 2], [0, 4], (c, r) => `(${c},${r})`)
  expect(grid.range(new OffsetCoord(1, 1), 1).sort()).toStrictEqual(['(0,1)', '(0,2)', '(0,0)', '(1,1)', '(1,2)', '(1,0)', '(2,1)'].sort())
})

test('Closest', () => {
  const grid = RectangularHexGrid.generate(evenHorizontalCoords, [-2, 2], [0, 4], (c, r) => `(${c},${r})`)
  expect(grid.closest(new OffsetCoord(1, 1), [new OffsetCoord(1, 3), new OffsetCoord(-2, -2), new OffsetCoord(0, 2)])).toBe('(0,2)')
})

test('Closest same', () => {
  const grid = RectangularHexGrid.generate(evenHorizontalCoords, [-2, 2], [0, 4], (c, r) => `(${c},${r})`)
  expect(grid.closest(new OffsetCoord(1, 1), [new OffsetCoord(1, 3), new OffsetCoord(-2, -2), new OffsetCoord(1, 1), new OffsetCoord(0, 2)])).toBe('(1,1)')
})

test('Closest none', () => {
  const grid = RectangularHexGrid.generate(evenHorizontalCoords, [-2, 2], [0, 4], (c, r) => `(${c},${r})`)
  expect(grid.closest(new OffsetCoord(1, 1), [])).toBeUndefined()
})

test('Furthest', () => {
  const grid = RectangularHexGrid.generate(evenHorizontalCoords, [-2, 2], [0, 4], (c, r) => `(${c},${r})`)
  expect(grid.furthest(new OffsetCoord(1, 1), [new OffsetCoord(1, 3), new OffsetCoord(-2, -2), new OffsetCoord(0, 2)])).toBeUndefined()
  expect(grid.furthest(new OffsetCoord(1, 1), [new OffsetCoord(1, 3), new OffsetCoord(-2, 4), new OffsetCoord(0, 2)])).toBe('(-2,4)')
})
