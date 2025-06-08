'use client';

import { useState } from 'react';
import { CargoInput } from '@/components/cargo-input';
import { QuoteResults } from '@/components/quote-results';
import type { Quote } from '@/lib/freight-rates';

export default function Home() {
  const [quotes, setQuotes] = useState<Quote[]>([]);

  const handleQuotesGenerated = (newQuotes: Quote[]) => {
    setQuotes(newQuotes);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            智能货运报价系统
          </h1>
          <p className="mt-2 text-gray-600">
            智能识别货物信息，一键生成海运空运报价
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左侧：货物信息输入 */}
          <div>
            <CargoInput onQuotesGenerated={handleQuotesGenerated} />
          </div>

          {/* 右侧：报价结果 */}
          <div>
            <QuoteResults quotes={quotes} />
          </div>
        </div>
      </main>
    </div>
  );
}
