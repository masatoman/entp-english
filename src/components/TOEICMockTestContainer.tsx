import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TOEICTestConfig, TOEICTestResult } from "../types/mockTest";
import TOEICMockTest from "./TOEICMockTest";
import TOEICMockTestConfig from "./TOEICMockTestConfig";
import TOEICMockTestResult from "./TOEICMockTestResult";

type TestPhase = "config" | "test" | "result";

export const TOEICMockTestContainer: React.FC = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<TestPhase>("config");
  const [testConfig, setTestConfig] = useState<TOEICTestConfig | null>(null);
  const [testResult, setTestResult] = useState<TOEICTestResult | null>(null);

  const handleStartTest = (config: TOEICTestConfig) => {
    setTestConfig(config);
    setPhase("test");
  };

  const handleTestComplete = (result: TOEICTestResult) => {
    setTestResult(result);
    setPhase("result");
  };

  const handleRetakeTest = () => {
    setTestResult(null);
    setPhase("config");
  };

  const handleExitTest = () => {
    navigate("/");
  };

  const renderCurrentPhase = () => {
    switch (phase) {
      case "config":
        return <TOEICMockTestConfig onStartTest={handleStartTest} />;
      case "test":
        return testConfig ? (
          <TOEICMockTest
            testConfig={testConfig}
            onComplete={handleTestComplete}
          />
        ) : null;
      case "result":
        return testResult ? (
          <TOEICMockTestResult
            result={testResult}
            onRetake={handleRetakeTest}
            onExit={handleExitTest}
          />
        ) : null;
      default:
        return null;
    }
  };

  return <div>{renderCurrentPhase()}</div>;
};

export default TOEICMockTestContainer;
