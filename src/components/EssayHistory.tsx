import {
  ArrowLeft,
  Calendar,
  Download,
  Eye,
  FileText,
  Heart,
  PenTool,
  Search,
  Share2,
  Star,
  Tag,
  Target,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useScrollToTop } from "../hooks/useScrollToTop";
import { EssayHistoryEntry, EssayHistoryManager } from "../utils/essayHistoryManager";
import { EssayShareManager, ShareOptions } from "../utils/essayShareManager";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

export default function EssayHistory() {
  const navigate = useNavigate();
  useScrollToTop();

  const [history, setHistory] = useState<EssayHistoryEntry[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<EssayHistoryEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedEntry, setSelectedEntry] = useState<EssayHistoryEntry | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [stats, setStats] = useState<any>(null);

  // 履歴データ読み込み
  useEffect(() => {
    const loadHistory = () => {
      const historyData = EssayHistoryManager.getHistory();
      const statsData = EssayHistoryManager.getStats();
      setHistory(historyData);
      setFilteredHistory(historyData);
      setStats(statsData);
    };

    loadHistory();
  }, []);

  // 検索・フィルタリング
  useEffect(() => {
    let filtered = history;

    // 検索クエリでフィルタリング
    if (searchQuery.trim()) {
      filtered = EssayHistoryManager.searchHistory(searchQuery.trim());
    }

    // カテゴリでフィルタリング
    if (selectedCategory !== "all") {
      filtered = filtered.filter(entry => entry.prompt.category === selectedCategory);
    }

    setFilteredHistory(filtered);
  }, [history, searchQuery, selectedCategory]);

  // お気に入りトグル
  const handleToggleFavorite = (id: string) => {
    const newState = EssayHistoryManager.toggleFavorite(id);
    setHistory(EssayHistoryManager.getHistory());
    console.log(`⭐ お気に入り${newState ? '追加' : '削除'}: ${id}`);
  };

  // 削除
  const handleDelete = (id: string) => {
    if (confirm("この英作文を削除しますか？")) {
      EssayHistoryManager.deleteEssay(id);
      setHistory(EssayHistoryManager.getHistory());
      setStats(EssayHistoryManager.getStats());
      console.log(`🗑️ 英作文削除: ${id}`);
    }
  };

  // シェア
  const handleShare = (entry: EssayHistoryEntry) => {
    setSelectedEntry(entry);
    setShowShareModal(true);
  };

  // シェア実行
  const handleShareExecute = async (options: ShareOptions) => {
    if (!selectedEntry) return;

    const success = await EssayShareManager.shareEssay(selectedEntry, options);
    if (success) {
      setShowShareModal(false);
      setSelectedEntry(null);
      // 履歴を更新（シェア回数反映）
      setHistory(EssayHistoryManager.getHistory());
      alert("シェアしました！");
    } else {
      alert("シェアに失敗しました。");
    }
  };

  // 詳細表示
  const handleViewDetail = (entry: EssayHistoryEntry) => {
    setSelectedEntry(entry);
  };

  // カテゴリ一覧取得
  const categories = ["all", ...Object.keys(stats?.byCategory || {})];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            onClick={() => navigate("/learning/essay-writing")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            英作文に戻る
          </Button>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">📝 英作文履歴</h1>
            <p className="text-gray-600 mt-1">あなたの英作文の成長記録</p>
          </div>
          <div className="w-32"></div>
        </div>

        {/* 統計サマリー */}
        {stats && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                学習統計
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">{stats.totalEssays}</div>
                  <div className="text-sm text-gray-600">総作文数</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.totalWords}</div>
                  <div className="text-sm text-gray-600">総単語数</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.averageWordCount}</div>
                  <div className="text-sm text-gray-600">平均単語数</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{stats.favoriteCount}</div>
                  <div className="text-sm text-gray-600">お気に入り</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{stats.shareCount}</div>
                  <div className="text-sm text-gray-600">シェア回数</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 検索・フィルター */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="英作文を検索..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="md:w-48">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md bg-white"
                >
                  <option value="all">全カテゴリ</option>
                  {categories.filter(cat => cat !== "all").map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 履歴一覧 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredHistory.map((entry) => (
            <Card key={entry.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">
                      {entry.prompt.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {entry.prompt.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {entry.prompt.difficulty}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleFavorite(entry.id)}
                    className={`${
                      entry.isFavorite ? 'text-yellow-500' : 'text-gray-400'
                    }`}
                  >
                    <Star className={`w-4 h-4 ${entry.isFavorite ? 'fill-current' : ''}`} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* 英作文プレビュー */}
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-700 line-clamp-3">
                      "{entry.submission.text}"
                    </p>
                  </div>

                  {/* メタ情報 */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(entry.createdAt).toLocaleDateString('ja-JP')}
                    </div>
                    <div className="flex items-center gap-1">
                      <PenTool className="w-3 h-3" />
                      {entry.wordCount}語
                    </div>
                  </div>

                  {/* タグ */}
                  {entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {entry.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {entry.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{entry.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* アクションボタン */}
                  <div className="flex items-center gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetail(entry)}
                      className="flex-1"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      詳細
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShare(entry)}
                      className="flex-1"
                    >
                      <Share2 className="w-3 h-3 mr-1" />
                      シェア
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(entry.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>

                  {/* シェア回数表示 */}
                  {entry.shareCount > 0 && (
                    <div className="text-xs text-center text-gray-500">
                      📤 {entry.shareCount}回シェア済み
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 履歴が空の場合 */}
        {filteredHistory.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-gray-500 mb-4">
                <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">
                  {searchQuery || selectedCategory !== "all" 
                    ? "該当する英作文が見つかりません"
                    : "まだ英作文がありません"
                  }
                </h3>
                <p className="text-sm">
                  {searchQuery || selectedCategory !== "all"
                    ? "検索条件を変更してみてください"
                    : "英作文を書いて学習記録を作成しましょう！"
                  }
                </p>
              </div>
              {!searchQuery && selectedCategory === "all" && (
                <Button onClick={() => navigate("/learning/essay-writing")}>
                  英作文を始める
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* 詳細モーダル */}
        {selectedEntry && !showShareModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{selectedEntry.prompt.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">{selectedEntry.prompt.category}</Badge>
                      <Badge variant="outline">{selectedEntry.prompt.difficulty}</Badge>
                      <Badge variant="outline">Level {selectedEntry.prompt.level}</Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedEntry(null)}
                    className="text-gray-500"
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 課題内容 */}
                <div>
                  <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    課題内容
                  </h3>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-gray-700">{selectedEntry.prompt.instruction}</p>
                    {selectedEntry.prompt.context && (
                      <p className="text-sm text-gray-600 mt-2">
                        💡 {selectedEntry.prompt.context}
                      </p>
                    )}
                  </div>
                </div>

                {/* 英作文本文 */}
                <div>
                  <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                    <PenTool className="w-5 h-5 text-green-600" />
                    あなたの英作文
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <Textarea
                      value={selectedEntry.submission.text}
                      readOnly
                      className="min-h-[200px] bg-white"
                    />
                  </div>
                </div>

                {/* 評価情報 */}
                {selectedEntry.submission.evaluation && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-600" />
                      評価
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-white rounded-lg">
                        <div className="text-lg font-bold text-blue-600">
                          {selectedEntry.submission.evaluation.grammar}/100
                        </div>
                        <div className="text-sm text-gray-600">文法</div>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg">
                        <div className="text-lg font-bold text-green-600">
                          {selectedEntry.submission.evaluation.vocabulary}/100
                        </div>
                        <div className="text-sm text-gray-600">語彙</div>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg">
                        <div className="text-lg font-bold text-purple-600">
                          {selectedEntry.submission.evaluation.fluency}/100
                        </div>
                        <div className="text-sm text-gray-600">流暢性</div>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg">
                        <div className="text-lg font-bold text-orange-600">
                          {selectedEntry.submission.evaluation.creativity}/100
                        </div>
                        <div className="text-sm text-gray-600">創造性</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* メタ情報 */}
                <div>
                  <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-gray-600" />
                    詳細情報
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">作成日時:</span>
                      <span>{new Date(selectedEntry.createdAt).toLocaleString('ja-JP')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">最終更新:</span>
                      <span>{new Date(selectedEntry.updatedAt).toLocaleString('ja-JP')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">単語数:</span>
                      <span>{selectedEntry.wordCount}語</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">シェア回数:</span>
                      <span>{selectedEntry.shareCount}回</span>
                    </div>
                  </div>
                </div>

                {/* アクションボタン */}
                <div className="flex gap-3">
                  <Button
                    onClick={() => handleShare(selectedEntry)}
                    className="flex-1"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    シェアする
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleToggleFavorite(selectedEntry.id)}
                    className={selectedEntry.isFavorite ? 'text-yellow-600' : ''}
                  >
                    <Star className={`w-4 h-4 ${selectedEntry.isFavorite ? 'fill-current' : ''}`} />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleDelete(selectedEntry.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* シェアモーダル */}
        {showShareModal && selectedEntry && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-blue-600" />
                    英作文をシェア
                  </CardTitle>
                  <Button
                    variant="ghost"
                    onClick={() => setShowShareModal(false)}
                    className="text-gray-500"
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* シェアプラットフォーム選択 */}
                <div>
                  <h4 className="font-medium mb-3">シェア先を選択</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <Button
                      variant="outline"
                      onClick={() => handleShareExecute({
                        platform: 'twitter',
                        includePrompt: true,
                        includeStats: true,
                      })}
                      className="flex items-center gap-2"
                    >
                      🐦 Twitter
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleShareExecute({
                        platform: 'facebook',
                        includePrompt: true,
                        includeStats: true,
                      })}
                      className="flex items-center gap-2"
                    >
                      📘 Facebook
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleShareExecute({
                        platform: 'linkedin',
                        includePrompt: true,
                        includeStats: true,
                      })}
                      className="flex items-center gap-2"
                    >
                      💼 LinkedIn
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleShareExecute({
                        platform: 'copy',
                        includePrompt: true,
                        includeStats: true,
                      })}
                      className="flex items-center gap-2"
                    >
                      📋 コピー
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleShareExecute({
                        platform: 'image',
                        includePrompt: true,
                        includeStats: true,
                      })}
                      className="flex items-center gap-2"
                    >
                      <Download className="w-3 h-3" />
                      画像保存
                    </Button>
                    {EssayShareManager.supportsWebShare() && (
                      <Button
                        variant="outline"
                        onClick={async () => {
                          const success = await EssayShareManager.nativeShare(selectedEntry);
                          if (success) {
                            setShowShareModal(false);
                            setHistory(EssayHistoryManager.getHistory());
                          }
                        }}
                        className="flex items-center gap-2"
                      >
                        📱 ネイティブ
                      </Button>
                    )}
                  </div>
                </div>

                {/* プレビュー */}
                <div>
                  <h4 className="font-medium mb-3">シェア内容プレビュー</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                      {EssayShareManager.generateShareContent(selectedEntry, {
                        platform: 'copy',
                        includePrompt: true,
                        includeStats: true,
                      }).text}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
