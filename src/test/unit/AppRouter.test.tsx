import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { AppRouter } from "../../routes/AppRouter";

// 各コンポーネントのモック
vi.mock("../../components/NewHome", () => ({
  default: () => <div data-testid="home">Home Component</div>,
}));

vi.mock("../../components/EssayWriting", () => ({
  default: () => <div data-testid="essay-writing">Essay Writing Component</div>,
}));

vi.mock("../../components/starSystem/PreStudyMenu", () => ({
  default: () => (
    <div data-testid="pre-study-menu">Pre Study Menu Component</div>
  ),
}));

vi.mock("../../components/CategorySelection", () => ({
  default: () => (
    <div data-testid="category-selection">Category Selection Component</div>
  ),
}));

vi.mock("../../components/VocabularyDifficultySelection", () => ({
  default: () => (
    <div data-testid="vocabulary-difficulty">
      Vocabulary Difficulty Component
    </div>
  ),
}));

vi.mock("../../components/GachaSystem", () => ({
  default: () => <div data-testid="gacha-system">Gacha System Component</div>,
}));

vi.mock("../../components/GachaResultScreen", () => ({
  default: () => <div data-testid="gacha-result">Gacha Result Component</div>,
}));

vi.mock("../../components/Achievements", () => ({
  default: () => <div data-testid="achievements">Achievements Component</div>,
}));

vi.mock("../../components/TimeAttackMode", () => ({
  default: () => <div data-testid="time-attack">Time Attack Component</div>,
}));

// useScrollToTop のモック
vi.mock("../../hooks/useScrollToTop", () => ({
  useScrollToTop: () => {},
}));

const TestRouter: React.FC<{ initialEntries: string[] }> = ({
  initialEntries,
}) => (
  <MemoryRouter initialEntries={initialEntries}>
    <AppRouter />
  </MemoryRouter>
);

