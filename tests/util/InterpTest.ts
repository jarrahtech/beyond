import { lerp } from '../../src/util/Interp'

test('testLerp', () => {
  expect(Math.abs(0.5 - lerp(0.5, 0, 1)) < 0.000000001)
  expect(Math.abs(0 - lerp(0, 0, 1)) < 0.000000001)
  expect(Math.abs(1 - lerp(1, 0, 1)) < 0.000000001)
  expect(Math.abs(0 - lerp(-1, 0, 1)) < 0.000000001)
  expect(Math.abs(1 - lerp(2.5, 0, 1)) < 0.000000001)
  expect(Math.abs(3 - lerp(0.2, 2, 7)) < 0.000000001)
  expect(Math.abs(0.52 - lerp(0.2, -2.2, 11.4)) < 0.000000001)
})

/*
class InterpCurveTest extends AnyFunSuite {

  val ig = InterpCurve.linear(List(Vector2(0, 4),Vector2(0.1, 0.5),Vector2(1, 0.1),Vector2(5, 0.05)))

  test("testPoints") {
    expect(4 == ig.interp(0))
    expect(0.5 == ig.interp(0.1))
    expect(Math.abs(0.1 - ig.interp(1))<0.0000001)
    expect(Math.abs(0.05 - ig.interp(5))<0.0000001)
  }

  test("testExtrap") {
    expect(0.05 == ig.interp(6))
    expect(4 == ig.interp(-1))
  }

  test("testInterp") {
    expect(Math.abs(0.0765 - ig.interp(2.88))< 0.001)
    expect(Math.abs(2.25 - ig.interp(0.05))< 0.001)
    expect(Math.abs(0.1888 - ig.interp(0.8))< 0.001)
  }

  test("testHasPoints") {
    expect(ig.hasPoints)
    expect(!InterpCurve.linear(List.empty).hasPoints)
  }

  test("testMin") {
    expect(Vector2(0, 4) == ig.min)
    expect(Vector2(0, 0) == InterpCurve.linear(List.empty).min)
  }

  test("testMax") {
    expect(Vector2(5, 0.05) == ig.max)
    expect(Vector2(0, 0) == InterpCurve.linear(List.empty).max)
  }

  test("isUnit") {
    expect(!ig.isUnit)
    expect(!InterpCurve.linear(List.empty).isUnit)
    expect(InterpCurve.linearUnit.isUnit)
    expect(InterpCurve.linear(List(Vector2.zero, Vector2(0.2, 0.1), Vector2(0.8, 0.9), Vector2.one)).isUnit)
    expect(!InterpCurve.linear(List(Vector2.zero, Vector2(0.2, 1.1), Vector2(0.8, 0.9), Vector2.one)).isUnit)
    expect(!InterpCurve.linear(List(Vector2.zero, Vector2(0.2, 1.1), Vector2(0.8, 0.9), Vector2(1.1, 1))).isUnit)
    expect(!InterpCurve(Interpolation.sinInterp, List(Vector2.zero, Vector2(0.2, 1.1), Vector2(0.8, 0.9), Vector2.one)).isUnit)
  }

}
*/
