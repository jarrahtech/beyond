import { defined, type Opt, flatmap } from '../util/Opt'
import { type Direction } from './Common'
import { type CoordSystem, OffsetCoord, CubeCoord } from './Coords'

export abstract class HexGrid<H, C extends CoordSystem> implements Iterable<[OffsetCoord, H]> {
  readonly coords: C

  abstract hexAt (pos: OffsetCoord): Opt<H>
  abstract [Symbol.iterator] (): Iterator<[OffsetCoord, H]>
  abstract set (pos: OffsetCoord, h: H): void
  abstract has (pos: OffsetCoord): boolean

  protected constructor (coords: C) {
    this.coords = coords
  }

  setAll (hs: Map<OffsetCoord, H>): void { hs.forEach((v, k) => { this.set(k, v) }) }

  distance (c1: OffsetCoord, c2: OffsetCoord): number { return this.coords.distance(c1, c2) }

  neighbor (pos: OffsetCoord, dir: Direction): Opt<H> { return this.neighborMap(pos, dir, this.hexAt.bind(this)) }
  neighborMap<T>(pos: OffsetCoord, dir: Direction, f: (c: OffsetCoord) => Opt<T>): Opt<T> { return flatmap(this.coords.neighbor(pos, dir), f) }
  neighbors (pos: OffsetCoord): H[] { return this.neighborsMap(pos, this.hexAt.bind(this)) }
  neighborsMap<T>(pos: OffsetCoord, f: (c: OffsetCoord) => Opt<T>): T[] { return defined(this.coords.neighbors(pos).map(f)) }

  range (center: OffsetCoord, distance: number): H[] { return this.rangeMap(this.coords.toCube(center), distance, this.hexAt.bind(this)) }
  rangeMap<T>(center: CubeCoord, distance: number, f: (c: OffsetCoord) => Opt<T>): T[] {
    const result: T[] = []
    for (let q = -distance; q <= distance; q++) {
      for (let r = Math.max(-distance, -q - distance); r <= Math.min(distance, -q + distance); r++) {
        const h = f(this.coords.toOffset(center.add(new CubeCoord(q, r, -q - r))))
        if (h !== undefined) { result.push(h) }
      }
    }
    return result
  }

  closest (from: OffsetCoord, inZone: OffsetCoord[]): Opt<H> { return this.findInZone(from, inZone, this.coords.closest.bind(this.coords), this.hexAt.bind(this)) }
  furthest (from: OffsetCoord, inZone: OffsetCoord[]): Opt<H> { return this.findInZone(from, inZone, this.coords.furthest.bind(this.coords), this.hexAt.bind(this)) }
  findInZone<T>(from: OffsetCoord, inZone: OffsetCoord[], find: (f: OffsetCoord, z: OffsetCoord[]) => Opt<OffsetCoord>, trans: (c: OffsetCoord) => Opt<T>): Opt<T> {
    return flatmap(find(from, inZone), trans)
  }
}

export class SparseHexGrid<H, C extends CoordSystem> extends HexGrid<H, C> {
  // TODO: is there a better way to do this? repeating the coords type (once in generics, once in parameter). Do this all over the place :(
  static empty<H, C extends CoordSystem>(coords: C): SparseHexGrid<H, C> { return new SparseHexGrid<H, C>(coords, new Map<OffsetCoord, H>()) }

  private readonly hexes = new Map<string, [OffsetCoord, H]>()
  constructor (coords: C, initial: Map<OffsetCoord, H>) {
    super(coords)
    initial.forEach((h, p) => this.hexes.set(p.toString(), [p, h]))
  }

  hexAt (pos: OffsetCoord): Opt<H> { return flatmap(this.hexes.get(pos.toString()), (v) => v[1]) }
  set (pos: OffsetCoord, h: H): void { this.hexes.set(pos.toString(), [pos, h]) }
  has (pos: OffsetCoord): boolean { return this.hexes.has(pos.toString()) }
  [Symbol.iterator] (): Iterator<[OffsetCoord, H]> { return this.hexes.values()[Symbol.iterator]() }
  clear (): void { this.hexes.clear() }
  size (): number { return this.hexes.size }
}

export class RectangularHexGrid<H, C extends CoordSystem> extends HexGrid<H, C> {
  readonly numColumns
  readonly numRows

  static fill<H, C extends CoordSystem>(coords: C, maxCol: number, maxRow: number, initial: H): RectangularHexGrid<H, C> {
    return RectangularHexGrid.generate<H, C>(coords, [0, maxCol], [0, maxRow], () => initial)
  }

