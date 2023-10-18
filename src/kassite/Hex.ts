import {defined, maxByFn, minByFn, root3, root3div3} from "./common";

export const twoThirds = 2/3.0;
export const hexSides = 6;
export const sideAngle = 60;
export const circleAngle = hexSides*sideAngle;

export enum Direction {
  North, NorthEast, East, SouthEast, South, SouthWest, West, NorthWest
}

export class Coord {
  public static readonly zero = new Coord(0, 0);
  public static readonly north = new Coord(0, 1);
  public static readonly northEast = new Coord(1, 1);
  public static readonly east = new Coord(1, 0);
  public static readonly southEast = new Coord(1, -1);
  public static readonly south = new Coord(0, -1);
  public static readonly southWest = new Coord(-1, -1);
  public static readonly west = new Coord(-1, 0);
  public static readonly northWest = new Coord(-1, 1);

  constructor (public col:number, public row:number) {}

  public add(o: Coord | undefined) { return (o === undefined)? undefined: new Coord(this.col+o.col, this.row+o.row); }
  public subtract(o: Coord) { return new Coord(this.col-o.col, this.row-o.row); }
}

export class CubeCoord {

  public static readonly zero = new CubeCoord(0, 0, 0);

  public static fromAxial(c: Coord): CubeCoord { return new CubeCoord(c.row, c.col, -c.row-c.col);}

  constructor (public q:number, public r:number, public s:number) {
    if (Math.round(q + r + s) !== 0) throw "q + r + s must be 0";
  }

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
  readonly abstract neighborShifts: (Coord | undefined)[][]; // TODO: map?
  readonly abstract hexRadiiWidth: number;
  readonly abstract hexRadiiHeight: number;

  protected abstract neighborLine(pos: Coord): number;
  protected abstract axialFromRadii(radiiPos: Coord): Coord;
  protected abstract toAxial(coord: Coord): Coord;
  abstract toRadii(coord: Coord): Coord;
  abstract toCoord(c: CubeCoord): Coord;

  toCube(c: Coord): CubeCoord { return CubeCoord.fromAxial(this.toAxial(c)); }
  rotateClockwise(dir: Direction): Direction | undefined { return this.rotate(dir, 1); }
  rotateAnticlockwise(dir: Direction): Direction | undefined { return this.rotate(dir, hexSides - 1); }
  rotate(dir: Direction, shift: number): Direction | undefined {
    const idx = this.validDirections.indexOf(dir);
    if (idx>=0) {
      return this.validDirections[(idx + shift) % hexSides];
    } else {
      return undefined;
    }
  }
  
  neighborShift(pos: Coord, dir: Direction): Coord | undefined { return this.neighborShifts[this.neighborLine(pos)][dir]; }
  neighbor(pos: Coord, dir: Direction): Coord | undefined { return pos.add(this.neighborShift(pos, dir)); }
  neighbors(pos: Coord): Coord[] { return defined(this.neighborShifts[this.neighborLine(pos)]); } 

  distance(c1: Coord, c2: Coord) { return this.toCube(c1).distance(this.toCube(c2)); }
  closest(from: Coord, zone: Coord[]): Coord | undefined { return minByFn(zone, e => this.distance(from, e)); }
  furthest(from: Coord, zone: Coord[]): Coord | undefined { return maxByFn(zone, e => this.distance(from, e)); }

  fromRadii(radiiPos: Coord): Coord {
    const cube = CubeCoord.fromAxial(this.axialFromRadii(radiiPos));
    return this.toCoord(cube.round())
  }
 
  /*
  def hexRadiiDimensions = Vector2(hexRadiiWidth, hexRadiiHeight)
  
  def rectangularGridRadiiWidth(widthInHexes: Int, heightInHexes: Int): Double
  def rectangularGridRadiiHeight(widthInHexes: Int, heightInHexes: Int): Double
  def rectangularGridRadiiDimensions(widthInHexes: Int, heightInHexes: Int) = {
    require(widthInHexes>=0 && heightInHexes>=0, "grid size>=0")
    Vector2(rectangularGridRadiiWidth(widthInHexes, heightInHexes), rectangularGridRadiiHeight(widthInHexes, heightInHexes))
  }
  */
}


abstract class HorizontalCoordSystem extends CoordSystem { // pointy tops
  readonly isHorizontal = true;
  readonly hexRadiiWidth = root3
  readonly hexRadiiHeight = 2
  readonly validDirections = [Direction.NorthEast, Direction.East, Direction.SouthEast, Direction.SouthWest, Direction.West, Direction.NorthWest];
  
  protected neighborLine(pos: Coord) { return pos.row & 1; }

  protected axialFromRadii(radiiPos: Coord): Coord { return new Coord(root3div3 * radiiPos.col  - radiiPos.row/3, twoThirds * radiiPos.row); }
  /*
  rectangularGridRadiiWidth(widthInHexes: Int, heightInHexes: Int) = {
    require(widthInHexes>=0 && heightInHexes>=0, "grid size>=0")
    (widthInHexes + (if (heightInHexes>1) 0.5f else 0)) * hexRadiiWidth
  }
  rectangularGridRadiiHeight(widthInHexes: Int, heightInHexes: Int) = {
    require(widthInHexes>=0 && heightInHexes>=0, "grid size>=0")
    if (heightInHexes>0) (hexRadiiHeight*heightInHexes) - (heightInHexes-1)/2f else 0
  }
  */
}

