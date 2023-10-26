import * as BABYLON from 'babylonjs'
import { type ParameterisedShader } from './ParameterisedShader'
// import { type Opt } from '../../util/Opt'

// TODO: be able to change initial values?
export class ParameterisedShaderMaterial extends BABYLON.ShaderMaterial {
  private readonly params = new Map<string, any>()
  constructor (name: string, scene: BABYLON.Scene, shader: ParameterisedShader) {
    super(name, scene, shader.toShaderPath, shader.toShaderOpts)
    for (const s of shader.defaults) {
      if (s.initial !== undefined) {
        s.setInitial(this)
        this.params.set(s.name, s.initial)
      }
    }
  }

  override setArray2 (name: string, val: number[]): ParameterisedShaderMaterial { super.setArray2(name, val); this.params.set(name, val); return this }
  override setArray3 (name: string, val: number[]): ParameterisedShaderMaterial { super.setArray3(name, val); this.params.set(name, val); return this }
  override setArray4 (name: string, val: number[]): ParameterisedShaderMaterial { super.setArray4(name, val); this.params.set(name, val); return this }
  override setColor3 (name: string, val: BABYLON.Color3): ParameterisedShaderMaterial { super.setColor3(name, val); this.params.set(name, val); return this }
  override setColor3Array (name: string, val: BABYLON.Color3[]): ParameterisedShaderMaterial { super.setColor3Array(name, val); this.params.set(name, val); return this }
  override setColor4 (name: string, val: BABYLON.Color4): ParameterisedShaderMaterial { super.setColor4(name, val); this.params.set(name, val); return this }
  override setColor4Array (name: string, val: BABYLON.Color4[]): ParameterisedShaderMaterial { super.setColor4Array(name, val); this.params.set(name, val); return this }
  override setExternalTexture (name: string, texture: BABYLON.ExternalTexture): ParameterisedShaderMaterial { super.setExternalTexture(name, texture); this.params.set(name, texture); return this }
  override setFloat (name: string, val: number): ParameterisedShaderMaterial { super.setFloat(name, val); this.params.set(name, val); return this }
  override setFloats (name: string, val: number[]): ParameterisedShaderMaterial { super.setFloats(name, val); this.params.set(name, val); return this }
  override setInt (name: string, val: number): ParameterisedShaderMaterial { super.setInt(name, val); this.params.set(name, val); return this }
  override setMatrices (name: string, val: BABYLON.Matrix[]): ParameterisedShaderMaterial { super.setMatrices(name, val); this.params.set(name, val); return this }
  override setMatrix (name: string, val: BABYLON.Matrix): ParameterisedShaderMaterial { super.setMatrix(name, val); this.params.set(name, val); return this }
  override setMatrix2x2 (name: string, val: number[] | Float32Array): ParameterisedShaderMaterial { super.setMatrix2x2(name, val); this.params.set(name, val); return this }
  override setMatrix3x3 (name: string, val: number[] | Float32Array): ParameterisedShaderMaterial { super.setMatrix3x3(name, val); this.params.set(name, val); return this }
  override setQuaternion (name: string, val: BABYLON.Quaternion): ParameterisedShaderMaterial { super.setQuaternion(name, val); this.params.set(name, val); return this }
  override setQuaternionArray (name: string, val: BABYLON.Quaternion[]): ParameterisedShaderMaterial { super.setQuaternionArray(name, val); this.params.set(name, val); return this }
  override setStorageBuffer (name: string, buffer: BABYLON.StorageBuffer): ParameterisedShaderMaterial { super.setStorageBuffer(name, buffer); this.params.set(name, buffer); return this }
  override setTexture (name: string, val: BABYLON.BaseTexture): ParameterisedShaderMaterial { super.setTexture(name, val); this.params.set(name, val); return this }
  override setTextureArray (name: string, textures: BABYLON.BaseTexture[]): ParameterisedShaderMaterial { super.setTextureArray(name, textures); this.params.set(name, textures); return this }
  override setTextureSampler (name: string, sampler: BABYLON.TextureSampler): ParameterisedShaderMaterial { super.setTextureSampler(name, sampler); this.params.set(name, sampler); return this }
  override setUInt (name: string, val: number): ParameterisedShaderMaterial { super.setUInt(name, val); this.params.set(name, val); return this }
  override setUniformBuffer (name: string, buffer: BABYLON.UniformBuffer): ParameterisedShaderMaterial { super.setUniformBuffer(name, buffer); this.params.set(name, buffer); return this }
  override setVector2 (name: string, val: BABYLON.Vector2): ParameterisedShaderMaterial { super.setVector2(name, val); this.params.set(name, val); return this }
  override setVector3 (name: string, val: BABYLON.Vector3): ParameterisedShaderMaterial { super.setVector3(name, val); this.params.set(name, val); return this }
  override setVector4 (name: string, val: BABYLON.Vector4): ParameterisedShaderMaterial { super.setVector4(name, val); this.params.set(name, val); return this }

  get (name: string): any { return this.params.get(name) }
  // TODO: are these necessary? and if so, complete these
  // getColor3 (name: string): Opt<BABYLON.Color3> { return this.params.get(name) }
  // getFloat (name: string): Opt<number> { return this.params.get(name) }
}
