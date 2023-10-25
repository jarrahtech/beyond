import { PriorityQueue } from '../../src/util/PriorityQueue'

test('should return true', () => {
  const q = new PriorityQueue<number>((x: number, y: number) => y - x, 1, 2, 3, 4)
  expect(q.length()).toBe(4)
  expect(q.isEmpty()).toBe(false)
  expect(q.peek()).toBe(4)

  expect(q.dequeue()).toBe(4)
  expect(q.dequeue()).toBe(3)
  q.enqueue(7)
  q.enqueue(0)

  expect(q.peek()).toBe(7)
  expect(q.dequeue()).toBe(7)
  expect(q.dequeue()).toBe(2)

  q.mapInPlace((n) => { return (n === 0) ? 3 : 1 })
  expect(q.peek()).toBe(3)
  expect(q.length()).toBe(2)
  expect(q.isEmpty()).toBe(false)

  q.clear()
  expect(q.peek()).toBeUndefined()
  expect(q.length()).toBe(0)
  expect(q.isEmpty()).toBe(true)
})
