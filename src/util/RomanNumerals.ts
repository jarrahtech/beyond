export enum RomanNumeral {
  M = 1000,
  CM = 900,
  D = 500,
  CD = 400,
  C = 100,
  XC = 90,
  L = 50,
  XL = 40,
  X = 10,
  IX = 9,
  V = 5,
  IV = 4,
  I = 1
}

const allNumerals: RomanNumeral[] = [RomanNumeral.M, RomanNumeral.CM, RomanNumeral.D, RomanNumeral.CD, RomanNumeral.C, RomanNumeral.XC, RomanNumeral.L,
  RomanNumeral.XL, RomanNumeral.X, RomanNumeral.IX, RomanNumeral.V, RomanNumeral.IV, RomanNumeral.I]

export function toRoman (num: number): string {
  let result = ''
  let curr = Math.floor(num)
  for (let i = 0; i < allNumerals.length; i++) {
    const d = allNumerals[i]
    result += RomanNumeral[d].repeat(curr / d)
    curr %= d
  }
  return result
}

const numerals: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 }

export function fromRoman (num: string): number {
  const digits = num.split('')
  return digits.reduce((acc: number, curr: string, idx: number) => numerals[curr] < numerals[digits[idx + 1]] ? acc - numerals[curr] : acc + numerals[curr], 0)
}
