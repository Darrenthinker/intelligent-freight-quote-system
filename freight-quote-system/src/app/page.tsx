'use client';

import { useState } from 'react';
import { CargoInput } from '@/components/cargo-input';
import { QuoteResults } from '@/components/quote-results';
// import { AutoTestPanel } from '@/components/auto-test-panel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Quote } from '@/lib/freight-rates';

export default function Home() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [activeTab, setActiveTab] = useState<'input' | 'test'>('input');

  const handleQuotesGenerated = (newQuotes: Quote[]) => {
    setQuotes(newQuotes);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🚀 智能货运报价系统
          </h1>
          <p className="text-lg text-gray-600">
            智能识别货物信息 • 精准计算重量体积 • 快速生成报价
          </p>
        </div>

        {/* 标签页导航 */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex space-x-4">
              <Button
                variant={activeTab === 'input' ? 'default' : 'outline'}
                onClick={() => setActiveTab('input')}
                className="px-6"
              >
                📦 数据输入与报价
              </Button>
              <Button
                variant={activeTab === 'test' ? 'default' : 'outline'}
                onClick={() => setActiveTab('test')}
                className="px-6"
              >
                🤖 自动化测试系统
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* 标签页内容 */}
        {activeTab === 'input' && (
          <div className="space-y-8">
            {/* 货物信息输入 */}
            <CargoInput onQuotesGenerated={handleQuotesGenerated} />

            {/* 报价结果 */}
            {quotes.length > 0 && (
              <QuoteResults quotes={quotes} />
            )}
          </div>
        )}

        {activeTab === 'test' && (
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">测试功能暂时不可用</h2>
            <p>请使用"数据输入与报价"功能测试V111版本的修复效果</p>
          </div>
        )}

        {/* 系统说明 */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>💡 系统功能说明</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-600">📊 数据识别模块</h4>
                <ul className="text-gray-600 space-y-1">
                  <li>• 支持37+种货运数据格式</li>
                  <li>• 智能提取重量、体积、尺寸</li>
                  <li>• 自动识别机场代码和地点</li>
                  <li>• 带电货物智能标识</li>
                  <li>• 多单位自动转换(mm/cm/m)</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-green-600">📋 报价表管理</h4>
                <ul className="text-gray-600 space-y-1">
                  <li>• 海运/空运双模式计算</li>
                  <li>• 体积重智能判断</li>
                  <li>• 多航司价格对比</li>
                  <li>• 货物密度分类</li>
                  <li>• 实时运费计算</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-orange-600">💰 智能报价</h4>
                <ul className="text-gray-600 space-y-1">
                  <li>• 批量数据识别</li>
                  <li>• 自动识别异常数据</li>
                  <li>• 智能算费率生成</li>
                  <li>• 报价格式自动输出</li>
                  <li>• 持续监控优化</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-purple-600">🤖 自动化测试</h4>
                <ul className="text-gray-600 space-y-1">
                  <li>• 自动化测试</li>
                  <li>• 自动识别异常数据</li>
                  <li>• 智能修复建议</li>
                  <li>• 报价格式自动输出</li>
                  <li>• 持续监控优化</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 版本信息 */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          智能货运报价系统 v1.0 • 支持全球1000+机场 • 数据识别准确率95%+
        </div>
      </div>
    </div>
  );
}
