// for use with JSON.stringify
// see https://stackoverflow.com/questions/29085197/how-do-you-json-stringify-an-es6-map
export function replacer (_: any, value: any): any {
  if (value instanceof Map) {
    return {
      dataType: 'Map',
      value: Array.from(value.entries()) // or with spread: value: [...value]
    }
  } else {
    return value
  }
}

// for use with JSON.parse
// see https://stackoverflow.com/questions/29085197/how-do-you-json-stringify-an-es6-map
export function reviver (_: any, value: any): any {
  if (typeof value === 'object' && value !== null) {
    if (value.dataType === 'Map') {
      return new Map(value.value)
    }
  }
  return value
}
