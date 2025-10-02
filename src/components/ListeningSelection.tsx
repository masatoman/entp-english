import {
  BookOpen,
  Clock,
  Headphones,
  Play,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { SelectionCard } from "./ui/selection-card";

interface ListeningOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  difficulty: "beginner" | "intermediate" | "advanced";
  part?: "part1" | "part2" | "part3" | "part4";
  questionCount: number;
  estimatedTime: string;
  features: string[];
  color: string;
}

const listeningOptions: ListeningOption[] = [
  {
    id: "part1-photos",
    title: "Part 1: 写真描写",
    description: "写真を見て適切な説明を聞き取る問題",
    icon: <Play className="w-6 h-6" />,
    difficulty: "beginner",
    part: "part1",
    questionCount: 10,
    estimatedTime: "5分",
    features: ["基礎的な聞き取り", "視覚的ヒント", "短い音声"],
    color: "blue",
  },
  {
    id: "part2-responses",
    title: "Part 2: 応答問題",
    description: "質問に対して適切な応答を選ぶ問題",
    icon: <BookOpen className="w-6 h-6" />,
    difficulty: "beginner",
    part: "part2",
    questionCount: 15,
    estimatedTime: "8分",
    features: ["質問と応答", "日常会話", "ビジネス表現"],
    color: "green",
  },
  {
    id: "part3-conversations",
    title: "Part 3: 会話問題",
    description: "2人または3人の会話を聞いて質問に答える",
    icon: <Users className="w-6 h-6" />,
    difficulty: "intermediate",
    part: "part3",
    questionCount: 12,
    estimatedTime: "12分",
    features: ["長い会話", "詳細な情報", "推論問題"],
    color: "purple",
  },
  {
    id: "part4-talks",
    title: "Part 4: 説明文問題",
    description: "アナウンスや説明文を聞いて質問に答える",
    icon: <TrendingUp className="w-6 h-6" />,
    difficulty: "advanced",
    part: "part4",
    questionCount: 10,
    estimatedTime: "10分",
    features: ["長文リスニング", "専門用語", "複雑な内容"],
    color: "orange",
  },
  {
    id: "beginner-mixed",
    title: "初級総合",
    description: "初級レベルのリスニング問題をランダムに",
    icon: <Target className="w-6 h-6" />,
    difficulty: "beginner",
    questionCount: 15,
    estimatedTime: "10分",
    features: ["基礎固め", "バランス学習", "段階的向上"],
    color: "teal",
  },
  {
    id: "intermediate-mixed",
    title: "中級総合",
    description: "中級レベルのリスニング問題をランダムに",
    icon: <Clock className="w-6 h-6" />,
    difficulty: "intermediate",
    questionCount: 20,
    estimatedTime: "15分",
    features: ["実践的練習", "多様なトピック", "スキル向上"],
    color: "indigo",
  },
  {
    id: "advanced-mixed",
    title: "上級総合",
    description: "上級レベルのリスニング問題をランダムに",
    icon: <Headphones className="w-6 h-6" />,
    difficulty: "advanced",
    questionCount: 25,
    estimatedTime: "20分",
    features: ["高度な内容", "専門分野", "実力測定"],
    color: "red",
  },
];

export default function ListeningSelection() {
  const navigate = useNavigate();

  const handleOptionSelect = (option: ListeningOption) => {
    if (option.part) {
      navigate(`/listening/learn/${option.difficulty}/${option.part}`);
    } else {
      navigate(`/listening/learn/${option.difficulty}`);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800 border-green-200";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "advanced":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "初級";
      case "intermediate":
        return "中級";
      case "advanced":
        return "上級";
      default:
        return difficulty;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* ヘッダー */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Headphones className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">リスニング学習</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          TOEIC形式のリスニング問題で実践的な聞き取りスキルを向上させましょう。
          音声を聞いて問題に答えることで、本格的な英語リスニング力を身につけます。
        </p>
      </div>

      {/* 学習オプション */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listeningOptions.map((option) => (
          <SelectionCard
            key={option.id}
            title={option.title}
            description={option.description}
            icon={option.icon}
            onClick={() => handleOptionSelect(option)}
            className="h-full"
          >
            <div className="space-y-4">
              {/* 難易度と情報 */}
              <div className="flex items-center justify-between">
                <Badge className={getDifficultyColor(option.difficulty)}>
                  {getDifficultyText(option.difficulty)}
                </Badge>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  {option.estimatedTime}
                </div>
              </div>

              {/* 問題数 */}
              <div className="flex items-center gap-2 text-sm">
                <Target className="w-4 h-4 text-muted-foreground" />
                <span>{option.questionCount}問</span>
              </div>

              {/* 特徴 */}
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">特徴:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {option.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* 学習開始ボタン */}
              <div className="pt-2">
                <button className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium">
                  学習開始
                </button>
              </div>
            </div>
          </SelectionCard>
        ))}
      </div>

      {/* 学習のヒント */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            リスニング学習のコツ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-green-700">
                基本的なアプローチ
              </h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• 音声を複数回聞いて理解を深める</li>
                <li>• スクリプトを確認して聞き取れなかった部分を把握</li>
                <li>• 重要な語彙や表現をメモに取る</li>
                <li>• 定期的に復習して定着させる</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-blue-700">上達のポイント</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• 英語の音の変化（リエゾン）に慣れる</li>
                <li>• 文脈から意味を推測する力を養う</li>
                <li>• 異なるアクセントや話し方に慣れる</li>
                <li>• 集中力を維持する練習をする</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
