import { defined, maxByFn, minByFn, Opt } from "../util/Opt";
import { root3, root3div3, Direction, twoThirds, hexSides } from "./Common";

export class OffsetCoord {
  public static readonly zero = new OffsetCoord(0, 0);
  public static readonly north = new OffsetCoord(0, 1);
  public static readonly northEast = new OffsetCoord(1, 1);
  public static readonly east = new OffsetCoord(1, 0);
  public static readonly southEast = new OffsetCoord(1, -1);
  public static readonly south = new OffsetCoord(0, -1);
  public static readonly southWest = new OffsetCoord(-1, -1);
  public static readonly west = new OffsetCoord(-1, 0);
  public static readonly northWest = new OffsetCoord(-1, 1);

  constructor (public col:number, public row:number) {}

  public toString() { return `(${this.col},${this.row})`; }

  public add(o: OffsetCoord | undefined) { return (o === undefined)? undefined: new OffsetCoord(this.col+o.col, this.row+o.row); }
  public subtract(o: OffsetCoord) { return new OffsetCoord(this.col-o.col, this.row-o.row); }
}

export class CubeCoord {

  public static readonly zero = new CubeCoord(0, 0, 0);

  public static fromAxial(c: OffsetCoord): CubeCoord { return new CubeCoord(c.col, c.row, -c.row-c.col);}

  constructor (public q:number, public r:number, public s:number) {
    if (Math.round(q + r + s) !== 0) throw "q + r + s must be 0";
  }

  public toString() { return `(${this.q},${this.r},${this.s})`; }

  public add(o: CubeCoord) { return new CubeCoord(this.q + o.q, this.r + o.r, this.s + o.s); }
  public subtract(o: CubeCoord) { return new CubeCoord(this.q - o.q, this.r - o.r, this.s - o.s); }
  public scale(k: number) { return new CubeCoord(this.q * k, this.r * k, this.s * k); }

  public rotateAnticlockwise() { return new CubeCoord(-this.s, -this.q, -this.r); }
  public rotateClockwise() { return new CubeCoord(-this.r, -this.s, -this.q); }

  public len() { return (Math.abs(this.q) + Math.abs(this.r) + Math.abs(this.s)) / 2; }
  public distance(o: CubeCoord) { return this.subtract(o).len(); }

  public round(): CubeCoord {
    const rq = Math.round(this.q);
    const rr = Math.round(this.r);
    const rs = Math.round(this.s);
    const q_diff = Math.abs(rq - this.q);
    const r_diff = Math.abs(rr - this.r);
    const s_diff = Math.abs(rs - this.s);

    if (q_diff > r_diff && q_diff > s_diff) {
      return new CubeCoord(-rr-rs, rr, rs);
    } else if (r_diff > s_diff) {
      return new CubeCoord(rq, -rq-rs, rs);
    } else if (rr===0 && rq===0) {
      return CubeCoord.zero;
    } else {
      return new CubeCoord(rq, rr, -rq-rr);
    }
  }
}

export abstract class CoordSystem {

  readonly abstract isHorizontal: boolean;
  readonly abstract isEven: boolean;
  readonly abstract validDirections: Direction[]; // in clockwise order 
  readonly abstract neighborShifts: Opt<OffsetCoord>[][]; // TODO: map?
  readonly abstract hexRadiiWidth: number;
  readonly abstract hexRadiiHeight: number;

  protected abstract neighborLine(pos: OffsetCoord): number;
  protected abstract axialFromRadii(radiiPos: OffsetCoord): OffsetCoord;
  protected abstract toAxial(coord: OffsetCoord): OffsetCoord;

  abstract toRadii(coord: OffsetCoord): OffsetCoord;
  abstract toOffset(c: CubeCoord): OffsetCoord;

  toCube(c: OffsetCoord): CubeCoord { return CubeCoord.fromAxial(this.toAxial(c)); }
  rotateClockwise(dir: Direction): Opt<Direction> { return this.rotate(dir, 1); }
  rotateAnticlockwise(dir: Direction): Opt<Direction> { return this.rotate(dir, hexSides - 1); }
  rotate(dir: Direction, shift: number): Opt<Direction> {
    const idx = this.validDirections.indexOf(dir);
    if (idx>=0) {
      return this.validDirections[(idx + shift) % hexSides];
    } else {
      return undefined;
    }
  }
  
  neighborShift(pos: OffsetCoord, dir: Direction): Opt<OffsetCoord> { return this.neighborShifts[this.neighborLine(pos)][dir]; }
  neighbor(pos: OffsetCoord, dir: Direction): Opt<OffsetCoord> { return pos.add(this.neighborShift(pos, dir)); }
  neighbors(pos: OffsetCoord): OffsetCoord[] { return defined(this.neighborShifts[this.neighborLine(pos)].map(pos.add.bind(pos))); } 

  distance(c1: OffsetCoord, c2: OffsetCoord) { return this.toCube(c1).distance(this.toCube(c2)); }
  closest(from: OffsetCoord, zone: OffsetCoord[]): Opt<OffsetCoord> { return minByFn(zone, e => this.distance(from, e)); }
  furthest(from: OffsetCoord, zone: OffsetCoord[]): Opt<OffsetCoord> { return maxByFn(zone, e => this.distance(from, e)); }

  fromRadii(radiiPos: OffsetCoord): OffsetCoord {
    const cube = CubeCoord.fromAxial(this.axialFromRadii(radiiPos));
    return this.toOffset(cube.round())
  }
}

