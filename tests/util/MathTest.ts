import { clamp, clamp01, isEven } from '../../src/util/Math'

test('testClamp', () => {
  expect(Math.abs(2 - clamp(2, 1, 10)) < 0.000000001)
  expect(Math.abs(1 - clamp(-2, 1, 10)) < 0.000000001)
  expect(Math.abs(1 - clamp(0, 1, 10)) < 0.000000001)
  expect(Math.abs(10 - clamp(22, 1, 10)) < 0.000000001)
  expect(clamp(-10, 1, 10) === 1)

  expect(Math.abs(10 - clamp(10, 0.25, 11.6)) < 0.000000001)
  expect(Math.abs(0.25 - clamp(0.23, 0.25, 11.6)) < 0.000000001)
  expect(Math.abs(11.6 - clamp(365767.764567, 0.25, 11.6)) < 0.000000001)
})

test('testClamp01', () => {
  expect(Math.abs(0.2 - clamp01(0.2)) < 0.000000001)
  expect(Math.abs(0 - clamp01(0)) < 0.000000001)
  expect(Math.abs(0 - clamp01(-0.67)) < 0.000000001)
  expect(Math.abs(1 - clamp01(22)) < 0.000000001)
  expect(Math.abs(1 - clamp01(1)) < 0.000000001)
  expect(Math.abs(1 - clamp01(1.000003)) < 0.000000001)
})

test('isEven', () => {
  expect(isEven(2))
  expect(isEven(29867534))
  expect(isEven(0))
  expect(isEven(-98738))
  expect(!isEven(-3))
  expect(!isEven(15))
})
