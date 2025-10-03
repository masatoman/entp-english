import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useDataManager } from "@/hooks/useDataManager";
import { MessageSquare, Send, Star, ThumbsUp } from "lucide-react";
import React, { useState } from "react";

interface FeedbackData {
  id: string;
  timestamp: Date;
  overallRating: number;
  category: string;
  specificRating: {
    design: number;
    usability: number;
    performance: number;
    content: number;
    gamification: number;
  };
  feedback: string;
  suggestions: string;
  bugs: string;
  deviceInfo: {
    userAgent: string;
    screenSize: string;
    platform: string;
  };
  userType: string;
  experience: string[];
}

const UserFeedback: React.FC = () => {
  const [overallRating, setOverallRating] = useState<number>(0);
  const [category, setCategory] = useState<string>("");
  const [specificRating, setSpecificRating] = useState({
    design: 0,
    usability: 0,
    performance: 0,
    content: 0,
    gamification: 0,
  });
  const [feedback, setFeedback] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [bugs, setBugs] = useState("");
  const [userType, setUserType] = useState("");
  const [experience, setExperience] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { saveUserFeedback } = useDataManager();

  const handleRatingChange = (rating: number) => {
    setOverallRating(rating);
  };

  const handleSpecificRatingChange = (aspect: string, rating: number) => {
    setSpecificRating((prev) => ({
      ...prev,
      [aspect]: rating,
    }));
  };

  const handleExperienceChange = (exp: string, checked: boolean) => {
    if (checked) {
      setExperience((prev) => [...prev, exp]);
    } else {
      setExperience((prev) => prev.filter((e) => e !== exp));
    }
  };

  const handleSubmit = async () => {
    if (!category || overallRating === 0 || !feedback.trim()) {
      alert("必須項目を入力してください");
      return;
    }

    setIsSubmitting(true);

    try {
      const feedbackData: FeedbackData = {
        id: `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
        overallRating,
        category,
        specificRating,
        feedback: feedback.trim(),
        suggestions: suggestions.trim(),
        bugs: bugs.trim(),
        deviceInfo: {
          userAgent: navigator.userAgent,
          screenSize: `${window.screen.width}x${window.screen.height}`,
          platform: navigator.platform,
        },
        userType,
        experience,
      };

      await saveUserFeedback(feedbackData);
      setIsSubmitted(true);

      // フォームリセット
      setOverallRating(0);
      setCategory("");
      setSpecificRating({
        design: 0,
        usability: 0,
        performance: 0,
        content: 0,
        gamification: 0,
      });
      setFeedback("");
      setSuggestions("");
      setBugs("");
      setUserType("");
      setExperience([]);
    } catch (error) {
      console.error("フィードバック送信エラー:", error);
      alert("フィードバックの送信に失敗しました。もう一度お試しください。");
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating: React.FC<{
    rating: number;
    onRatingChange: (rating: number) => void;
    label: string;
  }> = ({ rating, onRatingChange, label }) => (
    <div className="flex items-center gap-2">
      <Label className="text-sm font-medium min-w-[80px]">{label}</Label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            className={`transition-colors ${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            } hover:text-yellow-400`}
          >
            <Star className="w-5 h-5 fill-current" />
          </button>
        ))}
      </div>
    </div>
  );

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <ThumbsUp className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-green-800 mb-2">
              フィードバックを送信しました！
            </h3>
            <p className="text-green-700 mb-4">
              貴重なご意見をありがとうございます。今後の改善に活用させていただきます。
            </p>
            <Button
              onClick={() => setIsSubmitted(false)}
              variant="outline"
              className="border-green-300 text-green-700 hover:bg-green-100"
            >
              新しいフィードバックを送信
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            ユーザーフィードバック
          </CardTitle>
          <p className="text-sm text-gray-600">
            アプリの改善のために、ご意見をお聞かせください
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 総合評価 */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">総合評価</Label>
            <StarRating
              rating={overallRating}
              onRatingChange={handleRatingChange}
              label=""
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>とても悪い</span>
              <span>とても良い</span>
            </div>
          </div>

          {/* カテゴリー選択 */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">評価カテゴリー *</Label>
            <RadioGroup value={category} onValueChange={setCategory}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="listening" id="listening" />
                <Label htmlFor="listening">リスニング学習</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="vocabulary" id="vocabulary" />
                <Label htmlFor="vocabulary">語彙学習</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="grammar" id="grammar" />
                <Label htmlFor="grammar">文法クイズ</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="achievements" id="achievements" />
                <Label htmlFor="achievements">実績システム</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="overall" id="overall" />
                <Label htmlFor="overall">全体的な使用感</Label>
              </div>
            </RadioGroup>
          </div>

          {/* 詳細評価 */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">詳細評価</Label>
            <div className="space-y-3">
              <StarRating
                rating={specificRating.design}
                onRatingChange={(rating) =>
                  handleSpecificRatingChange("design", rating)
                }
                label="デザイン"
              />
              <StarRating
                rating={specificRating.usability}
                onRatingChange={(rating) =>
                  handleSpecificRatingChange("usability", rating)
                }
                label="使いやすさ"
              />
              <StarRating
                rating={specificRating.performance}
                onRatingChange={(rating) =>
                  handleSpecificRatingChange("performance", rating)
                }
                label="パフォーマンス"
              />
              <StarRating
                rating={specificRating.content}
                onRatingChange={(rating) =>
                  handleSpecificRatingChange("content", rating)
                }
                label="コンテンツ品質"
              />
              <StarRating
                rating={specificRating.gamification}
                onRatingChange={(rating) =>
                  handleSpecificRatingChange("gamification", rating)
                }
                label="ゲーミフィケーション"
              />
            </div>
          </div>

          {/* ユーザータイプ */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">あなたについて</Label>
            <RadioGroup value={userType} onValueChange={setUserType}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="student" id="student" />
                <Label htmlFor="student">学生</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="professional" id="professional" />
                <Label htmlFor="professional">社会人</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="teacher" id="teacher" />
                <Label htmlFor="teacher">教師・講師</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="other" />
                <Label htmlFor="other">その他</Label>
              </div>
            </RadioGroup>
          </div>

          {/* 学習経験 */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">
              学習経験（複数選択可）
            </Label>
            <div className="space-y-2">
              {[
                "TOEIC受験経験あり",
                "英検受験経験あり",
                "英語学習アプリ使用経験あり",
                "オンライン英会話経験あり",
                "英語学習初心者",
              ].map((exp) => (
                <div key={exp} className="flex items-center space-x-2">
                  <Checkbox
                    id={exp}
                    checked={experience.includes(exp)}
                    onCheckedChange={(checked) =>
                      handleExperienceChange(exp, !!checked)
                    }
                  />
                  <Label htmlFor={exp} className="text-sm">
                    {exp}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* フィードバック内容 */}
          <div className="space-y-3">
            <Label htmlFor="feedback" className="text-base font-semibold">
              ご意見・感想 *
            </Label>
            <Textarea
              id="feedback"
              placeholder="アプリの使用感、気になった点、良かった点などをお聞かせください"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          {/* 改善提案 */}
          <div className="space-y-3">
            <Label htmlFor="suggestions" className="text-base font-semibold">
              改善提案
            </Label>
            <Textarea
              id="suggestions"
              placeholder="こんな機能があったら良い、こんな風に変わったら良いなどのご提案"
              value={suggestions}
              onChange={(e) => setSuggestions(e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          {/* バグ報告 */}
          <div className="space-y-3">
            <Label htmlFor="bugs" className="text-base font-semibold">
              バグ・不具合報告
            </Label>
            <Textarea
              id="bugs"
              placeholder="動作がおかしい、エラーが発生したなどの不具合があればお聞かせください"
              value={bugs}
              onChange={(e) => setBugs(e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          {/* 送信ボタン */}
          <Button
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              !category ||
              overallRating === 0 ||
              !feedback.trim()
            }
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                送信中...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                フィードバックを送信
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserFeedback;
