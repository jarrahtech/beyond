import { clamp01 } from './Math'

type Interpolator = (val: number) => number

export function interp (interpFn: Interpolator): (val: number, lower: number, upper: number) => number {
  return (val: number, lower: number, upper: number) => (upper - lower) * interpFn(clamp01(val)) + lower
}

export const lerp = interp((a) => a)

export function powerInterp (power: number): Interpolator {
  if (power <= 0) throw RangeError(`power=${power} <=1`)
  return (a) => Math.pow(a, power)
}
export function plerp (power: number): (val: number, lower: number, upper: number) => number { return interp(powerInterp(power)) }

export function eInterp (k: number): Interpolator {
  if (k <= 0) throw RangeError(`k=${k} !>0`)
  return (v) => 1 - 1 / (1 + Math.pow(Math.E, (v * 2 - 1) / k))
}
export function elerp (k: number): (val: number, lower: number, upper: number) => number { return interp(eInterp(k)) }

export function circInterp (): Interpolator {
  return (v) => Math.sqrt(1 - v * v) - 1
}
export function expoInterp (): Interpolator {
  return (v) => Math.pow(2, 10 * (v - 1))
}
export function bounceInterp (): Interpolator {
  return (v) => {
    if (v < (1 / 2.75)) { return 7.5625 * v * v } else if (v < (2 / 2.75)) { const av = v - (1.5 / 2.75); return 7.5625 * av * av + 0.75 } else if (v < (2.5 / 2.75)) { const av = v - (2.25 / 2.75); return 7.5625 * av * av + 0.9375 } else { const av = v - (2.625 / 2.75); return 7.5625 * av * av + 0.984375 }
  }
}
export function sinInterp (): Interpolator {
  return (v) => 1 - Math.sin(0.5 * Math.PI * (1 - v))
}
export function springInterp (): Interpolator {
  return (c) => (Math.sin(c * Math.PI * (0.2 + 2.5 * c * c * c)) * Math.pow(1 - c, 2.2) + c) * (1 + (1.2 * (1 - c)))
}

/*
export class InterpCurve {

  constructor(public interpolator: Interpolator, public points: Vector2[]) {}

  val sortedPoints = points.sortWith { (a, b) => a._1 < b._1 }
  val reverseSorted = sortedPoints.reverse

  val max: Vector2 = sortedPoints.lastOption.getOrElse(Vector2.zero)
  val min: Vector2 = sortedPoints.headOption.getOrElse(Vector2.zero)
  val hasPoints = !points.isEmpty
  private val stepInterp = Interpolation.interp(interpolator)
  lazy val isUnit = max == Vector2.one && min == Vector2.zero && !points.exists(p => p._2<0 || p._2>1)

  def interp(x: Double): Double =
    if (x>=max.x) max.y else if (x<=min.x) min.y else {
      val endIdx = sortedPoints.indexWhere(x <= _.x)
      val start = sortedPoints(endIdx-1)
      val end = sortedPoints(endIdx)
      val progress = (x - start.x) / (end.x - start.x)
      stepInterp(progress, start.y, end.y)
    }

  static linear(points: Seq[Vector2]) = InterpCurve(identity, points)
  static linearUnit = InterpCurve(identity, List(Vector2.zero, Vector2.one))
}
*/
