import React from "react";
import { RANK_STYLES } from "../data/levelConfig";
import { QuestionRank, QuestionWithRank } from "../types";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";

interface QuestionRankDisplayProps {
  rank: QuestionRank;
  showIcon?: boolean;
  showName?: boolean;
  showXP?: boolean;
  question?: QuestionWithRank;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const QuestionRankDisplay: React.FC<QuestionRankDisplayProps> = ({
  rank,
  showIcon = true,
  showName = true,
  showXP = false,
  question,
  size = "md",
  className = "",
}) => {
  const styles = RANK_STYLES[rank];

  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1.5",
    lg: "text-base px-4 py-2",
  };

  const iconSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <div
      className={`inline-flex items-center space-x-1 ${styles.bgColor} ${styles.color} rounded-full ${sizeClasses[size]} ${className}`}
    >
      {showIcon && <span className={iconSizes[size]}>{styles.icon}</span>}
      {showName && <span className="font-medium">{styles.name}</span>}
      {showXP && question && (
        <span className="text-xs opacity-75">+{question.xpReward}XP</span>
      )}
    </div>
  );
};

interface QuestionCardProps {
  question: QuestionWithRank;
  onAnswer?: (answer: string) => void;
  selectedAnswer?: string;
  showExplanation?: boolean;
  disabled?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onAnswer,
  selectedAnswer,
  showExplanation = false,
  disabled = false,
}) => {
  const handleAnswer = (answer: string) => {
    if (!disabled && onAnswer) {
      onAnswer(answer);
    }
  };

  const isCorrect = selectedAnswer === question.correctAnswer;
  const showResult = selectedAnswer !== undefined;

  return (
    <Card className="shadow-md border-l-4 border-l-blue-500">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <QuestionRankDisplay
            rank={question.rank}
            showXP={true}
            question={question}
            size="sm"
          />
          <Badge variant="outline" className="text-xs">
            {question.difficulty === "easy" && "簡単"}
            {question.difficulty === "normal" && "普通"}
            {question.difficulty === "hard" && "難しい"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* 問題文 */}
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            {question.question}
          </h3>
          {showExplanation && (
            <p className="text-sm text-gray-600">
              カテゴリー: {question.category} | スキル: {question.skillField}
            </p>
          )}
        </div>

        {/* 選択肢 */}
        <div className="space-y-2">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrectAnswer = option === question.correctAnswer;

            let variant: "default" | "outline" | "destructive" | "secondary" =
              "outline";
            let className = "w-full text-left justify-start h-auto p-4";

            if (showResult) {
              if (isCorrectAnswer) {
                variant = "default";
                className +=
                  " bg-green-100 border-green-300 text-green-800 hover:bg-green-200";
              } else if (isSelected && !isCorrectAnswer) {
                variant = "destructive";
                className +=
                  " bg-red-100 border-red-300 text-red-800 hover:bg-red-200";
              } else {
                variant = "outline";
                className += " bg-gray-50 border-gray-200 text-gray-600";
              }
            } else {
              if (isSelected) {
                variant = "default";
                className += " bg-blue-100 border-blue-300 text-blue-800";
              } else {
                variant = "outline";
                className += " hover:bg-gray-50";
              }
            }

            return (
              <Button
                key={index}
                onClick={() => handleAnswer(option)}
                variant={variant}
                className={className}
                disabled={disabled}
              >
                <div className="flex items-center justify-between w-full">
                  <span>{option}</span>
                  {showResult && isCorrectAnswer && (
                    <span className="text-green-600">✓</span>
                  )}
                  {showResult && isSelected && !isCorrectAnswer && (
                    <span className="text-red-600">✗</span>
                  )}
                </div>
              </Button>
            );
          })}
        </div>

        {/* 解説 */}
        {showExplanation && showResult && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2">解説</h4>
              <p className="text-sm text-blue-700">{question.explanation}</p>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

interface RankProgressProps {
  currentLevel: number;
  showProbabilities?: boolean;
}

export const RankProgress: React.FC<RankProgressProps> = ({
  currentLevel,
  showProbabilities = true,
}) => {
  const getRankProbabilities = (level: number) => {
    if (level <= 20) {
      return { normal: 80, rare: 18, epic: 2, legendary: 0 };
    } else if (level <= 40) {
      return { normal: 60, rare: 30, epic: 9, legendary: 1 };
    } else if (level <= 60) {
      return { normal: 40, rare: 35, epic: 20, legendary: 5 };
    } else if (level <= 80) {
      return { normal: 25, rare: 35, epic: 30, legendary: 10 };
    } else {
      return { normal: 15, rare: 30, epic: 35, legendary: 20 };
    }
  };

  const probabilities = getRankProbabilities(currentLevel);
  const ranks: QuestionRank[] = ["normal", "rare", "epic", "legendary"];

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        問題ランク出現率 (Level {currentLevel})
      </h3>

      <div className="space-y-3">
        {ranks.map((rank) => {
          const styles = RANK_STYLES[rank];
          const probability = probabilities[rank];

          return (
            <div key={rank} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{styles.icon}</span>
                <span className="text-sm font-medium text-gray-700">
                  {styles.name}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${styles.bgColor
                      .replace("bg-", "bg-")
                      .replace("-100", "-500")}`}
                    style={{ width: `${probability}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-600 w-8 text-right">
                  {probability}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {showProbabilities && (
        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            <p>• レベルが上がるほど高ランクの問題が出現しやすくなります</p>
            <p>• レジェンド問題はLevel 21以降から出現します</p>
          </div>
        </div>
      )}
    </div>
  );
};
