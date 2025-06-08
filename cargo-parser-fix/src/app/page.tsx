'use client';

import { useState } from 'react';
import { CargoInput } from '@/components/cargo-input';
import { QuoteDisplay } from '@/components/quote-display';
import type { Quote } from '@/lib/freight-rates';

export default function Home() {
  const [quotes, setQuotes] = useState<Quote[]>([]);

  const handleQuotesGenerated = (newQuotes: Quote[]) => {
    setQuotes(newQuotes);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🚀 智能货运报价系统
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            智能解析货物信息，一键生成海运空运报价
          </p>
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 border border-blue-300 rounded-lg">
            <span className="text-blue-700 font-medium">
              📦 支持多种数据格式 | 🌍 全球机场识别 | 💰 实时报价生成
            </span>
          </div>
        </div>

        <div className="max-w-6xl mx-auto space-y-8">
          <CargoInput onQuotesGenerated={handleQuotesGenerated} />
          <QuoteDisplay quotes={quotes} />
        </div>
      </div>
    </main>
  );
}
