import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import EssayWriting from "../../components/EssayWriting";
import * as dataManager from "../../utils/dataManager";
import * as gachaSystem from "../../utils/gachaSystem";
import * as levelManager from "../../utils/levelManager";

// モック設定
vi.mock("../../utils/levelManager");
vi.mock("../../utils/dataManager");
vi.mock("../../utils/gachaSystem");

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
  addXP: vi.fn(),
};

const mockGachaData = {
  ownedCards: [
    { id: 1, word: "student", meaning: "学生", rarity: "common" },
    { id: 2, word: "work", meaning: "働く", rarity: "common" },
    { id: 3, word: "like", meaning: "好き", rarity: "common" },
  ],
};

const mockPreStudyProgress = {
  completedContents: ["basic-grammar-theory"],
  totalContentsStudied: 1,
};

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe("EssayWriting Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // levelManager のモック
    vi.mocked(levelManager.getLevelManager).mockReturnValue(mockLevelManager);

    // DataManager のモック
    vi.mocked(dataManager.DataManager.getPreStudyProgress).mockReturnValue(
      mockPreStudyProgress
    );

    // GachaSystem のモック
    vi.mocked(gachaSystem.GachaSystem.getUserGachaData).mockReturnValue(
      mockGachaData
    );
  });

  describe("課題選択画面", () => {
    it("コンポーネントが正しくレンダリングされる", () => {
      render(
        <TestWrapper>
          <EssayWriting />
        </TestWrapper>
      );

      expect(screen.getByText("英作文")).toBeInTheDocument();
      expect(
        screen.getByText("文法と語彙を実践で活用しよう")
      ).toBeInTheDocument();
      expect(screen.getByText("ユーザーレベル")).toBeInTheDocument();
    });

    it("学習連携状況が正しく表示される", () => {
      render(
        <TestWrapper>
          <EssayWriting />
        </TestWrapper>
      );

      expect(screen.getByText("🔗 学習連携状況")).toBeInTheDocument();
      expect(screen.getByText("獲得語彙カード")).toBeInTheDocument();
      expect(screen.getByText("3枚")).toBeInTheDocument(); // mockGachaData.ownedCards.length
      expect(screen.getByText("完了した事前学習")).toBeInTheDocument();
      expect(screen.getByText("1件")).toBeInTheDocument(); // mockPreStudyProgress.completedContents.length
    });

    it("推奨課題が表示される", () => {
      render(
        <TestWrapper>
          <EssayWriting />
        </TestWrapper>
      );

      expect(screen.getByText("あなたにおすすめの英作文")).toBeInTheDocument();
      expect(screen.getByText("自己紹介文を書こう")).toBeInTheDocument();
    });

    it("利用可能な課題一覧が表示される", () => {
      render(
        <TestWrapper>
          <EssayWriting />
        </TestWrapper>
      );

      expect(screen.getByText("利用可能な英作文課題")).toBeInTheDocument();
      // Level 1で利用可能な課題が表示されることを確認
      const level1Tasks = screen.getAllByText(/Level 1/);
      expect(level1Tasks.length).toBeGreaterThan(0);
    });

    it("戻るボタンが正しく動作する", () => {
      render(
        <TestWrapper>
          <EssayWriting />
        </TestWrapper>
      );

      const backButton = screen.getByText("戻る");
      fireEvent.click(backButton);

      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  describe("英作文画面", () => {
    it("課題選択後に英作文画面が表示される", async () => {
      render(
        <TestWrapper>
          <EssayWriting />
        </TestWrapper>
      );

      // 課題を選択（推奨セクションから）
      const taskCards = screen.getAllByText("自己紹介文を書こう");
      fireEvent.click(taskCards[0]); // 最初の要素（推奨課題）をクリック

      await waitFor(() => {
        expect(screen.getByText("課題の指示")).toBeInTheDocument();
        expect(screen.getByText("📝 指示内容")).toBeInTheDocument();
        expect(screen.getByText("🎭 場面設定")).toBeInTheDocument();
        expect(screen.getByText("🎯 推奨語彙")).toBeInTheDocument();
        expect(screen.getByText("📚 重点文法")).toBeInTheDocument();
      });
    });

    it("推奨語彙がガチャ語彙と連携している", async () => {
      render(
        <TestWrapper>
          <EssayWriting />
        </TestWrapper>
      );

      const taskCards = screen.getAllByText("自己紹介文を書こう");
      fireEvent.click(taskCards[0]);

      await waitFor(() => {
        // 推奨語彙にガチャで獲得した語彙が含まれることを確認
        expect(screen.getByText("student")).toBeInTheDocument();
        expect(screen.getByText("work")).toBeInTheDocument();
        expect(screen.getByText("like")).toBeInTheDocument();
      });
    });

    it("英作文入力と文字数カウントが正しく動作する", async () => {
      render(
        <TestWrapper>
          <EssayWriting />
        </TestWrapper>
      );

      const taskCards = screen.getAllByText("自己紹介文を書こう");
      fireEvent.click(taskCards[0]);

      await waitFor(() => {
        const textarea =
          screen.getByPlaceholderText("ここに英作文を入力してください...");
        fireEvent.change(textarea, {
          target: { value: "I am a student. I work hard. I like English." },
        });

        // 文字数カウントが更新されることを確認
        expect(screen.getByText("9語")).toBeInTheDocument(); // 9単語
      });
    });

    it("英作文提出が正しく動作する", async () => {
      render(
        <TestWrapper>
          <EssayWriting />
        </TestWrapper>
      );

      const taskCards = screen.getAllByText("自己紹介文を書こう");
      fireEvent.click(taskCards[0]);

      await waitFor(() => {
        const textarea =
          screen.getByPlaceholderText("ここに英作文を入力してください...");
        fireEvent.change(textarea, {
          target: { value: "I am a student. I work hard." },
        });

        const submitButton = screen.getByText("提出する");
        expect(submitButton).not.toBeDisabled();

        fireEvent.click(submitButton);

        // XP獲得の確認
        expect(mockLevelManager.addXP).toHaveBeenCalledWith(15); // beginner課題のXP
      });
    });

    it("提出後に結果画面が表示される", async () => {
      render(
        <TestWrapper>
          <EssayWriting />
        </TestWrapper>
      );

      const taskCards = screen.getAllByText("自己紹介文を書こう");
      fireEvent.click(taskCards[0]);

      await waitFor(() => {
        const textarea =
          screen.getByPlaceholderText("ここに英作文を入力してください...");
        fireEvent.change(textarea, {
          target: { value: "I am a student." },
        });

        const submitButton = screen.getByText("提出する");
        fireEvent.click(submitButton);
      });

      await waitFor(() => {
        expect(screen.getByText("英作文完了！")).toBeInTheDocument();
        expect(screen.getByText("あなたの英作文")).toBeInTheDocument();
        expect(screen.getByText("獲得XP")).toBeInTheDocument();
        expect(screen.getByText("+15XP")).toBeInTheDocument();
      });
    });

    it("参考解答が提出後に表示される", async () => {
      render(
        <TestWrapper>
          <EssayWriting />
        </TestWrapper>
      );

      const taskCards = screen.getAllByText("自己紹介文を書こう");
      fireEvent.click(taskCards[0]);

      await waitFor(() => {
        const textarea =
          screen.getByPlaceholderText("ここに英作文を入力してください...");
        fireEvent.change(textarea, {
          target: { value: "I am a student." },
        });

        const submitButton = screen.getByText("提出する");
        fireEvent.click(submitButton);
      });

      await waitFor(() => {
        expect(screen.getByText("参考解答例")).toBeInTheDocument();
        expect(screen.getByText("basic")).toBeInTheDocument(); // サンプル解答レベル
      });
    });

    it("文法クイズ復習ボタンが正しく動作する", async () => {
      render(
        <TestWrapper>
          <EssayWriting />
        </TestWrapper>
      );

      const taskCards = screen.getAllByText("自己紹介文を書こう");
      fireEvent.click(taskCards[0]);

      await waitFor(() => {
        const textarea =
          screen.getByPlaceholderText("ここに英作文を入力してください...");
        fireEvent.change(textarea, {
          target: { value: "I am a student." },
        });

        const submitButton = screen.getByText("提出する");
        fireEvent.click(submitButton);
      });

      await waitFor(() => {
        const grammarReviewButton = screen.getByText("文法クイズで復習");
        fireEvent.click(grammarReviewButton);

        expect(mockNavigate).toHaveBeenCalledWith("/learning/grammar/category");
      });
    });
  });

  describe("エラーハンドリング", () => {
    it("ガチャデータ取得エラー時も正常に動作する", () => {
      vi.mocked(gachaSystem.GachaSystem.getUserGachaData).mockImplementation(
        () => {
          throw new Error("ガチャデータ取得エラー");
        }
      );

      render(
        <TestWrapper>
          <EssayWriting />
        </TestWrapper>
      );

      // エラーが発生してもコンポーネントがレンダリングされることを確認
      expect(screen.getByText("英作文")).toBeInTheDocument();
    });

    it("事前学習データ取得エラー時も正常に動作する", () => {
      vi.mocked(dataManager.DataManager.getPreStudyProgress).mockImplementation(
        () => {
          throw new Error("事前学習データ取得エラー");
        }
      );

      render(
        <TestWrapper>
          <EssayWriting />
        </TestWrapper>
      );

      expect(screen.getByText("英作文")).toBeInTheDocument();
    });

    it("空の英作文は提出できない", async () => {
      render(
        <TestWrapper>
          <EssayWriting />
        </TestWrapper>
      );

      const taskCards = screen.getAllByText("自己紹介文を書こう");
      fireEvent.click(taskCards[0]);

      await waitFor(() => {
        const submitButton = screen.getByText("提出する");
        expect(submitButton).toBeDisabled();
      });
    });
  });

  describe("相乗効果テスト", () => {
    it("ガチャ語彙が推奨語彙として表示される", async () => {
      render(
        <TestWrapper>
          <EssayWriting />
        </TestWrapper>
      );

      const taskCards = screen.getAllByText("自己紹介文を書こう");
      fireEvent.click(taskCards[0]);

      await waitFor(() => {
        // ガチャで獲得した語彙がチェックマーク付きで表示されることを確認
        const studentBadge = screen.getByText(/student/);
        expect(studentBadge).toBeInTheDocument();

        const workBadge = screen.getByText(/work/);
        expect(workBadge).toBeInTheDocument();
      });
    });

    it("レベルに応じた課題フィルタリングが機能する", () => {
      // レベル1のユーザー
      mockLevelManager.getLevel.mockReturnValue({ level: 1 });

      render(
        <TestWrapper>
          <EssayWriting />
        </TestWrapper>
      );

      // Level 1の課題のみ表示されることを確認
      expect(screen.getByText("自己紹介文を書こう")).toBeInTheDocument();

      // Level 2以上の課題は表示されないことを確認
      expect(
        screen.queryByText("週末の予定を説明しよう")
      ).not.toBeInTheDocument();
    });

    it("文法カテゴリーと連携した推奨が機能する", () => {
      render(
        <TestWrapper>
          <EssayWriting />
        </TestWrapper>
      );

      // 文法カテゴリー「basic-grammar」に対応する課題が推奨されることを確認
      expect(screen.getByText("あなたにおすすめの英作文")).toBeInTheDocument();
      expect(screen.getByText("自己紹介文を書こう")).toBeInTheDocument();
    });
  });

  describe("データ管理", () => {
    it("英作文提出時にデータが正しく記録される", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      render(
        <TestWrapper>
          <EssayWriting />
        </TestWrapper>
      );

      const taskCards = screen.getAllByText("自己紹介文を書こう");
      fireEvent.click(taskCards[0]);

      await waitFor(() => {
        const textarea =
          screen.getByPlaceholderText("ここに英作文を入力してください...");
        fireEvent.change(textarea, {
          target: { value: "I am a student. I work hard." },
        });

        const submitButton = screen.getByText("提出する");
        fireEvent.click(submitButton);
      });

      // 提出データがログに記録されることを確認
      expect(consoleSpy).toHaveBeenCalledWith(
        "Essay submitted:",
        expect.objectContaining({
          promptId: "basic-grammar-intro",
          text: "I am a student. I work hard.",
          selfAssessment: expect.any(Object),
          analysis: expect.objectContaining({
            wordCount: 6,
            vocabularyUsed: ["student", "work"],
          }),
        })
      );

      consoleSpy.mockRestore();
    });
  });
});