abstract class VerticalCoordSystem extends CoordSystem { // flat tops
  readonly isHorizontal = false;
  readonly hexRadiiWidth = 2;
  readonly hexRadiiHeight = root3;
  readonly validDirections = [Direction.North, Direction.NorthEast, Direction.SouthEast, Direction.South, Direction.SouthWest, Direction.NorthWest];

  protected neighborLine(pos: Coord) { return pos.col & 1; }

  protected axialFromRadii(radiiPos: Coord): Coord { return new Coord(twoThirds * radiiPos.col, root3div3 * radiiPos.row - radiiPos.col/3); }
  /*
  def rectangularGridRadiiWidth(widthInHexes: Int, heightInHexes: Int) = {
    require(widthInHexes>=0 && heightInHexes>=0, "grid size>=0")
    if (widthInHexes>0) (hexRadiiWidth*widthInHexes) - (widthInHexes-1)/2f else 0
  }
  def rectangularGridRadiiHeight(widthInHexes: Int, heightInHexes: Int) = {
    require(widthInHexes>=0 && heightInHexes>=0, "grid size>=0")
    (heightInHexes + (if (widthInHexes>1) 0.5f else 0)) * hexRadiiHeight
  }*/
}

export class EvenHorizontalCoordSystem extends HorizontalCoordSystem {
  readonly isEven = true;
  readonly neighborShifts = [
    [undefined, Coord.northEast, Coord.east, Coord.southEast, undefined, Coord.south, Coord.west, Coord.north],
    [undefined, Coord.north, Coord.east, Coord.south, undefined, Coord.southWest, Coord.west, Coord.northWest]
  ];
  protected toAxial(c: Coord) { return new Coord(c.col - (c.row + (c.row & 1)) / 2, c.row); }
  toCoord(c: CubeCoord) { return new Coord(c.q + (c.r + (c.r & 1)) / 2, c.r); }
  toRadii(c: Coord) { return new Coord(root3 * (c.col - this.neighborLine(c)/2), c.row / twoThirds); }
}

export class EvenVerticalCoordSystem extends VerticalCoordSystem {
  readonly isEven = true;
  readonly neighborShifts = [
    [Coord.north, Coord.northEast, undefined, Coord.east, Coord.south, Coord.west, undefined, Coord.northWest],
    [Coord.north, Coord.east, undefined, Coord.southEast, Coord.south, Coord.southWest, undefined, Coord.west]
  ]
  protected toAxial(c: Coord) { return new Coord(c.col, c.row - (c.col + (c.col & 1)) / 2); }
  toCoord(c: CubeCoord) { return new Coord(c.q, c.r + (c.q + (c.q & 1)) / 2); }
  toRadii(c: Coord) { return new Coord(c.col / twoThirds, root3 * (c.row - this.neighborLine(c)/2)); }
}

export class OddHorizontalCoordSystem extends HorizontalCoordSystem {
  readonly isEven = false;
  readonly neighborShifts = [
    [undefined, Coord.north, Coord.east, Coord.south, undefined, Coord.southWest, Coord.west, Coord.northWest],
    [undefined, Coord.northEast, Coord.east, Coord.southEast, undefined, Coord.south, Coord.west, Coord.north]
  ]
  protected toAxial(c: Coord) { return new Coord(c.col - (c.row - (c.row & 1)) / 2, c.row); }
  toCoord(c: CubeCoord) { return new Coord(c.q + (c.r - (c.r & 1)) / 2, c.r); }
  toRadii(c: Coord) { return new Coord(root3 * (c.col + this.neighborLine(c)/2), c.row / twoThirds); }
}

export class OddVerticalCoordSystem extends VerticalCoordSystem {
  readonly isEven = false;
  readonly neighborShifts: (Coord | undefined)[][] = [
    [Coord.north, Coord.east, undefined, Coord.southEast, Coord.south, Coord.southWest, undefined, Coord.west],
    [Coord.north, Coord.northEast, undefined, Coord.east, Coord.south, Coord.west, undefined, Coord.northWest]
  ]
  protected toAxial(c: Coord) { return new Coord(c.col, c.row - (c.col - (c.col & 1)) / 2); }
  toCoord(c: CubeCoord) { return new Coord(c.q, c.r + (c.q - (c.q & 1)) / 2); }
  toRadii(c: Coord) { return new Coord(c.col / twoThirds, root3 * (c.row + this.neighborLine(c)/2)); }
}

export const evenVerticalCoords = new EvenVerticalCoordSystem();
export const evenHorizontalCoords = new EvenHorizontalCoordSystem();
export const oddVerticalCoords = new OddVerticalCoordSystem();
export const oddHorizontalCoords = new OddHorizontalCoordSystem();
