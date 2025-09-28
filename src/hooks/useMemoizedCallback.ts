import { useCallback, useRef } from "react";

/**
 * メモ化されたコールバックフック
 * 依存配列が変更されない限り、同じ関数インスタンスを返す
 */
export function useMemoizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T {
  const ref = useRef<T>();

  // 依存配列が変更された場合のみ新しい関数を作成
  const memoizedCallback = useCallback(callback, deps);

  // 現在のコールバックを保存
  ref.current = memoizedCallback;

  return memoizedCallback;
}

/**
 * デバウンスされたコールバックフック
 * 指定された時間内に複数回呼ばれても、最後の呼び出しのみ実行
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: React.DependencyList = []
): T {
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useMemoizedCallback(
    ((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    }) as T,
    [callback, delay, ...deps]
  );
}

/**
 * スロットルされたコールバックフック
 * 指定された時間内に複数回呼ばれても、最初の呼び出しのみ実行
 */
export function useThrottledCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: React.DependencyList = []
): T {
  const lastCallRef = useRef<number>(0);

  return useMemoizedCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now();

      if (now - lastCallRef.current >= delay) {
        lastCallRef.current = now;
        callback(...args);
      }
    }) as T,
    [callback, delay, ...deps]
  );
}
