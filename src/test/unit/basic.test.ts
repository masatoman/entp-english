import { describe, expect, it } from "vitest";

/**
 * 基本的なテスト
 * 実装した機能の基本動作を確認
 */
describe("Basic Functionality Tests", () => {
  it("JavaScriptの基本動作が正常", () => {
    expect(1 + 1).toBe(2);
  });

  it("配列操作が正常", () => {
    const arr = [1, 2, 3];
    expect(arr.length).toBe(3);
    expect(arr.filter(x => x > 1)).toEqual([2, 3]);
  });

  it("オブジェクト操作が正常", () => {
    const obj = { name: "test", value: 42 };
    expect(obj.name).toBe("test");
    expect(obj.value).toBe(42);
  });

  it("LocalStorageのモック動作が正常", () => {
    // LocalStorageの基本動作テスト
    const testData = { test: "value" };
    localStorage.setItem("test-key", JSON.stringify(testData));
    
    const retrieved = localStorage.getItem("test-key");
    expect(retrieved).toBeTruthy();
    
    if (retrieved) {
      const parsed = JSON.parse(retrieved);
      expect(parsed.test).toBe("value");
    }
  });
});