  static generate0<H, C extends CoordSystem>(coords: C, maxCol: number, maxRow: number, generator: (c: number, r: number) => H): RectangularHexGrid<H, C> {
    return this.generate(coords, [0, maxCol], [0, maxRow], generator)
  }

  static generate<H, C extends CoordSystem>(coords: C, colRange: [number, number], rowRange: [number, number], generator: (c: number, r: number) => H): RectangularHexGrid<H, C> {
    const arr: H[][] = []
    for (let c = 0; c < colRange[1] - colRange[0] + 1; c++) {
      const col: H[] = []
      for (let r = 0; r < rowRange[1] - rowRange[0] + 1; r++) {
        col.push(generator(c + colRange[0], r + rowRange[0]))
      }
      arr.push(col)
    }
    return new RectangularHexGrid<H, C>(coords, colRange, rowRange, arr)
  }

  constructor (coords: C, public colRange: [number, number], public rowRange: [number, number], private readonly hexes: H[][]) {
    super(coords)
    if (colRange[0] > colRange[1]) throw RangeError(`column range reversed: [${colRange[0]},${colRange[1]}]`)
    if (rowRange[0] > rowRange[1]) throw RangeError(`row range reversed: [${rowRange[0]},${rowRange[1]}]`)
    this.numColumns = this.colRange[1] - this.colRange[0] + 1
    this.numRows = this.rowRange[1] - this.rowRange[0] + 1
    if (hexes.length !== this.numColumns) throw RangeError(`grid not rectangular: width=${this.numColumns}`)
    if (!hexes.every(r => r.length === this.numRows)) throw RangeError(`grid not rectangular: height=${this.numRows}`)
  }

  size (): number { return this.numColumns * this.numRows }

  private get (pos: OffsetCoord): H { return this.hexes[pos.col - this.colRange[0]][pos.row - this.rowRange[0]] }
  has (pos: OffsetCoord): boolean { return pos.col >= this.colRange[0] && pos.col <= this.colRange[1] && pos.row >= this.rowRange[0] && pos.row <= this.rowRange[1] }
  hexAt (pos: OffsetCoord): Opt<H> { return (this.has(pos)) ? this.get(pos) : undefined }
  set (pos: OffsetCoord, h: H): void { if (this.has(pos)) this.hexes[pos.col - this.colRange[0]][pos.row - this.rowRange[0]] = h }

  * [Symbol.iterator] (): Iterator<[OffsetCoord, H]> {
    for (let c = 0; c < this.hexes.length; c++) {
      for (let r = 0; r < this.hexes[c].length; r++) {
        yield [new OffsetCoord(c + this.colRange[0], r + this.rowRange[1]), this.hexes[c][r]]
      }
    }
  }
}

export class CompositeHexGrid<H, C extends CoordSystem> extends HexGrid<H, C> {
  static overlay<H, C extends CoordSystem>(underlying: Array<HexGrid<H, C>>): CompositeHexGrid<H, C> {
    if (underlying.length < 1) throw RangeError('overlay grids.length<1')
    const newArr = underlying.slice()
    newArr.unshift(SparseHexGrid.empty(underlying[0].coords))
    return new CompositeHexGrid(newArr)
  }

  constructor (private readonly grids: Array<HexGrid<H, C>>) {
    if (grids.length < 2) throw RangeError('grids.length<2')
    super(grids[0].coords)
  }

  private findHexUptoGrid (pos: OffsetCoord, gridIdx: number): Opt<H> {
    for (let g = 0; g < gridIdx; g++) {
      const h = this.grids[g].hexAt(pos)
      if (h !== undefined) { return h }
    }
    return undefined
  }

  hexAt (pos: OffsetCoord): Opt<H> { return this.findHexUptoGrid(pos, this.grids.length) }
  allHexAt (pos: OffsetCoord): H[] {
    const result: H[] = []
    for (let g = 0; g < this.grids.length; g++) {
      const h = this.grids[g].hexAt(pos)
      if (h !== undefined) { result.push(h) }
    }
    return result
  }

  set (pos: OffsetCoord, h: H): void { this.grids[0].set(pos, h) }
  has (pos: OffsetCoord): boolean {
    for (const g of this.grids) {
      if (g.has(pos)) { return true }
    }
    return false
  }

  * [Symbol.iterator] (): Iterator<[OffsetCoord, H]> {
    for (let g = 0; g < this.grids.length; g++) {
      for (const h of this.grids[g]) {
        if (this.findHexUptoGrid(h[0], g) === undefined) {
          yield h
        }
      }
    }
  }
}
