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
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              智能货运报价系统
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              一键解析货物信息，自动计算运费，多方案对比选择
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Cargo Input Section */}
          <CargoInput onQuotesGenerated={handleQuotesGenerated} />

          {/* Quote Results Section */}
          {quotes.length > 0 && (
            <div className="mt-8">
              <QuoteResults quotes={quotes} />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500">
            <p className="text-sm">
              © 2024 智能货运报价系统 - 让货运报价更简单、更智能
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
