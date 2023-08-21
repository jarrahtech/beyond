import { PressInputControl } from "../src/kassite/RtsCamera";

test('should return true', () => {
    expect(new PressInputControl().editable).toBe(true);
 });