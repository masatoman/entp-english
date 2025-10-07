import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
// import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface LearningFeedbackFormProps {
  onClose: () => void;
}

export const LearningFeedbackForm: React.FC<LearningFeedbackFormProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    userLevel: '',
    learningMode: '',
    feedback: '',
    rating: '',
    suggestions: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Netlify Formsに送信
    const form = new FormData();
    form.append('form-name', 'learning-feedback');
    Object.entries(formData).forEach(([key, value]) => {
      form.append(key, value);
    });

    try {
      await fetch('/', {
        method: 'POST',
        body: form,
      });
      
      alert('フィードバックを送信しました！ありがとうございます。');
      onClose();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('送信に失敗しました。もう一度お試しください。');
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>学習フィードバック</CardTitle>
      </CardHeader>
      <CardContent>
        <form name="learning-feedback" onSubmit={handleSubmit}>
          <input type="hidden" name="form-name" value="learning-feedback" />
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="userLevel">現在のレベル</Label>
              <Select 
                value={formData.userLevel} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, userLevel: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="レベルを選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">初級</SelectItem>
                  <SelectItem value="intermediate">中級</SelectItem>
                  <SelectItem value="advanced">上級</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="learningMode">お気に入りの学習モード</Label>
              <Select 
                value={formData.learningMode} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, learningMode: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="学習モードを選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vocabulary">語彙学習</SelectItem>
                  <SelectItem value="grammar">文法クイズ</SelectItem>
                  <SelectItem value="combined">総合テスト</SelectItem>
                  <SelectItem value="time-attack">タイムアタック</SelectItem>
                  <SelectItem value="tower-defense">タワーディフェンス</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="rating">満足度</Label>
              <Select 
                value={formData.rating} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, rating: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="満足度を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">とても満足</SelectItem>
                  <SelectItem value="4">満足</SelectItem>
                  <SelectItem value="3">普通</SelectItem>
                  <SelectItem value="2">不満</SelectItem>
                  <SelectItem value="1">とても不満</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="feedback">学習体験のフィードバック</Label>
              <Textarea
                id="feedback"
                placeholder="学習体験について教えてください..."
                value={formData.feedback}
                onChange={(e) => setFormData(prev => ({ ...prev, feedback: e.target.value }))}
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="suggestions">改善提案</Label>
              <Textarea
                id="suggestions"
                placeholder="改善してほしい点や追加してほしい機能があれば教えてください..."
                value={formData.suggestions}
                onChange={(e) => setFormData(prev => ({ ...prev, suggestions: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="flex space-x-2">
              <Button type="submit" className="flex-1">
                送信
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                キャンセル
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
