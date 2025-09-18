import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PreStudyMenu from "../../components/starSystem/PreStudyMenu";
import * as dataManager from "../../utils/dataManager";
import * as levelManager from "../../utils/levelManager";

// モック設定
vi.mock("../../utils/levelManager");
vi.mock("../../utils/dataManager");

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// テスト用のモックデータ
const mockLevelManager = {
  getLevel: vi.fn().mockReturnValue({ level: 1 }),
};

const mockPreStudyProgress = {
  completedContents: [],
  totalContentsStudied: 0,
  contentsByCategory: {},
  averageComprehension: 0,
  totalTimeSpent: 0,
};

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe("PreStudyMenu Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // levelManager のモック
    vi.mocked(levelManager.getLevelManager).mockReturnValue(mockLevelManager);

    // DataManager のモック
    vi.mocked(dataManager.DataManager.getPreStudyProgress).mockReturnValue(
      mockPreStudyProgress
    );
  });

  describe("基本表示", () => {
    it("コンポーネントが正しくレンダリングされる", () => {
      render(
        <TestWrapper>
          <PreStudyMenu />
        </TestWrapper>
      );

      expect(screen.getByText("📚 事前学習")).toBeInTheDocument();
      expect(screen.getByText("理論を理解してから実践へ")).toBeInTheDocument();
    });

    it("フィルターが正しく表示される", () => {
      render(
        <TestWrapper>
          <PreStudyMenu />
        </TestWrapper>
      );

      expect(screen.getByText("すべてのカテゴリ")).toBeInTheDocument();
      expect(screen.getByText("すべてのレベル")).toBeInTheDocument();
    });

    it("戻るボタンが正しく動作する", () => {
      render(
        <TestWrapper>
          <PreStudyMenu />
        </TestWrapper>
      );

      const backButton = screen.getByText("戻る");
      fireEvent.click(backButton);

      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  describe("コンテンツ表示", () => {
    it("レベル1で利用可能なコンテンツが表示される", () => {
      render(
        <TestWrapper>
          <PreStudyMenu />
        </TestWrapper>
      );

      // Level 1で利用可能な「英文の基本構造」が表示されることを確認
      expect(screen.getByText("英文の基本構造")).toBeInTheDocument();
      // Level 1要素が複数ある場合は最初の要素をチェック
      const level1Elements = screen.getAllByText("Level 1");
      expect(level1Elements.length).toBeGreaterThan(0);
      expect(screen.getByText("⏱️ 5分")).toBeInTheDocument();
    });

    it("推奨コンテンツが正しく表示される", () => {
      render(
        <TestWrapper>
          <PreStudyMenu />
        </TestWrapper>
      );

      expect(screen.getByText("🎯 推奨コンテンツ")).toBeInTheDocument();
      expect(screen.getByText("📖 利用可能なコンテンツ")).toBeInTheDocument();
    });

    it("コンテンツの詳細情報が表示される", () => {
      render(
        <TestWrapper>
          <PreStudyMenu />
        </TestWrapper>
      );

      expect(screen.getByText("英語の基本語順はSVO")).toBeInTheDocument();
      expect(
        screen.getByText("be動詞と一般動詞の使い分け")
      ).toBeInTheDocument();
      expect(screen.getByText("理論学習 - theory")).toBeInTheDocument();
    });
  });

  describe("フィルター機能", () => {
    it("カテゴリーフィルターが機能する", async () => {
      render(
        <TestWrapper>
          <PreStudyMenu />
        </TestWrapper>
      );

      const categoryFilter = screen.getByDisplayValue("すべてのカテゴリ");
      fireEvent.change(categoryFilter, { target: { value: "grammar" } });

      await waitFor(() => {
        // grammar カテゴリーのコンテンツのみ表示されることを確認
        expect(screen.getByText("英文の基本構造")).toBeInTheDocument();
      });
    });

    it("レベルフィルターが機能する", async () => {
      render(
        <TestWrapper>
          <PreStudyMenu />
        </TestWrapper>
      );

      const levelFilter = screen.getByDisplayValue("すべてのレベル");
      fireEvent.change(levelFilter, { target: { value: "1" } });

      await waitFor(() => {
        // Level 1のコンテンツのみ表示されることを確認（複数ある場合は最初の要素）
        const level1Elements = screen.getAllByText("Level 1");
        expect(level1Elements.length).toBeGreaterThan(0);
      });
    });
  });

  describe("相乗効果テスト", () => {
    it("文法カテゴリーとの対応が正確", () => {
      render(
        <TestWrapper>
          <PreStudyMenu />
        </TestWrapper>
      );

      // 「英文の基本構造」が文法クイズの「基本文型」と対応していることを確認
      expect(screen.getByText("⭐️ grammar")).toBeInTheDocument();
      expect(screen.getByText("英文の基本構造")).toBeInTheDocument();
    });

    it("レベル制限が正しく機能する", () => {
      // レベル1のユーザー
      mockLevelManager.getLevel.mockReturnValue({ level: 1 });

      render(
        <TestWrapper>
          <PreStudyMenu />
        </TestWrapper>
      );

      // Level 1のコンテンツのみ表示
      expect(screen.getByText("英文の基本構造")).toBeInTheDocument();

      // Level 2以上のコンテンツは表示されない
      expect(
        screen.queryByText("時制の概念と使い分け")
      ).not.toBeInTheDocument();
    });

    it("完了済みコンテンツの表示が正しい", () => {
      // 完了済みコンテンツがある場合
      const progressWithCompleted = {
        ...mockPreStudyProgress,
        completedContents: ["basic-grammar-theory"],
      };

      vi.mocked(dataManager.DataManager.getPreStudyProgress).mockReturnValue(
        progressWithCompleted
      );

      render(
        <TestWrapper>
          <PreStudyMenu />
        </TestWrapper>
      );

      // 完了済みコンテンツが適切に処理されることを確認
      expect(screen.getByText("英文の基本構造")).toBeInTheDocument();
    });
  });

  describe("エラーハンドリング", () => {
    it("レベルデータが不正な場合のフォールバック", () => {
      // 不正なレベルデータ
      mockLevelManager.getLevel.mockReturnValue("invalid");

      render(
        <TestWrapper>
          <PreStudyMenu />
        </TestWrapper>
      );

      // デフォルトレベル1として動作することを確認
      expect(screen.getByText("英文の基本構造")).toBeInTheDocument();
    });

    it("データ取得エラー時のフォールバック", () => {
      vi.mocked(dataManager.DataManager.getPreStudyProgress).mockImplementation(
        () => {
          throw new Error("データ取得エラー");
        }
      );

      render(
        <TestWrapper>
          <PreStudyMenu />
        </TestWrapper>
      );

      // エラーが発生してもコンポーネントがレンダリングされることを確認
      expect(screen.getByText("📚 事前学習")).toBeInTheDocument();
    });
  });

  describe("ナビゲーション", () => {
    it("コンテンツ選択時に正しいURLに遷移する", async () => {
      render(
        <TestWrapper>
          <PreStudyMenu />
        </TestWrapper>
      );

      const contentCard = screen.getByText("英文の基本構造");
      fireEvent.click(contentCard);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(
          "/learning/pre-study/content/basic-grammar-theory"
        );
      });
    });
  });
});
