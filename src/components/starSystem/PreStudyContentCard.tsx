import React from "react";
import { PreStudyContent } from "../../types/starSystem";
import { SelectionCard } from "../ui/selection-card";

interface PreStudyContentCardProps {
  content: PreStudyContent;
  isLocked?: boolean;
  isCompleted?: boolean;
  onSelect: (contentId: string) => void;
}

export const PreStudyContentCard: React.FC<PreStudyContentCardProps> = ({
  content,
  isLocked = false,
  isCompleted = false,
  onSelect,
}) => {
  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case "theory":
        return "💡";
      case "explanation":
        return "📚";
      case "background":
        return "🔬";
      case "strategy":
        return "🎯";
      default:
        return "📖";
    }
  };

  return (
    <SelectionCard
      id={content.id}
      title={content.title}
      description={`⭐️ ${content.category}`}
      detail={`理論学習 - ${content.contentType}`}
      icon={getContentTypeIcon(content.contentType)}
      difficulty={content.difficulty}
      level={content.level}
      duration={`${Math.ceil(content.duration / 60)}分`}
      category={content.category}
      keyPoints={content.keyPoints}
      isLocked={isLocked}
      isCompleted={isCompleted}
      onClick={() => onSelect(content.id)}
    />
  );
};
