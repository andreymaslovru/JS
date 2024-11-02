const hRange = [0, 360]
const sRange = [0, 100]
const lRange = [0, 90]

const getHashOfString = (str: string) => {
  let hash = 0

  for (let i = 0; i < str?.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 10) - hash * 3)
  }
  hash = Math.abs(hash)

  return hash
}

const normalizeHash = (hash: number, min: number, max: number) => {
  return Math.floor((hash % (max - min)) + min)
}

const generateHSL = (name: string): [number, number, number] => {
  const hash = getHashOfString(name)
  const h = normalizeHash(hash, hRange[0], hRange[1])
  const s = normalizeHash(hash, sRange[0], sRange[1])
  const l = normalizeHash(hash, lRange[0], lRange[1])

  return [h, s, l]
}

const HSLtoString = (hsl: [number, number, number]) => {
  return `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`
}

export const generateHSLFromStr = (str: string) => {
  const hsl = generateHSL(str)

  return HSLtoString(hsl)
}
