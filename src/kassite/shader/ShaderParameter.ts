import { type ShaderMaterial, type Color3, type Color4, type ExternalTexture, type Matrix, type StorageBuffer, type Quaternion, type Vector2, type Vector3, type Vector4, type BaseTexture, type TextureSampler, type UniformBuffer } from '@babylonjs/core'
import { type Opt, ifDef } from '../../util/Opt'

export enum ShaderParamType {
  Uniform, Texture
}

abstract class ShaderParameter<T> {
  constructor (public name: string, public type: ShaderParamType, public initial: Opt<T>, public setter: (mat: ShaderMaterial) => (name: string, value: T) => ShaderMaterial) {}
  setInitial (mat: ShaderMaterial): void { ifDef(this.initial, (i) => this.setter(mat)(this.name, i)) }
}

export class Array2ShaderParameter extends ShaderParameter<number[]> {
  constructor (name: string, type: ShaderParamType, initial: Opt<number[]>) {
    super(name, type, initial, (mat) => (n, v) => mat.setArray2(n, v))
  }
}
export class Array3ShaderParameter extends ShaderParameter<number[]> {
  constructor (name: string, type: ShaderParamType, initial: Opt<number[]>) {
    super(name, type, initial, (mat) => (n, v) => mat.setArray3(n, v))
  }
}
export class Array4ShaderParameter extends ShaderParameter<number[]> {
  constructor (name: string, type: ShaderParamType, initial: Opt<number[]>) {
    super(name, type, initial, (mat) => (n, v) => mat.setArray4(n, v))
  }
}
export class Color3ShaderParameter extends ShaderParameter<Color3> {
  constructor (name: string, type: ShaderParamType, initial: Opt<Color3>) {
    super(name, type, initial, (mat) => (n, v) => mat.setColor3(n, v))
  }
}
export class Color4ShaderParameter extends ShaderParameter<Color4> {
  constructor (name: string, type: ShaderParamType, initial: Opt<Color4>) {
    super(name, type, initial, (mat) => (n, v) => mat.setColor4(n, v))
  }
}
export class Color3ArrayShaderParameter extends ShaderParameter<Color3[]> {
  constructor (name: string, type: ShaderParamType, initial: Opt<Color3[]>) {
    super(name, type, initial, (mat) => (n, v) => mat.setColor3Array(n, v))
  }
}
export class Color4ArrayShaderParameter extends ShaderParameter<Color4[]> {
  constructor (name: string, type: ShaderParamType, initial: Opt<Color4[]>) {
    super(name, type, initial, (mat) => (n, v) => mat.setColor4Array(n, v))
  }
}

