import {
  ArrowLeft,
  BookOpen,
  Clock,
  Eye,
  Headphones,
  Target,
} from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TOEICTestConfig } from "../types/mockTest";
import { PreStudyTOEICIntegrationManager } from "../utils/preStudyTOEICIntegration";
import TOEICPreStudyIntegrationDisplay from "./TOEICPreStudyIntegrationDisplay";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

interface TOEICMockTestConfigProps {
  onStartTest?: (config: TOEICTestConfig) => void;
}

export const TOEICMockTestConfig: React.FC<TOEICMockTestConfigProps> = ({
  onStartTest,
}) => {
  const navigate = useNavigate();
  const [testType, setTestType] = useState<"listening" | "reading" | "full">(
    "full"
  );
  const [selectedParts, setSelectedParts] = useState<number[]>([
    1, 2, 3, 4, 5, 6, 7,
  ]);
  const [difficulty, setDifficulty] = useState<
    "easy" | "medium" | "hard" | "mixed"
  >("mixed");
  const [timeLimit, setTimeLimit] = useState<number>(120); // 2時間
  const [preStudyBoosts, setPreStudyBoosts] = useState<any>(null);

  const partDescriptions = {
    1: {
      name: "Part 1",
      description: "写真描写問題",
      type: "listening",
      questions: 6,
    },
    2: {
      name: "Part 2",
      description: "応答問題",
      type: "listening",
      questions: 25,
    },
    3: {
      name: "Part 3",
      description: "会話問題",
      type: "listening",
      questions: 39,
    },
    4: {
      name: "Part 4",
      description: "説明文問題",
      type: "listening",
      questions: 30,
    },
    5: {
      name: "Part 5",
      description: "短文穴埋め問題",
      type: "reading",
      questions: 30,
    },
    6: {
      name: "Part 6",
      description: "長文穴埋め問題",
      type: "reading",
      questions: 16,
    },
    7: {
      name: "Part 7",
      description: "読解問題",
      type: "reading",
      questions: 54,
    },
  };

  const handlePartToggle = (part: number) => {
    setSelectedParts((prev) => {
      if (prev.includes(part)) {
        return prev.filter((p) => p !== part);
      } else {
        return [...prev, part];
      }
    });
  };

  const handleTestTypeChange = (type: "listening" | "reading" | "full") => {
    setTestType(type);

    // テストタイプに応じてパートを自動選択
    if (type === "listening") {
      setSelectedParts([1, 2, 3, 4]);
    } else if (type === "reading") {
      setSelectedParts([5, 6, 7]);
    } else {
      setSelectedParts([1, 2, 3, 4, 5, 6, 7]);
    }
  };

  const getQuestionCount = () => {
    const listeningCount = selectedParts
      .filter((p) => p <= 4)
      .reduce(
        (sum, p) =>
          sum + partDescriptions[p as keyof typeof partDescriptions].questions,
        0
      );
    const readingCount = selectedParts
      .filter((p) => p >= 5)
      .reduce(
        (sum, p) =>
          sum + partDescriptions[p as keyof typeof partDescriptions].questions,
        0
      );
    return { listening: listeningCount, reading: readingCount };
  };

  // 事前学習ブーストを取得
  React.useEffect(() => {
    const progress =
      PreStudyTOEICIntegrationManager.getPreStudyProgressForTOEIC();
    setPreStudyBoosts(progress.availableBoosts);
  }, []);

  const handleStartTest = () => {
    if (selectedParts.length === 0) {
      alert("少なくとも1つのパートを選択してください。");
      return;
    }

    const config: TOEICTestConfig = {
      testType,
      timeLimit,
      questionCount: getQuestionCount(),
      parts: selectedParts,
      difficulty,
    };

    onStartTest?.(config);
  };

  const questionCount = getQuestionCount();

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      {/* ヘッダー */}
      <div className="flex items-center space-x-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>戻る</span>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">TOEIC模擬テスト設定</h1>
          <p className="text-gray-600">テストの種類と内容を設定してください</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* 事前学習連携表示 */}
        {preStudyBoosts && (
          <TOEICPreStudyIntegrationDisplay boosts={preStudyBoosts} />
        )}

        {/* テストタイプ選択 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>テストタイプ</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={testType} onValueChange={handleTestTypeChange}>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="full" id="full" />
                  <Label htmlFor="full" className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">フルテスト</div>
                        <div className="text-sm text-gray-600">
                          リスニング + リーディング（全パート）
                        </div>
                      </div>
                      <Badge variant="outline">約2時間</Badge>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="listening" id="listening" />
                  <Label htmlFor="listening" className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Headphones className="w-4 h-4" />
                        <div>
                          <div className="font-medium">リスニングテスト</div>
                          <div className="text-sm text-gray-600">
                            Part 1-4（聞き取り問題）
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline">約45分</Badge>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="reading" id="reading" />
                  <Label htmlFor="reading" className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Eye className="w-4 h-4" />
                        <div>
                          <div className="font-medium">リーディングテスト</div>
                          <div className="text-sm text-gray-600">
                            Part 5-7（読解問題）
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline">約75分</Badge>
                    </div>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* パート選択 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5" />
              <span>出題パート</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(partDescriptions).map(([part, info]) => (
                <div
                  key={part}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedParts.includes(parseInt(part))
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                  onClick={() => handlePartToggle(parseInt(part))}
                >
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      checked={selectedParts.includes(parseInt(part))}
                      onChange={() => handlePartToggle(parseInt(part))}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{info.name}</div>
                        <Badge
                          variant={
                            info.type === "listening" ? "default" : "secondary"
                          }
                        >
                          {info.questions}問
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {info.description}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 難易度選択 */}
        <Card>
          <CardHeader>
            <CardTitle>難易度設定</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={difficulty}
              onValueChange={(value: any) => setDifficulty(value)}
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="easy" id="easy" />
                  <Label htmlFor="easy" className="cursor-pointer">
                    <Badge variant="default">易</Badge>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium" className="cursor-pointer">
                    <Badge variant="secondary">中</Badge>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hard" id="hard" />
                  <Label htmlFor="hard" className="cursor-pointer">
                    <Badge variant="destructive">難</Badge>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mixed" id="mixed" />
                  <Label htmlFor="mixed" className="cursor-pointer">
                    <Badge variant="outline">混合</Badge>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* 制限時間設定 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>制限時間</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={timeLimit.toString()}
              onValueChange={(value) => setTimeLimit(parseInt(value))}
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { value: 60, label: "1時間" },
                  { value: 90, label: "1.5時間" },
                  { value: 120, label: "2時間" },
                  { value: 150, label: "2.5時間" },
                ].map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center space-x-2"
                  >
                    <RadioGroupItem
                      value={option.value.toString()}
                      id={`time-${option.value}`}
                    />
                    <Label
                      htmlFor={`time-${option.value}`}
                      className="cursor-pointer"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* テスト概要 */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle>テスト概要</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {questionCount.listening + questionCount.reading}
                </div>
                <div className="text-sm text-gray-600">総問題数</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {questionCount.listening}
                </div>
                <div className="text-sm text-gray-600">リスニング問題</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {questionCount.reading}
                </div>
                <div className="text-sm text-gray-600">リーディング問題</div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-blue-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">制限時間:</span>
                <span className="font-medium">
                  {Math.floor(timeLimit / 60)}時間{timeLimit % 60}分
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">選択パート:</span>
                <div className="flex space-x-1">
                  {selectedParts.map((part) => (
                    <Badge key={part} variant="outline" className="text-xs">
                      Part {part}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 開始ボタン */}
        <div className="flex justify-center">
          <Button
            onClick={handleStartTest}
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
            disabled={selectedParts.length === 0}
          >
            テスト開始
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TOEICMockTestConfig;
