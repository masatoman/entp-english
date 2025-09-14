import React, { useState, useEffect } from 'react';
import { StatusAllocation, SkillField } from '../types';
import { getLevelManager, saveLevelManager } from '../utils/levelManager';
import { STATUS_TEMPLATES, validateStatusAllocation } from '../utils/newXpCalculator';
import { SKILL_FIELD_INFO } from '../data/levelConfig';

interface StatusAllocationProps {
  onAllocationChange?: (allocation: StatusAllocation) => void;
  readOnly?: boolean;
}

export const StatusAllocationComponent: React.FC<StatusAllocationProps> = ({
  onAllocationChange,
  readOnly = false,
}) => {
  const [allocation, setAllocation] = useState<StatusAllocation>(() => {
    const manager = getLevelManager();
    return manager.getStatusAllocation();
  });
  const [isValid, setIsValid] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  useEffect(() => {
    const valid = validateStatusAllocation(allocation);
    setIsValid(valid);
    onAllocationChange?.(allocation);
  }, [allocation, onAllocationChange]);

  const handleFieldChange = (field: SkillField, value: number) => {
    const newAllocation = {
      ...allocation,
      [field]: Math.max(0, Math.min(30, value)),
    };
    setAllocation(newAllocation);
  };

  const handleTemplateSelect = (templateName: keyof typeof STATUS_TEMPLATES) => {
    const template = STATUS_TEMPLATES[templateName];
    setAllocation({ ...template });
    setSelectedTemplate(templateName);
  };

  const resetToBalanced = () => {
    setAllocation({ ...STATUS_TEMPLATES.balanced });
    setSelectedTemplate('balanced');
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

  const getFieldColor = (field: SkillField) => {
    const percentage = getFieldPercentage(field);
    if (percentage >= 30) return 'bg-blue-500';
    if (percentage >= 20) return 'bg-green-500';
    if (percentage >= 10) return 'bg-yellow-500';
    return 'bg-gray-300';
  };

  const skillFields: SkillField[] = [
    'listening',
    'reading',
    'writing',
    'grammar',
    'idioms',
    'vocabulary',
  ];

  if (readOnly) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">現在のステータス配分</h3>
        <div className="space-y-3">
          {skillFields.map((field) => (
            <div key={field} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{SKILL_FIELD_INFO[field].icon}</span>
                <span className="text-sm font-medium text-gray-700">
                  {SKILL_FIELD_INFO[field].name}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getFieldColor(field)}`}
                    style={{ width: `${getFieldPercentage(field)}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-600 w-8 text-right">
                  {allocation[field]}pt
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">合計ポイント</span>
            <span className="font-medium">{getTotalPoints()}/30pt</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">ステータス配分</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">残りポイント</span>
          <span className={`text-sm font-medium ${getRemainingPoints() < 0 ? 'text-red-500' : 'text-gray-700'}`}>
            {getRemainingPoints()}
          </span>
        </div>
      </div>

      {!isValid && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center">
            <div className="text-red-600 mr-2">⚠️</div>
            <div className="text-sm text-red-800">
              合計が30ポイントになるように調整してください。
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {skillFields.map((field) => (
          <div key={field} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{SKILL_FIELD_INFO[field].icon}</span>
                <div>
                  <div className="text-sm font-medium text-gray-700">
                    {SKILL_FIELD_INFO[field].name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {SKILL_FIELD_INFO[field].description}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={allocation[field]}
                  onChange={(e) => handleFieldChange(field, parseInt(e.target.value) || 0)}
                  className="w-16 px-2 py-1 text-sm border border-gray-300 rounded-md text-center"
                />
                <span className="text-sm text-gray-600">pt</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${getFieldColor(field)}`}
                style={{ width: `${getFieldPercentage(field)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">合計ポイント</span>
          <span className={`font-medium ${getTotalPoints() === 30 ? 'text-green-600' : 'text-red-500'}`}>
            {getTotalPoints()}/30pt
          </span>
        </div>

        <div className="pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">テンプレート</span>
            <button
              onClick={resetToBalanced}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              リセット
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(STATUS_TEMPLATES).map(([name, template]) => (
              <button
                key={name}
                onClick={() => handleTemplateSelect(name as keyof typeof STATUS_TEMPLATES)}
                className={`px-3 py-2 text-xs rounded-md border transition-colors ${
                  selectedTemplate === name
                    ? 'bg-blue-100 border-blue-300 text-blue-700'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {name === 'balanced' && 'バランス型'}
                {name === 'vocabulary' && '語彙重視型'}
                {name === 'practical' && '実践重視型'}
                {name === 'grammar' && '文法強化型'}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => {
            const manager = getLevelManager();
            manager.updateStatusAllocation(allocation);
            saveLevelManager();
          }}
          disabled={!isValid}
          className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            isValid
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          配分を保存
        </button>
      </div>
    </div>
  );
};

// ステータス配分の管理フック
export const useStatusAllocation = () => {
  const [allocation, setAllocation] = useState<StatusAllocation>(() => {
    const manager = getLevelManager();
    return manager.getStatusAllocation();
  });

  const updateAllocation = (newAllocation: StatusAllocation): boolean => {
    const manager = getLevelManager();
    const success = manager.updateStatusAllocation(newAllocation);
    
    if (success) {
      setAllocation(newAllocation);
      saveLevelManager();
      return true;
    }
    
    return false;
  };

  const applyTemplate = (templateName: keyof typeof STATUS_TEMPLATES): boolean => {
    const manager = getLevelManager();
    const success = manager.applyStatusTemplate(templateName);
    
    if (success) {
      const newAllocation = manager.getStatusAllocation();
      setAllocation(newAllocation);
      saveLevelManager();
      return true;
    }
    
    return false;
  };

  return {
    allocation,
    updateAllocation,
    applyTemplate,
  };
};
