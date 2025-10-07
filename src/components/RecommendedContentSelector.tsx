import { ArrowRight, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { 
  contentTagManager, 
  TaggedContent, 
  ContentTag 
} from "../utils/contentTagManager";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

interface RecommendedContentSelectorProps {
  currentContentId: string;
  onContentSelect?: (content: TaggedContent) => void;
  maxRecommendations?: number;
  showTags?: boolean;
}

export default function RecommendedContentSelector({
  currentContentId,
  onContentSelect,
  maxRecommendations = 6,
  showTags = true
}: RecommendedContentSelectorProps) {
  const navigate = useNavigate();
  
  const recommendedContent = contentTagManager
    .getRecommendedPracticeContent(currentContentId)
    .slice(0, maxRecommendations);

  const handleContentSelect = (content: TaggedContent) => {
    if (onContentSelect) {
      onContentSelect(content);
    } else {
      // デフォルトの遷移処理
      navigate(content.url);
    }
  };

  const getContentTypeIcon = (contentType: string): string => {
    switch (contentType) {
      case 'grammar-quiz': return '📝';
      case 'vocabulary': return '📚';
      case 'writing': return '✍️';
      case 'listening': return '👂';
      default: return '📖';
    }
  };

  const getContentTypeLabel = (contentType: string): string => {
    switch (contentType) {
      case 'grammar-quiz': return '文法クイズ';
      case 'vocabulary': return '語彙学習';
      case 'writing': return '英作文';
      case 'listening': return 'リスニング';
      default: return '学習コンテンツ';
    }
  };

  const renderTagBadge = (tag: ContentTag) => (
    <Badge
      key={tag.id}
      variant="outline"
      className={`text-xs ${tag.color}`}
    >
      {tag.icon} {tag.name}
    </Badge>
  );

  if (recommendedContent.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>推奨コンテンツ</CardTitle>
          <CardDescription>
            現在、関連する実践コンテンツが見つかりませんでした。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => navigate('/learning/grammar/category')}
            className="w-full"
          >
            文法クイズ一覧へ
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ArrowRight className="w-5 h-5 mr-2 text-blue-600" />
          推奨する次の学習
        </CardTitle>
        <CardDescription>
          この事前学習に関連した実践コンテンツで理解を深めましょう！
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendedContent.map((content) => {
          const contentTags = contentTagManager.getContentTags(content.contentId);
          
          return (
            <div
              key={content.contentId}
              className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer bg-white"
              onClick={() => handleContentSelect(content)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">
                    {getContentTypeIcon(content.contentType)}
                  </span>
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {content.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {getContentTypeLabel(content.contentType)}
                    </p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </div>
              
              <p className="text-sm text-gray-600 mb-3">
                {content.description}
              </p>
              
              {showTags && contentTags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {contentTags.slice(0, 4).map(renderTagBadge)}
                  {contentTags.length > 4 && (
                    <Badge variant="outline" className="text-xs text-gray-500">
                      +{contentTags.length - 4}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          );
        })}
        
        {/* 学習パス全体を見るボタン */}
        <div className="pt-4 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={() => navigate('/learning/synergy')}
            className="w-full"
          >
            <ArrowRight className="w-4 h-4 mr-2" />
            学習パス全体を見る
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * タグ表示用コンポーネント
 */
export function ContentTagDisplay({ 
  contentId, 
  maxTags = 3 
}: { 
  contentId: string; 
  maxTags?: number; 
}) {
  const tags = contentTagManager.getContentTags(contentId);
  
  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1">
      {tags.slice(0, maxTags).map(tag => (
        <Badge
          key={tag.id}
          variant="outline"
          className={`text-xs ${tag.color}`}
        >
          {tag.icon} {tag.name}
        </Badge>
      ))}
      {tags.length > maxTags && (
        <Badge variant="outline" className="text-xs text-gray-500">
          +{tags.length - maxTags}
        </Badge>
      )}
    </div>
  );
}

/**
 * 学習パス表示用コンポーネント
 */
export function LearningPathDisplay({ 
  startingTags 
}: { 
  startingTags: string[]; 
}) {
  const navigate = useNavigate();
  const learningPath = contentTagManager.getRecommendedLearningPath(startingTags);

  return (
    <Card>
      <CardHeader>
        <CardTitle>推奨学習パス</CardTitle>
        <CardDescription>
          効率的な学習順序で理解を深めましょう
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {learningPath.map((content, index) => (
            <div
              key={content.contentId}
              className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => navigate(content.url)}
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-semibold text-blue-600">
                {index + 1}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-800">{content.title}</h4>
                <p className="text-sm text-gray-600">
                  {getContentTypeLabel(content.contentType)}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function getContentTypeLabel(contentType: string): string {
  switch (contentType) {
    case 'pre-study': return '事前学習';
    case 'grammar-quiz': return '文法クイズ';
    case 'vocabulary': return '語彙学習';
    case 'writing': return '英作文';
    case 'listening': return 'リスニング';
    default: return '学習コンテンツ';
  }
}
