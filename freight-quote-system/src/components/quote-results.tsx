'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Quote } from "@/lib/freight-rates";

interface QuoteResultsProps {
  quotes: Quote[];
}

export function QuoteResults({ quotes }: QuoteResultsProps) {
  if (quotes.length === 0) {
    return null;
  }

  // 按运输方式分组
  const seaQuotes = quotes.filter(q => q.transportMode === 'sea');
  const airQuotes = quotes.filter(q => q.transportMode === 'air');

  const formatCurrency = (amount: number, currency: string) => {
    return `${currency} ${amount.toLocaleString()}`;
  };

  const getTransportModeLabel = (mode: 'sea' | 'air') => {
    return mode === 'sea' ? '海运' : '空运';
  };

  const getTransportModeColor = (mode: 'sea' | 'air') => {
    return mode === 'sea' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800';
  };

  const QuoteCard = ({ quote }: { quote: Quote }) => (
    <Card className="relative">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">
              {quote.shippingLine}
            </CardTitle>
            <CardDescription className="text-sm">
              {quote.origin} → {quote.destination}
            </CardDescription>
          </div>
          <div className="text-right">
            <Badge className={getTransportModeColor(quote.transportMode)}>
              {getTransportModeLabel(quote.transportMode)}
            </Badge>
            <p className="text-sm text-muted-foreground mt-1">
              {quote.transitTime}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 费用明细 */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm">基础运费</span>
            <span className="font-medium">
              {formatCurrency(quote.baseFreight, quote.currency)}
            </span>
          </div>

          {quote.surcharges.map((surcharge) => (
            <div key={surcharge.name} className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">{surcharge.name}</span>
              <span>{formatCurrency(surcharge.amount, surcharge.currency)}</span>
            </div>
          ))}

          <hr className="my-2" />

          <div className="flex justify-between items-center text-lg font-semibold">
            <span>总费用</span>
            <span className="text-primary">
              {formatCurrency(quote.totalAmount, quote.currency)}
            </span>
          </div>
        </div>

        {/* 报价详情 */}
        <div className="pt-2 border-t text-xs text-muted-foreground">
          <div className="flex justify-between">
            <span>报价编号: {quote.quoteId}</span>
            <span>有效期至: {quote.validUntil.toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">运输报价结果</h2>
        <p className="text-muted-foreground mt-2">
          共找到 {quotes.length} 个报价方案，请选择最适合的运输方案
        </p>
      </div>

      {/* 海运报价 */}
      {seaQuotes.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Badge className="bg-blue-100 text-blue-800">海运</Badge>
            海运报价方案 ({seaQuotes.length} 个)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {seaQuotes.map((quote) => (
              <QuoteCard key={quote.quoteId} quote={quote} />
            ))}
          </div>
        </div>
      )}

      {/* 空运报价 */}
      {airQuotes.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Badge className="bg-green-100 text-green-800">空运</Badge>
            空运报价方案 ({airQuotes.length} 个)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {airQuotes.map((quote) => (
              <QuoteCard key={quote.quoteId} quote={quote} />
            ))}
          </div>
        </div>
      )}

      {/* 价格对比总结 */}
      {quotes.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>价格对比总结</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-muted-foreground">最低价格</p>
                <p className="text-lg font-semibold text-green-600">
                  {formatCurrency(
                    Math.min(...quotes.map(q => q.totalAmount)),
                    quotes[0].currency
                  )}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {quotes.find(q => q.totalAmount === Math.min(...quotes.map(q => q.totalAmount)))?.shippingLine}
                </p>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-muted-foreground">平均价格</p>
                <p className="text-lg font-semibold text-blue-600">
                  {formatCurrency(
                    Math.round(quotes.reduce((sum, q) => sum + q.totalAmount, 0) / quotes.length),
                    quotes[0].currency
                  )}
                </p>
              </div>

              <div className="p-4 bg-orange-50 rounded-lg">
                <p className="text-sm text-muted-foreground">最快时效</p>
                <p className="text-lg font-semibold text-orange-600">
                  {quotes.find(q => q.transportMode === 'air')?.transitTime ||
                   quotes[0]?.transitTime}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {quotes.find(q => q.transportMode === 'air')?.shippingLine ||
                   quotes[0]?.shippingLine}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
