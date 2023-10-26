import { toRoman, fromRoman } from '../../src/util/RomanNumerals'

test('testToRoman', () => {
  expect(toRoman(2019)).toBe('MMXIX')
  expect(toRoman(3)).toBe('III')
  expect(toRoman(2904)).toBe('MMCMIV')
})

test('testFromRoman', () => {
  expect(fromRoman('MMCMIV')).toBe(2904)
  expect(fromRoman('XLIII')).toBe(43)
  expect(fromRoman('MMXIX')).toBe(2019)
  expect(fromRoman(toRoman(2019))).toBe(2019)
})
