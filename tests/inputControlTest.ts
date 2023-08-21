import { PressInputControl } from "../src/kassite/InputControl";

test('should return true', () => {
    expect(new PressInputControl().editable).toBe(true);
 });