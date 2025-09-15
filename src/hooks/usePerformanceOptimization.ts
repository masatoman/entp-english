import { useCallback, useMemo, useRef, useEffect, useState } from 'react'

/**
 * パフォーマンス最適化のためのカスタムフック
 */
export const usePerformanceOptimization = () => {
  /**
   * デバウンスされたコールバック
   */
  const useDebouncedCallback = <T extends (...args: any[]) => any>(
    callback: T,
    delay: number
  ): T => {
    const timeoutRef = useRef<NodeJS.Timeout>()
    
    return useCallback((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      
      timeoutRef.current = setTimeout(() => {
        callback(...args)
      }, delay)
    }, [callback, delay]) as T
  }

  /**
   * スロットルされたコールバック
   */
  const useThrottledCallback = <T extends (...args: any[]) => any>(
    callback: T,
    delay: number
  ): T => {
    const lastCallRef = useRef<number>(0)
    
    return useCallback((...args: Parameters<T>) => {
      const now = Date.now()
      if (now - lastCallRef.current >= delay) {
        lastCallRef.current = now
        callback(...args)
      }
    }, [callback, delay]) as T
  }

  /**
   * メモ化された値の計算
   */
  const useMemoizedValue = <T>(
    factory: () => T,
    deps: React.DependencyList
  ): T => {
    return useMemo(factory, deps)
  }

  /**
   * メモ化されたコールバック
   */
  const useMemoizedCallback = <T extends (...args: any[]) => any>(
    callback: T,
    deps: React.DependencyList
  ): T => {
    return useCallback(callback, deps)
  }

  /**
   * パフォーマンス監視
   */
  const usePerformanceMonitor = (componentName: string) => {
    const renderCountRef = useRef(0)
    const startTimeRef = useRef<number>(0)
    
    useEffect(() => {
      renderCountRef.current += 1
      startTimeRef.current = performance.now()
      
      return () => {
        const endTime = performance.now()
        const renderTime = endTime - startTimeRef.current
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`${componentName} render #${renderCountRef.current}: ${renderTime.toFixed(2)}ms`)
        }
      }
    })
    
    return {
      renderCount: renderCountRef.current,
      measureRender: (fn: () => void) => {
        const start = performance.now()
        fn()
        const end = performance.now()
        console.log(`${componentName} operation: ${(end - start).toFixed(2)}ms`)
      }
    }
  }

  /**
   * 仮想スクロール用のフック
   */
  const useVirtualScroll = <T>(
    items: T[],
    itemHeight: number,
    containerHeight: number
  ) => {
    const [scrollTop, setScrollTop] = useState(0)
    
    const visibleItems = useMemo(() => {
      const startIndex = Math.floor(scrollTop / itemHeight)
      const endIndex = Math.min(
        startIndex + Math.ceil(containerHeight / itemHeight) + 1,
        items.length
      )
      
      return items.slice(startIndex, endIndex).map((item, index) => ({
        item,
        index: startIndex + index,
        top: (startIndex + index) * itemHeight
      }))
    }, [items, itemHeight, containerHeight, scrollTop])
    
    const totalHeight = items.length * itemHeight
    
    return {
      visibleItems,
      totalHeight,
      setScrollTop
    }
  }

  /**
   * 無限スクロール用のフック
   */
  const useInfiniteScroll = (
    callback: () => void,
    hasMore: boolean,
    threshold: number = 100
  ) => {
    const observerRef = useRef<IntersectionObserver>()
    const lastElementRef = useRef<HTMLElement>()
    
    const lastElementCallback = useCallback((node: HTMLElement) => {
      if (observerRef.current) observerRef.current.disconnect()
      
      observerRef.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          callback()
        }
      })
      
      if (node) observerRef.current.observe(node)
      lastElementRef.current = node
    }, [callback, hasMore])
    
    useEffect(() => {
      return () => {
        if (observerRef.current) observerRef.current.disconnect()
      }
    }, [])
    
    return lastElementCallback
  }

  /**
   * パフォーマンス最適化されたイベントハンドラー
   */
  const useOptimizedEventHandler = <T extends (...args: any[]) => any>(
    handler: T,
    options: {
      debounce?: number
      throttle?: number
      passive?: boolean
    } = {}
  ) => {
    const { debounce, throttle, passive = true } = options
    
    const optimizedHandler = useMemo(() => {
      if (debounce) {
        return useDebouncedCallback(handler, debounce)
      }
      if (throttle) {
        return useThrottledCallback(handler, throttle)
      }
      return handler
    }, [handler, debounce, throttle])
    
    return {
      handler: optimizedHandler,
      options: { passive }
    }
  }

  /**
   * メモリ使用量の監視
   */
  const useMemoryMonitor = () => {
    const [memoryInfo, setMemoryInfo] = useState<{
      usedJSHeapSize: number
      totalJSHeapSize: number
      jsHeapSizeLimit: number
    } | null>(null)
    
    useEffect(() => {
      const updateMemoryInfo = () => {
        if ('memory' in performance) {
          const memory = (performance as any).memory
          setMemoryInfo({
            usedJSHeapSize: memory.usedJSHeapSize,
            totalJSHeapSize: memory.totalJSHeapSize,
            jsHeapSizeLimit: memory.jsHeapSizeLimit
          })
        }
      }
      
      updateMemoryInfo()
      const interval = setInterval(updateMemoryInfo, 5000)
      
      return () => clearInterval(interval)
    }, [])
    
    return memoryInfo
  }

  /**
   * パフォーマンス最適化された状態管理
   */
  const useOptimizedState = <T>(
    initialState: T,
    options: {
      deepCompare?: boolean
      customCompare?: (prev: T, next: T) => boolean
    } = {}
  ) => {
    const { deepCompare = false, customCompare } = options
    const [state, setState] = useState(initialState)
    const prevStateRef = useRef<T>(initialState)
    
    const setOptimizedState = useCallback((newState: T | ((prev: T) => T)) => {
      setState(prevState => {
        const nextState = typeof newState === 'function' ? (newState as (prev: T) => T)(prevState) : newState
        
        if (customCompare) {
          if (customCompare(prevState, nextState)) {
            return prevState
          }
        } else if (deepCompare) {
          if (JSON.stringify(prevState) === JSON.stringify(nextState)) {
            return prevState
          }
        } else if (prevState === nextState) {
          return prevState
        }
        
        prevStateRef.current = nextState
        return nextState
      })
    }, [deepCompare, customCompare])
    
    return [state, setOptimizedState] as const
  }

  return {
    useDebouncedCallback,
    useThrottledCallback,
    useMemoizedValue,
    useMemoizedCallback,
    usePerformanceMonitor,
    useVirtualScroll,
    useInfiniteScroll,
    useOptimizedEventHandler,
    useMemoryMonitor,
    useOptimizedState
  }
}
