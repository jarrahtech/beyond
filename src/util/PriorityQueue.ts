import {Opt, defined} from "./Opt";

export class PriorityQueue<T> {

  private queue: T[] = []; // TODO: is treemap better?

  constructor(public readonly comparator: (x:T, y:T) => number, ...initial: T[]) { initial?.forEach(this.enqueue.bind(this)); }

  enqueue(item: T): void {
    const idx = this.queue.findIndex((v) => this.comparator(item, v)<0);
    if (idx===-1) {
      this.queue.push(item);
    } else {
      this.queue.splice(idx, 0, item);
    } 
  }

  peek(): T { return this.queue[0]; }
  dequeue(): Opt<T> { return this.queue.shift(); }
  length(): number { return this.queue.length; }
  isEmpty(): boolean { return this.length()===0; }
  clear(): void { this.queue = []; }
  [Symbol.iterator](): Iterator<T> { return this.queue[Symbol.iterator](); }

  reprioritise(): void { this.queue.sort(this.comparator); }
  mapInPlace(fn: (e: T) => Opt<T>): void {
    this.queue = defined(this.queue.map(fn));
    this.reprioritise();
  }
}