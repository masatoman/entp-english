import {
  Filter,
  Grid3X3,
  LayoutGrid,
  List,
  Search,
  SortAsc,
  SortDesc,
} from "lucide-react";
import { useState } from "react";
import { cn } from "../../lib/utils";
import { WordCard } from "../../types/gacha";
import { CardCollectionManager } from "../../utils/cardCollectionManager";
import { Badge } from "./badge";
import { Button } from "./button";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { GachaCard } from "./gacha-card";
import { Input } from "./input";

interface CardCollectionGridProps {
  cards: WordCard[];
  onCardClick?: (card: WordCard) => void;
  title?: string;
  showFilters?: boolean;
  showSearch?: boolean;
  className?: string;
}

type SortOption = "name" | "rarity" | "recent";
type ViewMode = "grid" | "list";
type GridColumns = "2" | "3";
type RarityFilter =
  | "all"
  | "common"
  | "uncommon"
  | "rare"
  | "epic"
  | "legendary";

export function CardCollectionGrid({
  cards,
  onCardClick,
  title = "カードコレクション",
  showFilters = true,
  showSearch = true,
  className,
}: CardCollectionGridProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [rarityFilter, setRarityFilter] = useState<RarityFilter>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [gridColumns, setGridColumns] = useState<GridColumns>("2");

  // 重複カードを統合して所持枚数付きに変換
  const cardsWithCount = CardCollectionManager.consolidateCards(cards);

  // レアリティの順序定義
  const rarityOrder = {
    common: 1,
    uncommon: 2,
    rare: 3,
    epic: 4,
    legendary: 5,
  };

  // カードのフィルタリングとソート（重複排除済み）
  const filteredAndSortedCards = cardsWithCount
    .filter((cardWithCount) => {
      // 検索フィルター
      const matchesSearch =
        cardWithCount.card.word
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        cardWithCount.card.meaning
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      // レアリティフィルター
      const matchesRarity =
        rarityFilter === "all" || cardWithCount.card.rarity === rarityFilter;

      return matchesSearch && matchesRarity;
    })
    .sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "name":
          comparison = a.card.word.localeCompare(b.card.word);
          break;
        case "rarity":
          comparison = rarityOrder[a.card.rarity] - rarityOrder[b.card.rarity];
          break;
        case "recent":
          comparison = a.card.id - b.card.id; // IDが新しいほど最近
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

  // レアリティ統計
  const rarityStats = cards.reduce((acc, card) => {
    acc[card.rarity] = (acc[card.rarity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const rarityLabels = {
    common: "コモン",
    uncommon: "アンコモン",
    rare: "レア",
    epic: "エピック",
    legendary: "レジェンダリー",
  };

  const rarityColors = {
    common: "bg-gray-100 text-gray-700 border-gray-300",
    uncommon: "bg-green-100 text-green-700 border-green-300",
    rare: "bg-blue-100 text-blue-700 border-blue-300",
    epic: "bg-purple-100 text-purple-700 border-purple-300",
    legendary: "bg-yellow-100 text-yellow-700 border-yellow-300",
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* ヘッダー */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="text-gray-600">
            {filteredAndSortedCards.length} / {cards.length} カード
          </p>
        </div>

        {/* ビューモード切り替え */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 border rounded-md p-1">
            <Button
              variant={
                viewMode === "grid" && gridColumns === "2" ? "default" : "ghost"
              }
              size="sm"
              onClick={() => {
                setViewMode("grid");
                setGridColumns("2");
              }}
              className="h-8 w-8 p-1"
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button
              variant={
                viewMode === "grid" && gridColumns === "3" ? "default" : "ghost"
              }
              size="sm"
              onClick={() => {
                setViewMode("grid");
                setGridColumns("3");
              }}
              className="h-8 w-8 p-1"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="h-8 w-8 p-1"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* フィルターとソート */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="w-5 h-5" />
              フィルター・ソート
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 検索 */}
            {showSearch && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="カード名や意味で検索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            )}

            {/* フィルターとソート */}
            <div className="flex flex-wrap gap-4">
              {/* レアリティフィルター */}
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={rarityFilter === "all" ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setRarityFilter("all")}
                >
                  全て ({cards.length})
                </Badge>
                {Object.entries(rarityStats).map(([rarity, count]) => (
                  <Badge
                    key={rarity}
                    variant={rarityFilter === rarity ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer",
                      rarityFilter === rarity
                        ? ""
                        : rarityColors[rarity as keyof typeof rarityColors]
                    )}
                    onClick={() => setRarityFilter(rarity as RarityFilter)}
                  >
                    {rarityLabels[rarity as keyof typeof rarityLabels]} ({count}
                    )
                  </Badge>
                ))}
              </div>

              {/* ソート */}
              <div className="flex items-center gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                >
                  <option value="name">名前順</option>
                  <option value="rarity">レアリティ順</option>
                  <option value="recent">取得順</option>
                </select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                >
                  {sortOrder === "asc" ? (
                    <SortAsc className="w-4 h-4" />
                  ) : (
                    <SortDesc className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* カードグリッド */}
      {filteredAndSortedCards.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-500">該当するカードが見つかりませんでした</p>
        </Card>
      ) : (
        <div
          className={cn(
            "grid gap-2",
            viewMode === "grid"
              ? gridColumns === "2"
                ? "grid-cols-2"
                : "grid-cols-3"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          )}
        >
          {filteredAndSortedCards.map((cardWithCount, index) => (
            <GachaCard
              key={`${cardWithCount.card.id}-${index}`}
              card={cardWithCount.card}
              count={cardWithCount.count}
              onClick={() => onCardClick?.(cardWithCount.card)}
              size={
                viewMode === "grid" ? (gridColumns === "3" ? "sm" : "md") : "md"
              }
              showDetails={viewMode === "list"}
              isAnimated={true}
              isFavorite={false}
              onFavoriteToggle={undefined}
              className="hover:z-10"
            />
          ))}
        </div>
      )}
    </div>
  );
}
