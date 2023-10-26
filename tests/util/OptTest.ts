import * as O from '../../src/util/Opt'

test('flatmap', () => {
  expect(O.flatmap(6, () => 7)).toBe(7)
  expect(O.flatmap(undefined, () => 7)).toBeUndefined()
})

test('ifDef', () => {
  let count = 0
  O.ifDef(6, () => { count = 7 })
  expect(count).toBe(7)
  O.ifDef(undefined, () => { count = 8 })
  expect(count).toBe(7)
})

test('ifDefElse', () => {
  let count = 0
  O.ifDefElse(6, () => { count = 7 }, () => { count = 8 })
  expect(count).toBe(7)
  O.ifDefElse(undefined, () => { count = 7 }, () => { count = 8 })
  expect(count).toBe(8)
})

test('defined', () => {
  expect(O.defined([1, 2, 3, 4])).toStrictEqual([1, 2, 3, 4])
  expect(O.defined([undefined, undefined, 1, undefined, 2, 3, 4, undefined])).toStrictEqual([1, 2, 3, 4])
  expect(O.defined([undefined, undefined])).toStrictEqual([])
})

test('maxByFn', () => {
  expect(O.maxByFn([1, 2, 3, 4], (e) => e + 1)).toStrictEqual(4)
  expect(O.maxByFn([1, 2, 3, 4], (e) => (e & 1) === 0 ? 0 : e)).toStrictEqual(3)
  const arr: number[] = []
  expect(O.maxByFn(arr, (e) => (e & 1) === 0 ? 0 : e)).toBeUndefined()
})

test('minByFn', () => {
  expect(O.minByFn([1, 2, 3, 4], (e) => e + 1)).toStrictEqual(1)
  expect(O.minByFn([1, 2, 3, 4], (e) => (e & 1) === 0 ? 0 : e)).toStrictEqual(2)
  const arr: number[] = []
  expect(O.minByFn(arr, (e) => (e & 1) === 0 ? 0 : e)).toBeUndefined()
})
