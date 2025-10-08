import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";

export interface SelectionCardProps {
  children?: React.ReactNode;
  className?: string;
  id?: string;
  title: string;
  description: string;
  difficulty?: string;
  detail?: string;
  onClick: () => void;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  disabled?: boolean;
  // 追加のプロパティ
  key?: string;
  color?: string;
  keyPoints?: string[];
  level?: number;
  duration?: string;
  category?: string;
  isLocked?: boolean;
  isCompleted?: boolean;
}

export function SelectionCard({
  children,
  className,
  id: _id,
  title,
  description,
  difficulty,
  detail,
  onClick,
  icon,
  badge,
  disabled = false,
  key: _key,
  color: _color,
  keyPoints,
}: SelectionCardProps) {
  return (
    <Card
      className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className || ""}`}
      onClick={disabled ? undefined : onClick}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {icon && <div className="text-2xl">{icon}</div>}
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              {difficulty && (
                <CardDescription className="text-sm text-gray-600">
                  {difficulty}
                </CardDescription>
              )}
            </div>
          </div>
          {badge && <div>{badge}</div>}
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm text-gray-700">
          {description}
        </CardDescription>
        {detail && <p className="text-xs text-gray-500 mt-2">{detail}</p>}
        {keyPoints && keyPoints.length > 0 && (
          <div className="mt-2">
            <ul className="text-xs text-gray-600 space-y-1">
              {keyPoints.map((point, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-1">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {children}
      </CardContent>
    </Card>
  );
}