abstract class HorizontalCoordSystem extends CoordSystem { // pointy tops
  readonly isHorizontal = true;
  readonly hexRadiiWidth = root3;
  readonly hexRadiiHeight = 2;
  readonly validDirections = [Direction.NorthEast, Direction.East, Direction.SouthEast, Direction.SouthWest, Direction.West, Direction.NorthWest];
  
  protected neighborLine(pos: OffsetCoord) { return pos.row & 1; }

  protected axialFromRadii(radiiPos: OffsetCoord): OffsetCoord { return new OffsetCoord(root3div3 * radiiPos.col  - radiiPos.row/3, twoThirds * radiiPos.row); }
}

abstract class VerticalCoordSystem extends CoordSystem { // flat tops
  readonly isHorizontal = false;
  readonly hexRadiiWidth = 2;
  readonly hexRadiiHeight = root3;
  readonly validDirections = [Direction.North, Direction.NorthEast, Direction.SouthEast, Direction.South, Direction.SouthWest, Direction.NorthWest];

  protected neighborLine(pos: OffsetCoord) { return pos.col & 1; }

  protected axialFromRadii(radiiPos: OffsetCoord): OffsetCoord { return new OffsetCoord(twoThirds * radiiPos.col, root3div3 * radiiPos.row - radiiPos.col/3); }
}

export class EvenHorizontalCoordSystem extends HorizontalCoordSystem {
  readonly isEven = true;
  readonly neighborShifts = [
    [undefined, OffsetCoord.northEast, OffsetCoord.east, OffsetCoord.southEast, undefined, OffsetCoord.south, OffsetCoord.west, OffsetCoord.north],
    [undefined, OffsetCoord.north, OffsetCoord.east, OffsetCoord.south, undefined, OffsetCoord.southWest, OffsetCoord.west, OffsetCoord.northWest]
  ];
  protected toAxial(c: OffsetCoord) { return new OffsetCoord(c.col - (c.row + (c.row & 1)) / 2, c.row); }
  toOffset(c: CubeCoord) { return new OffsetCoord(c.q + (c.r + (c.r & 1)) / 2, c.r); }
  toRadii(c: OffsetCoord) { return new OffsetCoord(root3 * (c.col - this.neighborLine(c)/2), c.row / twoThirds); }
}

export class EvenVerticalCoordSystem extends VerticalCoordSystem {
  readonly isEven = true;
  readonly neighborShifts = [
    [OffsetCoord.north, OffsetCoord.northEast, undefined, OffsetCoord.east, OffsetCoord.south, OffsetCoord.west, undefined, OffsetCoord.northWest],
    [OffsetCoord.north, OffsetCoord.east, undefined, OffsetCoord.southEast, OffsetCoord.south, OffsetCoord.southWest, undefined, OffsetCoord.west]
  ];
  protected toAxial(c: OffsetCoord) { return new OffsetCoord(c.col, c.row - (c.col + (c.col & 1)) / 2); }
  toOffset(c: CubeCoord) { return new OffsetCoord(c.q, c.r + (c.q + (c.q & 1)) / 2); }
  toRadii(c: OffsetCoord) { return new OffsetCoord(c.col / twoThirds, root3 * (c.row - this.neighborLine(c)/2)); }
}

export class OddHorizontalCoordSystem extends HorizontalCoordSystem {
  readonly isEven = false;
  readonly neighborShifts = [
    [undefined, OffsetCoord.north, OffsetCoord.east, OffsetCoord.south, undefined, OffsetCoord.southWest, OffsetCoord.west, OffsetCoord.northWest],
    [undefined, OffsetCoord.northEast, OffsetCoord.east, OffsetCoord.southEast, undefined, OffsetCoord.south, OffsetCoord.west, OffsetCoord.north]
  ];
  protected toAxial(c: OffsetCoord) { return new OffsetCoord(c.col - (c.row - (c.row & 1)) / 2, c.row); }
  toOffset(c: CubeCoord) { return new OffsetCoord(c.q + (c.r - (c.r & 1)) / 2, c.r); }
  toRadii(c: OffsetCoord) { return new OffsetCoord(root3 * (c.col + this.neighborLine(c)/2), c.row / twoThirds); }
}

export class OddVerticalCoordSystem extends VerticalCoordSystem {
  readonly isEven = false;
  readonly neighborShifts: (OffsetCoord | undefined)[][] = [
    [OffsetCoord.north, OffsetCoord.east, undefined, OffsetCoord.southEast, OffsetCoord.south, OffsetCoord.southWest, undefined, OffsetCoord.west],
    [OffsetCoord.north, OffsetCoord.northEast, undefined, OffsetCoord.east, OffsetCoord.south, OffsetCoord.west, undefined, OffsetCoord.northWest]
  ];
  protected toAxial(c: OffsetCoord) { return new OffsetCoord(c.col, c.row - (c.col - (c.col & 1)) / 2); }
  toOffset(c: CubeCoord) { return new OffsetCoord(c.q, c.r + (c.q - (c.q & 1)) / 2); }
  toRadii(c: OffsetCoord) { return new OffsetCoord(c.col / twoThirds, root3 * (c.row + this.neighborLine(c)/2)); }
}

export const evenVerticalCoords = new EvenVerticalCoordSystem();
export const evenHorizontalCoords = new EvenHorizontalCoordSystem();
export const oddVerticalCoords = new OddVerticalCoordSystem();
export const oddHorizontalCoords = new OddHorizontalCoordSystem();
