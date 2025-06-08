'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Quote } from "@/lib/freight-rates";

interface QuoteDisplayProps {
  quotes: Quote[];
}

export function QuoteDisplay({ quotes }: QuoteDisplayProps) {
  if (quotes.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>💰 运费报价</CardTitle>
          <CardDescription>
            根据货物信息生成的运费报价单
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {quotes.map((quote) => (
              <div
                key={quote.id}
                className={`p-4 border rounded-lg ${
                  quote.transportMode === 'air'
                    ? 'border-blue-200 bg-blue-50'
                    : 'border-green-200 bg-green-50'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className={`font-semibold ${
                      quote.transportMode === 'air' ? 'text-blue-700' : 'text-green-700'
                    }`}>
                      {quote.transportMode === 'air' ? '✈️ 空运' : '🚢 海运'} - {quote.company}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {quote.origin} → {quote.destination}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${
                      quote.transportMode === 'air' ? 'text-blue-600' : 'text-green-600'
                    }`}>
                      ¥{quote.totalCost.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {quote.rate} {quote.currency}/{quote.transportMode === 'air' ? 'kg' : 'cbm'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">计费重量:</span>
                    <span className="ml-1 font-medium">{quote.chargeableWeight} kg</span>
                  </div>
                  <div>
                    <span className="text-gray-500">体积:</span>
                    <span className="ml-1 font-medium">{quote.volume} cbm</span>
                  </div>
                  <div>
                    <span className="text-gray-500">运输时效:</span>
                    <span className="ml-1 font-medium">{quote.transitTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
