/**
 * パフォーマンス最適化のためのユーティリティ関数
 */

/**
 * デバウンス関数
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = false
): T => {
  let timeout: NodeJS.Timeout | null = null
  
  return ((...args: Parameters<T>) => {
    const later = () => {
      timeout = null
      if (!immediate) func(...args)
    }
    
    const callNow = immediate && !timeout
    
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    
    if (callNow) func(...args)
  }) as T
}

/**
 * スロットル関数
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): T => {
  let inThrottle: boolean
  
  return ((...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }) as T
}

/**
 * メモ化関数
 */
export const memoize = <T extends (...args: any[]) => any>(
  func: T,
  keyGenerator?: (...args: Parameters<T>) => string
): T => {
  const cache = new Map<string, ReturnType<T>>()
  
  return ((...args: Parameters<T>) => {
    const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args)
    
    if (cache.has(key)) {
      return cache.get(key)!
    }
    
    const result = func(...args)
    cache.set(key, result)
    
    return result
  }) as T
}

/**
 * 遅延実行関数
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * アニメーションフレームを使用した遅延実行
 */
export const requestAnimationFrameDelay = (callback: () => void): void => {
  requestAnimationFrame(callback)
}

/**
 * パフォーマンス測定
 */
export const measurePerformance = <T extends (...args: any[]) => any>(
  func: T,
  name?: string
): T => {
  return ((...args: Parameters<T>) => {
    const start = performance.now()
    const result = func(...args)
    const end = performance.now()
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`${name || 'Function'} execution time: ${(end - start).toFixed(2)}ms`)
    }
    
    return result
  }) as T
}

/**
 * バッチ処理
 */
export const batch = <T>(items: T[], batchSize: number): T[][] => {
  const batches: T[][] = []
  
  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize))
  }
  
  return batches
}

/**
 * 非同期バッチ処理
 */
export const batchAsync = async <T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  batchSize: number = 10,
  delayMs: number = 0
): Promise<R[]> => {
  const batches = batch(items, batchSize)
  const results: R[] = []
  
  for (const batch of batches) {
    const batchResults = await Promise.all(batch.map(processor))
    results.push(...batchResults)
    
    if (delayMs > 0) {
      await delay(delayMs)
    }
  }
  
  return results
}

/**
 * 重複排除
 */
export const unique = <T>(array: T[], key?: (item: T) => any): T[] => {
  if (!key) {
    return [...new Set(array)]
  }
  
  const seen = new Set()
  return array.filter(item => {
    const keyValue = key(item)
    if (seen.has(keyValue)) {
      return false
    }
    seen.add(keyValue)
    return true
  })
}

/**
 * 配列のチャンク分割
 */
export const chunk = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = []
  
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  
  return chunks
}

/**
 * 配列のシャッフル
 */
export const shuffle = <T>(array: T[]): T[] => {
  const shuffled = [...array]
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  
  return shuffled
}

/**
 * 配列のサンプリング
 */
export const sample = <T>(array: T[], count: number): T[] => {
  const shuffled = shuffle(array)
  return shuffled.slice(0, count)
}

/**
 * 深いクローン
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as T
  }
  
  if (typeof obj === 'object') {
    const cloned = {} as T
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key])
      }
    }
    return cloned
  }
  
  return obj
}

/**
 * オブジェクトの深いマージ
 */
export const deepMerge = <T extends Record<string, any>>(target: T, source: Partial<T>): T => {
  const result = { ...target }
  
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      const sourceValue = source[key]
      const targetValue = result[key]
      
      if (sourceValue && typeof sourceValue === 'object' && !Array.isArray(sourceValue) &&
          targetValue && typeof targetValue === 'object' && !Array.isArray(targetValue)) {
        result[key] = deepMerge(targetValue, sourceValue)
      } else {
        result[key] = sourceValue
      }
    }
  }
  
  return result
}

/**
 * パフォーマンス監視
 */
export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private marks: Map<string, number> = new Map()
  private measures: Map<string, number> = new Map()
  
  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }
  
  mark(name: string): void {
    this.marks.set(name, performance.now())
  }
  
  measure(name: string, startMark: string, endMark?: string): number {
    const startTime = this.marks.get(startMark)
    const endTime = endMark ? this.marks.get(endMark) : performance.now()
    
    if (startTime === undefined) {
      throw new Error(`Start mark "${startMark}" not found`)
    }
    
    if (endTime === undefined) {
      throw new Error(`End mark "${endMark}" not found`)
    }
    
    const duration = endTime - startTime
    this.measures.set(name, duration)
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`Performance measure "${name}": ${duration.toFixed(2)}ms`)
    }
    
    return duration
  }
  
  getMeasure(name: string): number | undefined {
    return this.measures.get(name)
  }
  
  getAllMeasures(): Record<string, number> {
    return Object.fromEntries(this.measures)
  }
  
  clear(): void {
    this.marks.clear()
    this.measures.clear()
  }
}

/**
 * メモリ使用量の監視
 */
export const getMemoryUsage = (): {
  usedJSHeapSize: number
  totalJSHeapSize: number
  jsHeapSizeLimit: number
} | null => {
  if ('memory' in performance) {
    const memory = (performance as any).memory
    return {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit
    }
  }
  return null
}

/**
 * パフォーマンス最適化されたイベントリスナー
 */
export const addOptimizedEventListener = (
  element: EventTarget,
  event: string,
  handler: EventListener,
  options: AddEventListenerOptions = {}
): (() => void) => {
  const optimizedHandler = throttle(handler, 16) // 60fps
  element.addEventListener(event, optimizedHandler, { passive: true, ...options })
  
  return () => {
    element.removeEventListener(event, optimizedHandler, options)
  }
}

/**
 * リサイズオブザーバーの最適化
 */
export const createOptimizedResizeObserver = (
  callback: ResizeObserverCallback,
  options: ResizeObserverOptions = {}
): ResizeObserver => {
  const throttledCallback = throttle(callback, 16) // 60fps
  return new ResizeObserver(throttledCallback)
}

/**
 * インタセクションオブザーバーの最適化
 */
export const createOptimizedIntersectionObserver = (
  callback: IntersectionObserverCallback,
  options: IntersectionObserverInit = {}
): IntersectionObserver => {
  const throttledCallback = throttle(callback, 100) // 10fps
  return new IntersectionObserver(throttledCallback, options)
}
