import { AlertTriangle, RotateCcw, Settings } from "lucide-react";
import React, { useEffect, useState } from "react";
import { SKILL_FIELD_INFO } from "../data/levelConfig";
import { SkillField, StatusAllocation } from "../types";
import { getLevelManager, saveLevelManager } from "../utils/levelManager";
import {
  STATUS_TEMPLATES,
  validateStatusAllocation,
} from "../utils/newXpCalculator";
import { Alert, AlertDescription } from "./ui/alert";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Progress } from "./ui/progress";
import { Separator } from "./ui/separator";

interface StatusAllocationProps {
  onAllocationChange?: (allocation: StatusAllocation) => void;
  readOnly?: boolean;
}

export const StatusAllocationComponent: React.FC<StatusAllocationProps> = ({
  onAllocationChange,
  readOnly = false,
}) => {
  const [allocation, setAllocation] = useState<StatusAllocation>(() => {
    try {
      const manager = getLevelManager();
      return manager.getStatusAllocation();
    } catch (error) {
      console.error("Failed to get status allocation:", error);
      return {
        listening: 5,
        reading: 5,
        writing: 5,
        grammar: 5,
        idioms: 5,
        vocabulary: 5,
      };
    }
  });
  const [isValid, setIsValid] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");

  useEffect(() => {
    const valid = validateStatusAllocation(allocation);
    setIsValid(valid);
    onAllocationChange?.(allocation);
  }, [allocation]); // onAllocationChangeを依存配列から削除

  const handleFieldChange = (field: SkillField, value: number) => {
    const newAllocation = {
      ...allocation,
      [field]: Math.max(0, Math.min(30, value)),
    };
    setAllocation(newAllocation);
  };

  const handleTemplateSelect = (
    templateName: keyof typeof STATUS_TEMPLATES
  ) => {
    const template = STATUS_TEMPLATES[templateName];
    setAllocation({ ...template });
    setSelectedTemplate(templateName);
  };

  const resetToBalanced = () => {
    setAllocation({ ...STATUS_TEMPLATES.balanced });
    setSelectedTemplate("balanced");
  };

  const getTotalPoints = () => {
    return Object.values(allocation).reduce((sum, value) => sum + value, 0);
  };

  const getRemainingPoints = () => {
    return 30 - getTotalPoints();
  };

  const getFieldPercentage = (field: SkillField) => {
    return (allocation[field] / 30) * 100;
  };

  const _getProgressVariant = (field: SkillField) => {
    const percentage = getFieldPercentage(field);
    if (percentage >= 30) return "bg-blue-500";
    if (percentage >= 20) return "bg-green-500";
    if (percentage >= 10) return "bg-yellow-500";
    return "bg-gray-300";
  };

  const skillFields: SkillField[] = [
    "listening",
    "reading",
    "writing",
    "grammar",
    "idioms",
    "vocabulary",
  ];

  const templateLabels = {
    balanced: "バランス型",
    vocabulary: "語彙重視型",
    practical: "実践重視型",
    grammar: "文法強化型",
  };

  if (readOnly) {
    return (
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="w-5 h-5" />
            現在のステータス配分
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {skillFields.map((field) => (
              <div key={field} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">
                    {SKILL_FIELD_INFO[field].icon}
                  </span>
                  <span className="text-sm font-medium">
                    {SKILL_FIELD_INFO[field].name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress
                    value={getFieldPercentage(field)}
                    className="w-24 h-2"
                  />
                  <Badge
                    variant="outline"
                    className="text-xs font-mono w-12 justify-center"
                  >
                    {allocation[field]}pt
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">合計ポイント</span>
            <Badge variant="secondary" className="font-mono">
              {getTotalPoints()}/30pt
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="w-5 h-5" />
            ステータス配分
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">残りポイント</span>
            <Badge
              variant={getRemainingPoints() < 0 ? "destructive" : "secondary"}
              className="font-mono"
            >
              {getRemainingPoints()}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {!isValid && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              合計が30ポイントになるように調整してください。
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          {skillFields.map((field) => (
            <div key={field} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">
                    {SKILL_FIELD_INFO[field].icon}
                  </span>
                  <div>
                    <div className="text-sm font-medium">
                      {SKILL_FIELD_INFO[field].name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {SKILL_FIELD_INFO[field].description}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="0"
                    max="30"
                    value={allocation[field]}
                    onChange={(e) =>
                      handleFieldChange(field, parseInt(e.target.value) || 0)
                    }
                    className="w-16 text-center text-sm"
                  />
                  <span className="text-sm text-muted-foreground">pt</span>
                </div>
              </div>
              <Progress value={getFieldPercentage(field)} className="h-2" />
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">合計ポイント</span>
            <Badge
              variant={getTotalPoints() === 30 ? "default" : "destructive"}
              className="font-mono"
            >
              {getTotalPoints()}/30pt
            </Badge>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">テンプレート</span>
              <Button
                onClick={resetToBalanced}
                variant="ghost"
                size="sm"
                className="text-xs h-auto p-1"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                リセット
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(STATUS_TEMPLATES).map(([name, template]) => (
                <Button
                  key={name}
                  onClick={() =>
                    handleTemplateSelect(name as keyof typeof STATUS_TEMPLATES)
                  }
                  variant={selectedTemplate === name ? "default" : "outline"}
                  size="sm"
                  className="text-xs"
                >
                  {templateLabels[name as keyof typeof templateLabels]}
                </Button>
              ))}
            </div>
          </div>

          <Button
            onClick={() => {
              const manager = getLevelManager();
              manager.updateStatusAllocation(allocation);
              saveLevelManager();
            }}
            disabled={!isValid}
            className="w-full"
            size="lg"
          >
            配分を保存
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// フックは別ファイルに移動しました