export class ExternalTextureShaderParameter extends ShaderParameter<ExternalTexture> {
  constructor (name: string, type: ShaderParamType, initial: Opt<ExternalTexture>) {
    super(name, type, initial, (mat) => (n, v) => mat.setExternalTexture(n, v))
  }
}
export class FloatShaderParameter extends ShaderParameter<number> {
  constructor (name: string, type: ShaderParamType, initial: Opt<number>) {
    super(name, type, initial, (mat) => (n, v) => mat.setFloat(n, v))
  }
}
export class FloatsShaderParameter extends ShaderParameter<number[]> {
  constructor (name: string, type: ShaderParamType, initial: Opt<number[]>) {
    super(name, type, initial, (mat) => (n, v) => mat.setFloats(n, v))
  }
}
export class IntShaderParameter extends ShaderParameter<number> {
  constructor (name: string, type: ShaderParamType, initial: Opt<number>) {
    super(name, type, initial, (mat) => (n, v) => mat.setInt(n, v))
  }
}
export class MatricesShaderParameter extends ShaderParameter<Matrix[]> {
  constructor (name: string, type: ShaderParamType, initial: Opt<Matrix[]>) {
    super(name, type, initial, (mat) => (n, v) => mat.setMatrices(n, v))
  }
}
export class MatrixShaderParameter extends ShaderParameter<Matrix> {
  constructor (name: string, type: ShaderParamType, initial: Opt<Matrix>) {
    super(name, type, initial, (mat) => (n, v) => mat.setMatrix(n, v))
  }
}
export class Matrix2x2ShaderParameter extends ShaderParameter<number[]> {
  constructor (name: string, type: ShaderParamType, initial: Opt<number[]>) {
    super(name, type, initial, (mat) => (n, v) => mat.setMatrix2x2(n, v))
  }
}
export class TypedMatrix2x2ShaderParameter extends ShaderParameter<Float32Array> {
  constructor (name: string, type: ShaderParamType, initial: Opt<Float32Array>) {
    super(name, type, initial, (mat) => (n, v) => mat.setMatrix2x2(n, v))
  }
}
export class Matrix3x3ShaderParameter extends ShaderParameter<number[]> {
  constructor (name: string, type: ShaderParamType, initial: Opt<number[]>) {
    super(name, type, initial, (mat) => (n, v) => mat.setMatrix3x3(n, v))
  }
}
export class TypedMatrix3x3ShaderParameter extends ShaderParameter<Float32Array> {
  constructor (name: string, type: ShaderParamType, initial: Opt<Float32Array>) {
    super(name, type, initial, (mat) => (n, v) => mat.setMatrix3x3(n, v))
  }
}
export class QuaternionArrayShaderParameter extends ShaderParameter<Quaternion[]> {
  constructor (name: string, type: ShaderParamType, initial: Opt<Quaternion[]>) {
    super(name, type, initial, (mat) => (n, v) => mat.setQuaternionArray(n, v))
  }
}
export class StorageBufferShaderParameter extends ShaderParameter<StorageBuffer> {
  constructor (name: string, type: ShaderParamType, initial: Opt<StorageBuffer>) {
    super(name, type, initial, (mat) => (n, v) => mat.setStorageBuffer(n, v))
  }
}
export class TextureShaderParameter extends ShaderParameter<BaseTexture> {
  constructor (name: string, type: ShaderParamType, initial: Opt<BaseTexture>) {
    super(name, type, initial, (mat) => (n, v) => mat.setTexture(n, v))
  }
}
export class TextureArrayShaderParameter extends ShaderParameter<BaseTexture[]> {
  constructor (name: string, type: ShaderParamType, initial: Opt<BaseTexture[]>) {
    super(name, type, initial, (mat) => (n, v) => mat.setTextureArray(n, v))
  }
}
export class TextureSamplerShaderParameter extends ShaderParameter<TextureSampler> {
  constructor (name: string, type: ShaderParamType, initial: Opt<TextureSampler>) {
    super(name, type, initial, (mat) => (n, v) => mat.setTextureSampler(n, v))
  }
}
export class UIntShaderParameter extends ShaderParameter<number> {
  constructor (name: string, type: ShaderParamType, initial: Opt<number>) {
    ifDef(initial, (v) => { if (v <= 0) throw RangeError('must be >=0') })
    super(name, type, initial, (mat) => (n, v) => mat.setUInt(n, v))
  }
}
export class QuaternionShaderParameter extends ShaderParameter<Quaternion> {
  constructor (name: string, type: ShaderParamType, initial: Opt<Quaternion>) {
    super(name, type, initial, (mat) => (n, v) => mat.setQuaternion(n, v))
  }
}
export class UniformBufferShaderParameter extends ShaderParameter<UniformBuffer> {
  constructor (name: string, type: ShaderParamType, initial: Opt<UniformBuffer>) {
    super(name, type, initial, (mat) => (n, v) => mat.setUniformBuffer(n, v))
  }
}
export class V2ShaderParameter extends ShaderParameter<Vector2> {
  constructor (name: string, type: ShaderParamType, initial: Opt<Vector2>) {
    super(name, type, initial, (mat) => (n, v) => mat.setVector2(n, v))
  }
}
export class V3ShaderParameter extends ShaderParameter<Vector3> {
  constructor (name: string, type: ShaderParamType, initial: Opt<Vector3>) {
    super(name, type, initial, (mat) => (n, v) => mat.setVector3(n, v))
  }
}
export class V4ShaderParameter extends ShaderParameter<Vector4> {
  constructor (name: string, type: ShaderParamType, initial: Opt<Vector4>) {
    super(name, type, initial, (mat) => (n, v) => mat.setVector4(n, v))
  }
}

export class ShaderParams implements Iterable<ShaderParameter<any>> {
  readonly uniformNames
  readonly textureNames
  constructor (public params: Array<ShaderParameter<any>>) {
    for (let i = 0; i < params.length; i++) {
      for (let j = i + 1; j < params.length; j++) {
        if (params[i].name === params[j].name) throw RangeError('duplicate name')
      }
    }
    this.uniformNames = this.collectNames(ShaderParamType.Uniform)
    this.textureNames = this.collectNames(ShaderParamType.Texture)
  }

  [Symbol.iterator] (): Iterator<ShaderParameter<any>> { return this.params[Symbol.iterator]() }
  union (other: ShaderParams): ShaderParams { return new ShaderParams(this.params.concat(other.params)) }

  private collectNames (type: ShaderParamType): string[] { return this.params.filter((s) => s.type === type).map((s) => s.name) }
}

// TODO: derive(code: String): ShaderParams = ???
