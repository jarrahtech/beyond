import { PressInputControl } from '../../src/kassite/InputControl'

test('should return true', () => {
  expect(new PressInputControl('test').editable).toBe(true)
})
