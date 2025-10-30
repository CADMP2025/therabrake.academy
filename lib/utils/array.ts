/**
 * Array Utilities
 * Helper functions for array manipulation
 */

/**
 * Remove duplicates from array
 */
export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array))
}

/**
 * Group array by key
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((result, item) => {
    const groupKey = String(item[key])
    if (!result[groupKey]) {
      result[groupKey] = []
    }
    result[groupKey].push(item)
    return result
  }, {} as Record<string, T[]>)
}

/**
 * Chunk array into smaller arrays
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

/**
 * Shuffle array randomly
 */
export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/**
 * Sort array by multiple keys
 */
export function sortBy<T>(array: T[], ...keys: (keyof T)[]): T[] {
  return [...array].sort((a, b) => {
    for (const key of keys) {
      if (a[key] < b[key]) return -1
      if (a[key] > b[key]) return 1
    }
    return 0
  })
}

/**
 * Get random item from array
 */
export function randomItem<T>(array: T[]): T | undefined {
  return array[Math.floor(Math.random() * array.length)]
}

/**
 * Get random items from array
 */
export function randomItems<T>(array: T[], count: number): T[] {
  const shuffled = shuffle(array)
  return shuffled.slice(0, Math.min(count, array.length))
}

/**
 * Remove item from array
 */
export function removeItem<T>(array: T[], item: T): T[] {
  return array.filter(i => i !== item)
}

/**
 * Remove items at indices
 */
export function removeAt<T>(array: T[], ...indices: number[]): T[] {
  return array.filter((_, index) => !indices.includes(index))
}

/**
 * Insert item at index
 */
export function insertAt<T>(array: T[], index: number, item: T): T[] {
  return [...array.slice(0, index), item, ...array.slice(index)]
}

/**
 * Move item from one index to another
 */
export function move<T>(array: T[], from: number, to: number): T[] {
  const result = [...array]
  const item = result.splice(from, 1)[0]
  result.splice(to, 0, item)
  return result
}

/**
 * Partition array into two arrays based on condition
 */
export function partition<T>(array: T[], predicate: (item: T) => boolean): [T[], T[]] {
  const pass: T[] = []
  const fail: T[] = []
  
  array.forEach(item => {
    if (predicate(item)) {
      pass.push(item)
    } else {
      fail.push(item)
    }
  })
  
  return [pass, fail]
}

/**
 * Get intersection of arrays
 */
export function intersection<T>(...arrays: T[][]): T[] {
  if (arrays.length === 0) return []
  return arrays.reduce((acc, arr) => acc.filter(item => arr.includes(item)))
}

/**
 * Get difference between arrays (items in first array but not in others)
 */
export function difference<T>(array: T[], ...others: T[][]): T[] {
  const otherItems = new Set(others.flat())
  return array.filter(item => !otherItems.has(item))
}

/**
 * Check if arrays are equal
 */
export function areEqual<T>(array1: T[], array2: T[]): boolean {
  if (array1.length !== array2.length) return false
  return array1.every((item, index) => item === array2[index])
}

/**
 * Flatten nested array
 */
export function flatten<T>(array: any[]): T[] {
  return array.flat(Infinity) as T[]
}

/**
 * Get first item or undefined
 */
export function first<T>(array: T[]): T | undefined {
  return array[0]
}

/**
 * Get last item or undefined
 */
export function last<T>(array: T[]): T | undefined {
  return array[array.length - 1]
}

/**
 * Create array of numbers from start to end
 */
export function range(start: number, end: number, step: number = 1): number[] {
  const result: number[] = []
  for (let i = start; i < end; i += step) {
    result.push(i)
  }
  return result
}
