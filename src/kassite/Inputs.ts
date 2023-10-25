import type * as BABYLON from 'babylonjs'

let count = 0
export const emptyPrefix = 'empty'
export function empty (): string { return `${emptyPrefix}${count++}` }
export function isEmpty (input: string): boolean { return input.startsWith(emptyPrefix) }

export function modifierKey (alt: boolean, ctrl: boolean = false, meta: boolean = false, shift: boolean = false): string { return `${+alt}${+ctrl}${+meta}${+shift}` }
export function keyboard (key: string, alt: boolean = false, ctrl: boolean = false, meta: boolean = false, shift: boolean = false): string { return `keyboard_${key}_${modifierKey(alt, ctrl, meta, shift)}` }
export function pointerButton (button: number, alt: boolean = false, ctrl: boolean = false, meta: boolean = false, shift: boolean = false): string { return `pointerButton_${button}_${modifierKey(alt, ctrl, meta, shift)}` }
export function pointerPosition (alt: boolean = false, ctrl: boolean = false, meta: boolean = false, shift: boolean = false): string { return `pointerPosition_${modifierKey(alt, ctrl, meta, shift)}` }
export function wheel (alt: boolean = false, ctrl: boolean = false, meta: boolean = false, shift: boolean = false): string { return `wheel_${modifierKey(alt, ctrl, meta, shift)}` }

export function fromKeyboard (ev: BABYLON.IKeyboardEvent): string { return keyboard(ev.key, ev.altKey, ev.ctrlKey, ev.metaKey, ev.shiftKey) }
export function fromButton (ev: BABYLON.IMouseEvent): string { return pointerButton(ev.button, ev.altKey, ev.ctrlKey, ev.metaKey, ev.shiftKey) }
export function fromPosition (ev: BABYLON.IMouseEvent): string { return pointerPosition(ev.altKey, ev.ctrlKey, ev.metaKey, ev.shiftKey) }
export function fromWheel (ev: BABYLON.IMouseEvent): string { return wheel(ev.altKey, ev.ctrlKey, ev.metaKey, ev.shiftKey) }

export const a = keyboard('a')
export const b = keyboard('b')
export const c = keyboard('c')
export const d = keyboard('d')
export const e = keyboard('e')
export const f = keyboard('f')
export const g = keyboard('g')
export const h = keyboard('h')
export const i = keyboard('i')
export const j = keyboard('j')
export const k = keyboard('k')
export const l = keyboard('l')
export const m = keyboard('m')
export const n = keyboard('n')
export const o = keyboard('o')
export const p = keyboard('p')
export const q = keyboard('q')
export const r = keyboard('r')
export const s = keyboard('s')
export const t = keyboard('t')
export const u = keyboard('u')
export const v = keyboard('v')
export const w = keyboard('w')
export const x = keyboard('x')
export const y = keyboard('y')
export const z = keyboard('z')

export const mouse0 = pointerButton(0)
export const mouse1 = pointerButton(1)
export const mouse2 = pointerButton(2)
export const mousePosition = pointerPosition()
export const mouseWheel = wheel()

export const arrowLeft = keyboard('ArrowLeft')
export const arrowRight = keyboard('ArrowRight')
export const arrowUp = keyboard('ArrowUp')
export const arrowDown = keyboard('ArrowDown')
export const esc = keyboard('Escape')
