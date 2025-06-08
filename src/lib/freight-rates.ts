// 货运费率和报价系统

export interface FreightRate {
  id: string;
  origin: string;
  destination: string;
  transportMode: 'sea' | 'air';
  shippingLine: string;
  baseRate: number; // USD per ton or CBM
  currency: 'USD' | 'CNY';
  validFrom: Date;
  validTo: Date;
  surcharges: Surcharge[];
}

export interface Surcharge {
  name: string;
  type: 'fixed' | 'percentage' | 'per_ton' | 'per_cbm' | 'per_container';
  amount: number;
  currency: 'USD' | 'CNY';
  mandatory: boolean;
}

export interface Quote {
  quoteId: string;
  origin: string;
  destination: string;
  transportMode: 'sea' | 'air';
  shippingLine: string;
  baseFreight: number;
  surcharges: QuoteSurcharge[];
  totalAmount: number;
  currency: 'USD' | 'CNY';
  transitTime: string;
  validUntil: Date;
}

export interface QuoteSurcharge {
  name: string;
  amount: number;
  currency: 'USD' | 'CNY';
}

// 示例费率数据 (广州出发)
export const sampleRates: FreightRate[] = [
  {
    id: 'GZ-LA-SEA-001',
    origin: '广州',
    destination: '洛杉矶',
    transportMode: 'sea',
    shippingLine: 'COSCO',
    baseRate: 1200,
    currency: 'USD',
    validFrom: new Date('2024-01-01'),
    validTo: new Date('2024-12-31'),
    surcharges: [
      { name: '燃油附加费', type: 'percentage', amount: 15, currency: 'USD', mandatory: true },
      { name: '港杂费', type: 'fixed', amount: 150, currency: 'USD', mandatory: true },
      { name: '文件费', type: 'fixed', amount: 50, currency: 'USD', mandatory: true },
    ]
  },
  {
    id: 'GZ-NY-SEA-001',
    origin: '广州',
    destination: '纽约',
    transportMode: 'sea',
    shippingLine: 'EVERGREEN',
    baseRate: 1350,
    currency: 'USD',
    validFrom: new Date('2024-01-01'),
    validTo: new Date('2024-12-31'),
    surcharges: [
      { name: '燃油附加费', type: 'percentage', amount: 18, currency: 'USD', mandatory: true },
      { name: '港杂费', type: 'fixed', amount: 180, currency: 'USD', mandatory: true },
      { name: '文件费', type: 'fixed', amount: 50, currency: 'USD', mandatory: true },
    ]
  },
  {
    id: 'GZ-HH-SEA-001',
    origin: '广州',
    destination: '汉堡',
    transportMode: 'sea',
    shippingLine: 'MSC',
    baseRate: 1100,
    currency: 'USD',
    validFrom: new Date('2024-01-01'),
    validTo: new Date('2024-12-31'),
    surcharges: [
      { name: '燃油附加费', type: 'percentage', amount: 12, currency: 'USD', mandatory: true },
      { name: '港杂费', type: 'fixed', amount: 120, currency: 'USD', mandatory: true },
      { name: '文件费', type: 'fixed', amount: 45, currency: 'USD', mandatory: true },
    ]
  },
  // 空运费率
  {
    id: 'GZ-LA-AIR-001',
    origin: '广州',
    destination: '洛杉矶',
    transportMode: 'air',
    shippingLine: 'CA Cargo',
    baseRate: 4.5, // USD per kg
    currency: 'USD',
    validFrom: new Date('2024-01-01'),
    validTo: new Date('2024-12-31'),
    surcharges: [
      { name: '燃油附加费', type: 'percentage', amount: 25, currency: 'USD', mandatory: true },
      { name: '安检费', type: 'per_ton', amount: 80, currency: 'USD', mandatory: true },
      { name: '文件费', type: 'fixed', amount: 30, currency: 'USD', mandatory: true },
    ]
  }
];

// 根据条件查找费率
export function findRates(origin: string, destination: string, transportMode?: 'sea' | 'air'): FreightRate[] {
  return sampleRates.filter(rate => {
    const matchOrigin = rate.origin.includes(origin) || origin.includes(rate.origin);
    const matchDestination = rate.destination.includes(destination) || destination.includes(rate.destination);
    const matchMode = !transportMode || rate.transportMode === transportMode;

    return matchOrigin && matchDestination && matchMode &&
           rate.validFrom <= new Date() && rate.validTo >= new Date();
  });
}

// 计算报价
export function calculateQuote(
  rate: FreightRate,
  chargeableWeight: number,
  volume: number
): Quote {
  let baseFreight = 0;

  // 根据运输方式计算基础运费
  if (rate.transportMode === 'sea') {
    // 海运按吨或立方米计费，取大者
    const weightTons = chargeableWeight / 1000;
    baseFreight = Math.max(weightTons, volume) * rate.baseRate;
  } else {
    // 空运按重量计费
    baseFreight = chargeableWeight * rate.baseRate;
  }

  // 计算附加费
  const quoteSurcharges: QuoteSurcharge[] = [];
  let totalSurcharges = 0;

  for (const surcharge of rate.surcharges) {
    let amount = 0;

    switch (surcharge.type) {
      case 'fixed':
        amount = surcharge.amount;
        break;
      case 'percentage':
        amount = (baseFreight * surcharge.amount) / 100;
        break;
      case 'per_ton':
        amount = (chargeableWeight / 1000) * surcharge.amount;
        break;
      case 'per_cbm':
        amount = volume * surcharge.amount;
        break;
    }

    quoteSurcharges.push({
      name: surcharge.name,
      amount: Math.round(amount * 100) / 100,
      currency: surcharge.currency
    });

    totalSurcharges += amount;
  }

  const totalAmount = baseFreight + totalSurcharges;

  // 生成报价ID
  const quoteId = `Q${Date.now()}_${rate.id}`;

  // 估算运输时间
  const transitTime = rate.transportMode === 'sea' ?
    getSeaTransitTime(rate.origin, rate.destination) :
    getAirTransitTime(rate.origin, rate.destination);

  return {
    quoteId,
    origin: rate.origin,
    destination: rate.destination,
    transportMode: rate.transportMode,
    shippingLine: rate.shippingLine,
    baseFreight: Math.round(baseFreight * 100) / 100,
    surcharges: quoteSurcharges,
    totalAmount: Math.round(totalAmount * 100) / 100,
    currency: rate.currency,
    transitTime,
    validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7天有效期
  };
}

// 估算海运时间
function getSeaTransitTime(origin: string, destination: string): string {
  const routes: { [key: string]: string } = {
    '广州-洛杉矶': '15-18天',
    '广州-纽约': '25-30天',
    '广州-汉堡': '28-35天',
  };

  const key = `${origin}-${destination}`;
  return routes[key] || '15-30天';
}

// 估算空运时间
function getAirTransitTime(origin: string, destination: string): string {
  return '3-5天'; // 空运一般都比较快
}

// 生成多个报价供比较
export function generateQuotes(
  origin: string,
  destination: string,
  chargeableWeight: number,
  volume: number,
  transportMode?: 'sea' | 'air'
): Quote[] {
  const rates = findRates(origin, destination, transportMode);
  return rates.map(rate => calculateQuote(rate, chargeableWeight, volume));
}
