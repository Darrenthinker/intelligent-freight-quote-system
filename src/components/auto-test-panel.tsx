'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { runBatchTest, generateTestReport, generateAutoRepairCode, type TestResult } from "@/lib/auto-test-repair";

export function AutoTestPanel() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [testReport, setTestReport] = useState<string>('');
  const [repairCode, setRepairCode] = useState<string>('');
  const [progress, setProgress] = useState(0);

  const runTests = async () => {
    setIsRunning(true);
    setProgress(0);
    setResults([]);
    setTestReport('');
    setRepairCode('');

    try {
      // 模拟进度更新
      const testResults = runBatchTest();

      // 模拟逐步更新进度
      for (let i = 0; i <= testResults.length; i++) {
        setProgress((i / testResults.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      setResults(testResults);

      // 生成报告
      const report = generateTestReport(testResults);
      setTestReport(report);

      // 生成修复代码
      const repair = generateAutoRepairCode(testResults);
      setRepairCode(repair);

    } catch (error) {
      console.error('测试运行失败:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const passedCount = results.filter(r => r.passed).length;
  const failedCount = results.length - passedCount;
  const successRate = results.length > 0 ? ((passedCount / results.length) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      {/* 测试控制面板 */}
      <Card>
        <CardHeader>
          <CardTitle>🤖 自动化数据识别测试系统</CardTitle>
          <CardDescription>
            批量测试20种货运数据格式，自动检测识别问题并生成修复建议
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button
              onClick={runTests}
              disabled={isRunning}
              size="lg"
              className="px-8"
            >
              {isRunning ? '正在测试...' : '🚀 开始批量测试'}
            </Button>

            {isRunning && (
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-muted-foreground">测试进度:</span>
                  <span className="text-sm font-medium">{progress.toFixed(0)}%</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 测试结果概要 */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>📊 测试结果概要</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{results.length}</div>
                <div className="text-sm text-blue-600">总测试数</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{passedCount}</div>
                <div className="text-sm text-green-600">通过测试</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{failedCount}</div>
                <div className="text-sm text-red-600">失败测试</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{successRate}%</div>
                <div className="text-sm text-purple-600">成功率</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 详细测试结果 */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>🔍 详细测试结果</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.map((result) => (
                <div
                  key={result.testId}
                  className={`border rounded-lg p-4 ${result.passed ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">
                      测试{result.testId}: {result.testName}
                    </h4>
                    <Badge variant={result.passed ? 'default' : 'destructive'}>
                      {result.passed ? '✅ PASS' : '❌ FAIL'}
                    </Badge>
                  </div>

                  {!result.passed && (
                    <div className="space-y-2">
                      <div>
                        <h5 className="text-sm font-medium text-red-700 mb-1">错误:</h5>
                        <ul className="text-sm text-red-600 list-disc list-inside">
                          {result.errors.map((error, idx) => (
                            <li key={idx}>{error}</li>
                          ))}
                        </ul>
                      </div>

                      {result.recommendations.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium text-orange-700 mb-1">修复建议:</h5>
                          <ul className="text-sm text-orange-600 list-disc list-inside">
                            {result.recommendations.map((rec, idx) => (
                              <li key={idx}>{rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {result.passed && (
                    <p className="text-sm text-green-600">✨ 解析成功，所有字段匹配期望结果</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 自动修复代码 */}
      {repairCode && failedCount > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>🔧 自动生成修复代码</CardTitle>
            <CardDescription>
              基于测试结果自动生成的修复建议和代码框架
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={repairCode}
              readOnly
              rows={15}
              className="font-mono text-sm"
              placeholder="修复代码将在这里显示..."
            />
            <div className="mt-4 flex gap-2">
              <Button
                variant="outline"
                onClick={() => navigator.clipboard.writeText(repairCode)}
              >
                📋 复制修复代码
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const blob = new Blob([repairCode], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `auto-repair-${Date.now()}.js`;
                  a.click();
                }}
              >
                💾 下载修复代码
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 测试报告 */}
      {testReport && (
        <Card>
          <CardHeader>
            <CardTitle>📋 详细测试报告</CardTitle>
            <CardDescription>
              完整的测试结果报告，可复制或下载
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={testReport}
              readOnly
              rows={20}
              className="font-mono text-sm"
              placeholder="测试报告将在这里显示..."
            />
            <div className="mt-4 flex gap-2">
              <Button
                variant="outline"
                onClick={() => navigator.clipboard.writeText(testReport)}
              >
                📋 复制报告
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const blob = new Blob([testReport], { type: 'text/markdown' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `test-report-${Date.now()}.md`;
                  a.click();
                }}
              >
                💾 下载报告
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 使用说明 */}
      <Card>
        <CardHeader>
          <CardTitle>📖 使用说明</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm space-y-2">
            <p><strong>1. 自动化测试:</strong> 点击"开始批量测试"按钮，系统会自动测试20种不同格式的货运数据</p>
            <p><strong>2. 结果分析:</strong> 查看测试概要，了解整体通过率和失败项目</p>
            <p><strong>3. 错误诊断:</strong> 查看详细的错误信息和具体不匹配的字段</p>
            <p><strong>4. 修复建议:</strong> 系统会自动生成针对性的修复建议</p>
            <p><strong>5. 代码修复:</strong> 获取自动生成的修复代码框架，可以直接使用或参考</p>
            <p><strong>6. 持续改进:</strong> 定期运行测试，确保数据识别功能的稳定性</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
