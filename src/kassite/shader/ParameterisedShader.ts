import { type Scene, Effect, type IShaderMaterialOptions } from '@babylonjs/core'
import { type ShaderParams } from './ShaderParameter'
import { ParameterisedShaderMaterial } from './ParameterisedShaderMaterial'

interface ShaderType { suffix: string, path: string }
export const Vertex: ShaderType = { suffix: 'VertexShader', path: 'vertex' }
export const Fragment: ShaderType = { suffix: 'FragmentShader', path: 'fragment' }

abstract class SubShader {
  constructor (public name: string, public type: string, public params: ShaderParams, public code: string) {
    if (Effect.ShadersStore[name] === undefined) { Effect.ShadersStore[`${name}${type}`] = code }
  }
}

export class VertexShader extends SubShader {
  constructor (name: string, params: ShaderParams, code: string) {
    if (!code.includes('gl_Position')) throw RangeError('need a vertex shader')
    super(name, 'VertexShader', params, code)
  }
}

export class FragmentShader extends SubShader {
  constructor (name: string, params: ShaderParams, code: string) {
    if (!code.includes('gl_FragColor')) throw RangeError('need a fragment shader')
    super(name, 'FragmentShader', params, code)
  }
}

export class ParameterisedShader {
  readonly defaults: ShaderParams
  readonly toShaderPath: { vertex: string, fragment: string } // TODO: handle other path types? See https://doc.babylonjs.com/features/featuresDeepDive/materials/shaders/shaderMaterial
  readonly toShaderOpts: Partial<IShaderMaterialOptions>

  constructor (public vertex: VertexShader, public fragment: FragmentShader) {
    this.defaults = vertex.params.union(fragment.params)
    this.toShaderOpts = { uniformBuffers: this.defaults.uniformNames, samplers: this.defaults.textureNames }
    this.toShaderPath = { vertex: this.vertex.name, fragment: this.fragment.name }
  }

  toMaterial (scene: Scene): ParameterisedShaderMaterial { return this.toNamedMaterial(scene, `${this.fragment.name}_material`) }
  toNamedMaterial (scene: Scene, name: string): ParameterisedShaderMaterial { return new ParameterisedShaderMaterial(name, scene, this) }
}
