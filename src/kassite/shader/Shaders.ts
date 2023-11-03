import { Color3 } from '@babylonjs/core'
import { ParameterisedShader, VertexShader, FragmentShader } from './ParameterisedShader'
import * as SHADER from './ShaderParameter'

export const unlitTransparent = (): ParameterisedShader => new ParameterisedShader(
  new VertexShader('basic',
    new SHADER.ShaderParams([]),
    'precision highp float;attribute vec3 position;attribute vec2 uv;uniform mat4 worldViewProjection;varying vec2 vUV;void main(void){gl_Position=worldViewProjection*vec4(position,1.0);vUV =uv;}'),
  new FragmentShader('unlit',
    new SHADER.ShaderParams([
      new SHADER.Color3ShaderParameter('color', SHADER.ShaderParamType.Uniform, new Color3(1, 1, 1)),
      new SHADER.FloatShaderParameter('opacity', SHADER.ShaderParamType.Uniform, 0.99),
      new SHADER.TextureShaderParameter('tex', SHADER.ShaderParamType.Uniform, undefined)]),
    'precision highp float;varying vec2 vUV;uniform sampler2D tex;uniform vec3 color;uniform float opacity;void main(void){gl_FragColor=texture2D(tex,vUV)*vec4(color,opacity);}')
)
