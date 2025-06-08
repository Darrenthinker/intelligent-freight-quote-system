// 简单的运费报价生成器
export interface Quote {
  id: string;
  origin: string;
  destination: string;
  transportMode: 'sea' | 'air';
  chargeableWeight: number;
  volume: number;
  rate: number;
  totalCost: number;
  currency: string;
  transitTime: string;
  company: string;
}

// 生成模拟报价
export function generateQuotes(
  origin: string,
  destination: string,
  chargeableWeight: number,
  volume: number,
  transportMode: 'sea' | 'air'
): Quote[] {
  const quotes: Quote[] = [];

  if (transportMode === 'air') {
    // 空运报价
    quotes.push({
      id: `air-${Date.now()}`,
      origin,
      destination,
      transportMode: 'air',
      chargeableWeight,
      volume,
      rate: 25,
      totalCost: chargeableWeight * 25,
      currency: 'CNY',
      transitTime: '3-5天',
      company: '空运快线'
    });

    quotes.push({
      id: `air-premium-${Date.now()}`,
      origin,
      destination,
      transportMode: 'air',
      chargeableWeight,
      volume,
      rate: 30,
      totalCost: chargeableWeight * 30,
      currency: 'CNY',
      transitTime: '2-3天',
      company: '极速空运'
    });
  }

  if (transportMode === 'sea') {
    // 海运报价
    quotes.push({
      id: `sea-${Date.now()}`,
      origin,
      destination,
      transportMode: 'sea',
      chargeableWeight,
      volume,
      rate: 800,
      totalCost: volume * 800,
      currency: 'CNY',
      transitTime: '15-25天',
      company: '海运专线'
    });
  }

  return quotes;
}