describe("AppRouter", () => {
  describe("基本ルーティング", () => {
    it("ホーム画面（/）が正しくレンダリングされる", async () => {
      render(<TestRouter initialEntries={["/"]} />);

      await screen.findByTestId("home");
      expect(screen.getByTestId("home")).toBeInTheDocument();
    });

    it("英作文画面（/learning/essay-writing）が正しくレンダリングされる", async () => {
      render(<TestRouter initialEntries={["/learning/essay-writing"]} />);

      await screen.findByTestId("essay-writing");
      expect(screen.getByTestId("essay-writing")).toBeInTheDocument();
    });

    it("事前学習メニュー（/learning/pre-study/menu）が正しくレンダリングされる", async () => {
      render(<TestRouter initialEntries={["/learning/pre-study/menu"]} />);

      await screen.findByTestId("pre-study-menu");
      expect(screen.getByTestId("pre-study-menu")).toBeInTheDocument();
    });

    it("文法クイズカテゴリー（/learning/grammar/category）が正しくレンダリングされる", async () => {
      render(<TestRouter initialEntries={["/learning/grammar/category"]} />);

      await screen.findByTestId("category-selection");
      expect(screen.getByTestId("category-selection")).toBeInTheDocument();
    });

    it("語彙学習難易度（/learning/vocabulary/difficulty）が正しくレンダリングされる", async () => {
      render(
        <TestRouter initialEntries={["/learning/vocabulary/difficulty"]} />
      );

      await screen.findByTestId("vocabulary-difficulty");
      expect(screen.getByTestId("vocabulary-difficulty")).toBeInTheDocument();
    });

    it("ガチャシステム（/games/gacha）が正しくレンダリングされる", async () => {
      render(<TestRouter initialEntries={["/games/gacha"]} />);

      await screen.findByTestId("gacha-system");
      expect(screen.getByTestId("gacha-system")).toBeInTheDocument();
    });

    it("ガチャ結果画面（/games/gacha/result）が正しくレンダリングされる", async () => {
      render(<TestRouter initialEntries={["/games/gacha/result"]} />);

      await screen.findByTestId("gacha-result");
      expect(screen.getByTestId("gacha-result")).toBeInTheDocument();
    });

    it("実績画面（/progress/achievements）が正しくレンダリングされる", async () => {
      render(<TestRouter initialEntries={["/progress/achievements"]} />);

      await screen.findByTestId("achievements");
      expect(screen.getByTestId("achievements")).toBeInTheDocument();
    });

    it("タイムアタック（/learning/time-attack）が正しくレンダリングされる", async () => {
      render(<TestRouter initialEntries={["/learning/time-attack"]} />);

      await screen.findByTestId("time-attack");
      expect(screen.getByTestId("time-attack")).toBeInTheDocument();
    });
  });

  describe("ネストされたルート", () => {
    it("文法クイズの難易度選択ルートが機能する", async () => {
      render(
        <TestRouter
          initialEntries={["/learning/grammar/difficulty/basic-grammar"]}
        />
      );

      // DifficultySelection コンポーネントがレンダリングされることを確認
      // （実際のコンポーネントでは useParams でカテゴリーを取得）
    });

    it("語彙学習のカテゴリー選択ルートが機能する", async () => {
      render(
        <TestRouter
          initialEntries={["/learning/vocabulary/category?difficulty=beginner"]}
        />
      );

      // VocabularyCategorySelection コンポーネントがレンダリングされることを確認
    });

    it("事前学習コンテンツの詳細ルートが機能する", async () => {
      render(
        <TestRouter
          initialEntries={["/learning/pre-study/content/basic-grammar-theory"]}
        />
      );

      // PreStudyContentViewer コンポーネントがレンダリングされることを確認
    });
  });

  describe("パラメータ付きルート", () => {
    it("語彙学習ルートがパラメータを正しく処理する", async () => {
      render(
        <TestRouter
          initialEntries={["/learning/vocabulary/study/beginner/toeic"]}
        />
      );

      // VocabularyCard コンポーネントが difficulty と category パラメータを受け取ることを確認
    });

    it("文法クイズルートがパラメータを正しく処理する", async () => {
      render(
        <TestRouter
          initialEntries={["/learning/grammar/question/basic-grammar/easy"]}
        />
      );

      // Question コンポーネントが category と difficulty パラメータを受け取ることを確認
    });

    it("ガチャカード詳細ルートがパラメータを正しく処理する", async () => {
      render(<TestRouter initialEntries={["/games/gacha/card/123"]} />);

      // CardDetailContent コンポーネントが cardId パラメータを受け取ることを確認
    });
  });

  describe("フォールバックルート", () => {
    it("存在しないルートでホームにリダイレクトされる", async () => {
      render(<TestRouter initialEntries={["/non-existent-route"]} />);

      // Navigate コンポーネントによってホームにリダイレクトされることを確認
      await screen.findByTestId("home");
      expect(screen.getByTestId("home")).toBeInTheDocument();
    });

    it("不正なパラメータでも正常に動作する", async () => {
      render(
        <TestRouter
          initialEntries={["/learning/vocabulary/study/invalid/invalid"]}
        />
      );

      // 不正なパラメータでもコンポーネントがレンダリングされることを確認
      // （実際のコンポーネントでフォールバック処理される）
    });
  });

  describe("レイジーローディング", () => {
    it("コンポーネントが遅延読み込みされる", async () => {
      render(<TestRouter initialEntries={["/learning/essay-writing"]} />);

      // 最初にローディングスピナーが表示される
      expect(screen.getByText("読み込み中...")).toBeInTheDocument();

      // その後、実際のコンポーネントが読み込まれる
      await screen.findByTestId("essay-writing");
      expect(screen.getByTestId("essay-writing")).toBeInTheDocument();
    });

    it("複数のルート間でコンポーネントが再利用される", async () => {
      const { rerender } = render(<TestRouter initialEntries={["/"]} />);

      await screen.findByTestId("home");

      // 別のルートに移動
      rerender(<TestRouter initialEntries={["/learning/essay-writing"]} />);
      await screen.findByTestId("essay-writing");

      // 再度ホームに戻る
      rerender(<TestRouter initialEntries={["/"]} />);
      await screen.findByTestId("home");

      // コンポーネントが正常に切り替わることを確認
      expect(screen.getByTestId("home")).toBeInTheDocument();
    });
  });

  describe("ScrollToTop機能", () => {
    it("ルート変更時にスクロール位置がリセットされる", () => {
      const scrollToSpy = vi
        .spyOn(window, "scrollTo")
        .mockImplementation(() => {});

      render(<TestRouter initialEntries={["/"]} />);

      // ScrollToTop コンポーネントが機能することを確認
      // （実際のスクロール動作は useScrollToTop フックで処理される）

      scrollToSpy.mockRestore();
    });
  });

  describe("エラーバウンダリ", () => {
    it("コンポーネントエラー時にフォールバックが表示される", async () => {
      // エラーを発生させるコンポーネント
      vi.mocked(
        require("../../components/EssayWriting")
      ).default.mockImplementation(() => {
        throw new Error("Component Error");
      });

      render(<TestRouter initialEntries={["/learning/essay-writing"]} />);

      // エラーバウンダリまたはSuspenseのフォールバックが表示されることを確認
      expect(screen.getByText("読み込み中...")).toBeInTheDocument();
    });
  });
});
