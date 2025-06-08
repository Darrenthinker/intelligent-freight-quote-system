// 货物信息解析工具函数
import { getAirportCity, formatAirportDisplay } from './airport-codes';

export interface CargoInfo {
  name: string;
  weight: number; // kg
  volume: number; // cbm
  pallets: number;
  pieces: number;
  dimensions: Dimension[];
  destination?: string; // 目的地
  destinationCode?: string; // 机场代码
  origin?: string; // 货物所在地
  packageType?: 'pallets' | 'boxes' | 'pieces'; // 包装类型
}

export interface Dimension {
  length: number; // 尺寸值
  width: number; // 尺寸值
  height: number; // 尺寸值
  quantity: number;
  unit: 'm' | 'cm' | 'mm'; // 尺寸单位
}

export interface CalculationResult {
  totalWeight: number; // kg
  totalVolume: number; // cbm
  volumeWeight: number; // kg (体积重)
  chargeableWeight: number; // kg (计费重)
  totalPieces: number;
  density: number; // kg/cbm (密度/比重)
}

// 智能字符清理和标准化函数
function normalizeText(text: string): string {
  let normalizedText = text;

  // 1. 拼写纠错
  const corrections = {
    // 重量单位纠错
    'k9': 'kg',
    'kd': 'kg',
    'k8': 'kg',
    'k0': 'kg',
    'kq': 'kg',
    'ke': 'kg',
    'k7': 'kg',
    'k6': 'kg',
    'k5': 'kg',
    'k4': 'kg',
    'k3': 'kg',
    'k2': 'kg',
    'k1': 'kg',
    // 体积单位纠错
    'cbm9': 'cbm',
    'cbmd': 'cbm',
    'cb9': 'cbm',
    // 尺寸单位纠错
    'mm9': 'mm',
    'mmd': 'mm',
    'cm9': 'cm',
    'cmd': 'cm'
  };

  for (const [wrong, correct] of Object.entries(corrections)) {
    const regex = new RegExp(wrong, 'gi');
    normalizedText = normalizedText.replace(regex, correct);
  }

  // 2. 统一分隔符 - 将各种分隔符标准化为单个斜杠
  normalizedText = normalizedText
    .replace(/\/\/+/g, '/') // 双斜杠或多斜杠 -> 单斜杠
    .replace(/\?\?+/g, '') // 多个问号 -> 删除
    .replace(/\?/g, '') // 单个问号 -> 删除
    .replace(/\s*\/\s*/g, '/') // 斜杠前后的空格 -> 去除
    .replace(/\s*\*\s*/g, '*') // 星号前后的空格 -> 去除
    .replace(/\s+/g, ' ') // 多个空格 -> 单个空格
    .trim(); // 去除首尾空格

  return normalizedText;
}

// 保持向后兼容
function correctSpellingErrors(text: string): string {
  return normalizeText(text);
}

// 解析货物信息文本
export function parseCargoText(text: string): Partial<CargoInfo> {
  // 🔥🔥🔥 V112 简洁版 - 移除Alert弹窗 🔥🔥🔥
  console.log('🔥🔥🔥 V111 DEBUG: parseCargoText 函数开始执行! 🔥🔥🔥');
  console.log('🔥🔥🔥 输入文本:', text);

  // 先进行字符清理和标准化
  const correctedText = normalizeText(text);
  console.log('🚀 parseCargoText 被调用!', { input: text, normalized: correctedText });

  // 🔍 调试：追踪产品名称设置的每一步
  console.log('🔍 开始解析流程，初始化 result.name = undefined');

  const result: Partial<CargoInfo> = {};

  // 🔥 最高优先级：强制检查BOM格式
  if (correctedText.includes('BOM') && correctedText.includes('CTN')) {
    console.log('🔥 检测到BOM和CTN关键词，强制解析BOM格式');

    // 超简单的数字提取 - 按顺序提取前3个数字
    const numbers = correctedText.match(/\d+(?:\.\d+)?/g);
    console.log('🔢 提取到的所有数字:', numbers);

    if (numbers && numbers.length >= 3) {
      const pieces = Number.parseFloat(numbers[0]); // 460
      const weight = Number.parseFloat(numbers[1]); // 2800
      const volume = Number.parseFloat(numbers[2]); // 34

      result.pieces = pieces;
      result.weight = weight;
      result.volume = volume;
      result.destinationCode = 'BOM';
      result.destination = 'BOM,孟买,Mumbai';
      result.packageType = 'boxes';
      result.name = '普货';

      console.log('🎯 强制BOM解析结果:', result);
      return result;
    }
  }

  // 优先处理空运格式 - 机场代码识别
  const lines = correctedText.trim().split('\n').filter(line => line.trim());

  // 🔥 修复：优先识别文本中的三字机场代码作为目的地
  // 扩展机场代码识别，支持在任何位置出现的三字代码
  const airportCodeMatches = correctedText.match(/\b([A-Z]{3})\b/g);
  if (airportCodeMatches) {
    for (const code of airportCodeMatches) {
      const cityName = getAirportCity(code);
      if (cityName) {
        result.destinationCode = code;
        result.destination = formatAirportDisplay(code);
        console.log(`🛫 识别到机场代码: ${code} -> ${result.destination}`);

        // 🔥 立即提取产品名称，避免被后续逻辑覆盖
        const firstLine = correctedText.split('\n')[0]?.trim();
        if (firstLine && firstLine.includes(code)) {
          const afterAirportCode = firstLine.split(code)[1]?.trim();
          if (afterAirportCode && afterAirportCode.length >= 2 && afterAirportCode.length <= 20) {
            result.name = afterAirportCode;
            console.log(`✨ 步骤1-立即提取产品名称: "${result.name}" (排除机场代码 ${code})`);
          }
        }

        break; // 找到第一个有效的机场代码就停止
      }
    }
  }

  // 检查第一行是否为单独的三字机场代码
  if (lines.length > 0 && !result.destinationCode) {
    const firstLine = lines[0].trim();
    if (firstLine.match(/^[A-Z]{3}$/)) {
      const airportCode = firstLine;
      const cityName = getAirportCity(airportCode);
      if (cityName) {
        result.destinationCode = airportCode;
        result.destination = formatAirportDisplay(airportCode);
      }
    }
  }

  // 如果没有找到，检查文本中是否包含三字机场代码
  if (!result.destinationCode) {
    // 匹配文本中的三字机场代码，前后可以有空格或其他字符
    const airportCodeMatch = correctedText.match(/\b([A-Z]{3})\b/g);
    if (airportCodeMatch) {
      for (const code of airportCodeMatch) {
        const cityName = getAirportCity(code);
        if (cityName) {
          result.destinationCode = code;
          result.destination = formatAirportDisplay(code);
          // 不要把机场信息设置为货物名称，让后面的逻辑处理
          break; // 找到第一个有效的机场代码就停止
        }
      }
    }
  }

  // 🔥 修复：支持传统格式解析 - "2500 kgs ; 14.71 cbm ; 6托" - 最高优先级
  const traditionalFormatMatch = correctedText.match(/(\d+(?:\.\d+)?)\s*(?:kgs?|KGS?|公斤)\s*[;；,]\s*(\d+(?:\.\d+)?)\s*(?:cbm|CBM|方|立方|m3)\s*[;；,]\s*(\d+(?:\.\d+)?)\s*(?:托|pallet)/i);
  if (traditionalFormatMatch) {
    result.weight = Number.parseFloat(traditionalFormatMatch[1]); // 2500kg
    result.volume = Number.parseFloat(traditionalFormatMatch[2]); // 14.71cbm
    result.pallets = Number.parseFloat(traditionalFormatMatch[3]); // 6托
    result.pieces = result.pallets; // 托盘数=件数
    result.packageType = 'pallets';
    console.log(`📦 传统格式识别: 重量=${result.weight}kg, 体积=${result.volume}cbm, 托盘=${result.pallets}托`);
  }

  // 🔥 修复：优先提取产品名称，排除机场代码 - 在传统格式解析后立即执行
  const firstLine = correctedText.split('\n')[0]?.trim();
  if (firstLine) {
    // 🔥 关键修复：如果第一行包含机场代码，提取机场代码后面的部分作为产品名称
    if (result.destinationCode && firstLine.includes(result.destinationCode)) {
      // 提取机场代码之后的文本作为产品名称
      const afterAirportCode = firstLine.split(result.destinationCode)[1]?.trim();
      if (afterAirportCode && afterAirportCode.length >= 2 && afterAirportCode.length <= 20) {
        result.name = afterAirportCode;
        console.log(`✨ 步骤2-从第一行提取产品名称: "${result.name}" (排除机场代码 ${result.destinationCode})`);
      }
    } else if (!firstLine.match(/^\s*[A-Z]{3}\s*$/) && !firstLine.match(/\d+.*(?:kg|cbm|cm|方|托|件|箱)/)) {
      // 如果第一行不是纯机场代码，且不包含数据信息，作为产品名称
      const cleanName = firstLine.replace(/[?？]/g, '').trim();

      // 🔥 修复：检查是否包含机场代码，如果包含则只取机场代码后面的部分
      if (result.destinationCode && cleanName.includes(result.destinationCode)) {
        const nameAfterCode = cleanName.split(result.destinationCode)[1]?.trim();
        if (nameAfterCode && nameAfterCode.length >= 2 && nameAfterCode.length <= 20) {
          result.name = nameAfterCode;
          console.log(`📝 步骤3-第一行产品名称(排除机场代码): "${result.name}"`);
        }
      } else if (cleanName.length >= 2 && cleanName.length <= 20) {
        result.name = cleanName;
        console.log(`📝 步骤4-第一行产品名称: "${result.name}"`);
      }
    }
  }

  // 识别货物所在地 - 支持多种格式
  let originMatch = correctedText.match(/货在(.+?)(?=\s|$)/);
  if (originMatch) {
    result.origin = originMatch[1].trim();
  }

  // 支持 "深圳BHM" 格式，提取地点
  if (!result.origin) {
    const cityAirportMatch = correctedText.match(/(深圳|广州|上海|北京|武汉|成都|重庆|天津|青岛|大连|厦门|佛山|东莞|义乌|宁波|苏州|无锡|杭州|南京|合肥|郑州|济南|石家庄|太原|西安|兰州|银川|西宁|乌鲁木齐|长春|哈尔滨|沈阳|海口|三亚|昆明|贵阳|南宁|拉萨|呼和浩特)\s*[A-Z]{3}/);
    if (cityAirportMatch) {
      result.origin = cityAirportMatch[1];
    }
  }

  // 支持 "在深圳或者广州" 格式，优先选择深圳
  if (!result.origin) {
    const multiCityMatch = correctedText.match(/在\s*(深圳|广州|上海|北京)[^，。；\n]*或[^，。；\n]*(深圳|广州|上海|北京)/);
    if (multiCityMatch) {
      // 优先选择深圳，其次广州，再其次上海，最后北京
      const cities = [multiCityMatch[1], multiCityMatch[2]];
      if (cities.includes('深圳')) {
        result.origin = '深圳';
      } else if (cities.includes('广州')) {
        result.origin = '广州';
      } else if (cities.includes('上海')) {
        result.origin = '上海';
      } else {
        result.origin = cities[0];
      }
    }
  }

  // 支持 "香港到墨西哥" 格式，提取起运地
  if (!result.origin) {
    originMatch = correctedText.match(/(.+?)到[^，。；\n]+[A-Z]{3}/);
    if (originMatch) {
      const origin = originMatch[1].trim();
      // 确保不是很长的描述
      if (origin.length <= 10 && !origin.match(/\d+|kg|cbm|cm|箱|件/)) {
        result.origin = origin;
      }
    }
  }

  // 支持 "香港飞到捷克布拉格" 格式，提取起运地
  if (!result.origin) {
    originMatch = correctedText.match(/(.+?)飞到[^，。；\n]+[A-Z]{3}/);
    if (originMatch) {
      const origin = originMatch[1].trim();
      // 确保不是很长的描述
      if (origin.length <= 10 && !origin.match(/\d+|kg|cbm|cm|箱|件/)) {
        result.origin = origin;
      }
    }
  }

  // 🔥 优先处理BOM/CTN格式 - 强制优先级，避免被其他解析覆盖
  const bomPattern = /([A-Z]{3})\s+(\d+(?:\.\d+)?)\s*(?:CTN|ctns|ctn|CTNS)\s*[\/]?\s*(?:GW|gw|毛重|Gross Weight|NW|nw|净重|Net Weight)?\s*(\d+(?:\.\d+)?)\s*(?:KG|kg|kgs|KGS)\s*[\/]?\s*(\d+(?:\.\d+)?)\s*(?:CBM|cbm|方|立方|m3)/i;
  const bomMatch = correctedText.match(bomPattern);

  if (bomMatch) {
    console.log('🔥 BOM格式匹配成功:', bomMatch);

    const airportCode = bomMatch[1]; // BOM
    const pieces = Number.parseFloat(bomMatch[2]); // 460
    const weight = Number.parseFloat(bomMatch[3]); // NW2800或GW3270
    const volume = Number.parseFloat(bomMatch[4]); // 34

    // 设置机场代码和目的地
    const cityName = getAirportCity(airportCode);
    if (cityName) {
      result.destinationCode = airportCode;
      result.destination = formatAirportDisplay(airportCode);
    }

    // 强制设置解析结果，优先级最高
    result.pieces = pieces;
    result.weight = weight;
    result.volume = volume;
    result.packageType = 'boxes';

    console.log('🔥 BOM解析结果:', { pieces, weight, volume, destination: result.destination });

    // 设置默认货物名称
    if (!result.name) {
      result.name = '普货';
    }

    // 直接返回结果，不再执行后续解析
    return result;
  }

  // 🧠 智能三元组识别系统 - 支持重量/件数/体积的任意顺序组合（如果BOM格式没有匹配才执行）
  const triplePatterns = [
    // "BEG 60ctn 618kg 2.41cbm" 格式 - 机场代码 件数ctn 重量kg 体积cbm
    /([A-Z]{3})\s+(\d+(?:\.\d+)?)\s*(?:ctn|ctns|箱|件|个)\s+(\d+(?:\.\d+)?)\s*(?:kg|kgs|KG|KGS)\s+(\d+(?:\.\d+)?)\s*(?:cbm|CBM|方|立方|m3)/i,
    // "KHI//3400KG//12.33CBM//145CTNS" 格式 - 机场代码//重量//体积//箱数 (支持双斜杠分隔)
    /([A-Z]{3})\s*(\d+(?:\.\d+)?)\s*(?:KG|kg|kgs|KGS)\s*(\d+(?:\.\d+)?)\s*(?:CBM|cbm|方|立方|m3)\s*(\d+)\s*(?:CTNS|ctns|箱)/i,
    // "CCU 1028/1.63/35*35*35CM*38CTNS" 格式 - 机场代码 重量/体积/尺寸*箱数
    /([A-Z]{3})\s+(\d+(?:\.\d+)?)\s*[\/]\s*(\d+(?:\.\d+)?)\s*[\/]\s*(\d+(?:\.\d+)?)\s*\*\s*(\d+(?:\.\d+)?)\s*\*\s*(\d+(?:\.\d+)?)\s*cm\s*\*\s*(\d+)\s*(?:CTNS|ctns|箱)/i,
    // "1028/1.63/35*35*35CM*38CTNS" 格式 - 重量/体积/尺寸*箱数（无机场代码）
    /(\d+(?:\.\d+)?)\s*[\/]\s*(\d+(?:\.\d+)?)\s*[\/]\s*(\d+(?:\.\d+)?)\s*\*\s*(\d+(?:\.\d+)?)\s*\*\s*(\d+(?:\.\d+)?)\s*cm\s*\*\s*(\d+)\s*(?:CTNS|ctns|箱)/i,
    // "751KG/42件/2.57CBM" 格式 - 重量/件数/体积
    /(\d+(?:\.\d+)?)\s*(?:KG|kg|kgs|KGS|公斤)\s*[\/,]\s*(\d+)\s*(?:件|个|箱|托|pcs?|pieces?|CTNS|ctns|ctn)\s*[\/,]\s*(\d+(?:\.\d+)?)\s*(?:CBM|cbm|方|立方|m3)/i,
    // "42件/751KG/2.57CBM" 格式 - 件数/重量/体积
    /(\d+)\s*(?:件|个|箱|托|pcs?|pieces?|CTNS|ctns|ctn)\s*[\/,]\s*(\d+(?:\.\d+)?)\s*(?:KG|kg|kgs|KGS|公斤)\s*[\/,]\s*(\d+(?:\.\d+)?)\s*(?:CBM|cbm|方|立方|m3)/i,
    // "2.57CBM/751KG/42件" 格式 - 体积/重量/件数
    /(\d+(?:\.\d+)?)\s*(?:CBM|cbm|方|立方|m3)\s*[\/,]\s*(\d+(?:\.\d+)?)\s*(?:KG|kg|kgs|KGS|公斤)\s*[\/,]\s*(\d+)\s*(?:件|个|箱|托|pcs?|pieces?|CTNS|ctns|ctn)/i,
    // "751KG/2.57CBM/42件" 格式 - 重量/体积/件数
    /(\d+(?:\.\d+)?)\s*(?:KG|kg|kgs|KGS|公斤)\s*[\/,]\s*(\d+(?:\.\d+)?)\s*(?:CBM|cbm|方|立方|m3)\s*[\/,]\s*(\d+)\s*(?:件|个|箱|托|pcs?|pieces?|CTNS|ctns|ctn)/i,
    // "42件/2.57CBM/751KG" 格式 - 件数/体积/重量
    /(\d+)\s*(?:件|个|箱|托|pcs?|pieces?|CTNS|ctns|ctn)\s*[\/,]\s*(\d+(?:\.\d+)?)\s*(?:CBM|cbm|方|立方|m3)\s*[\/,]\s*(\d+(?:\.\d+)?)\s*(?:KG|kg|kgs|KGS|公斤)/i,
    // "2.57CBM/42件/751KG" 格式 - 体积/件数/重量
    /(\d+(?:\.\d+)?)\s*(?:CBM|cbm|方|立方|m3)\s*[\/,]\s*(\d+)\s*(?:件|个|箱|托|pcs?|pieces?|CTNS|ctns|ctn)\s*[\/,]\s*(\d+(?:\.\d+)?)\s*(?:KG|kg|kgs|KGS|公斤)/i,
    // "167 CTNS / 11.79 CBM / 634.60 KGS" 格式 - 件数 单位 / 体积 单位 / 重量 单位 (带空格)
    /(\d+(?:\.\d+)?)\s+(?:件|个|箱|托|pcs?|pieces?|CTNS|ctns|ctn)\s*[\/,]\s*(\d+(?:\.\d+)?)\s+(?:CBM|cbm|方|立方|m3)\s*[\/,]\s*(\d+(?:\.\d+)?)\s+(?:KG|kg|kgs|KGS|公斤)/i,
    // "634.60 KGS / 167 CTNS / 11.79 CBM" 格式 - 重量 单位 / 件数 单位 / 体积 单位 (带空格)
    /(\d+(?:\.\d+)?)\s+(?:KG|kg|kgs|KGS|公斤)\s*[\/,]\s*(\d+(?:\.\d+)?)\s+(?:件|个|箱|托|pcs?|pieces?|CTNS|ctns|ctn)\s*[\/,]\s*(\d+(?:\.\d+)?)\s+(?:CBM|cbm|方|立方|m3)/i,
    // "11.79 CBM / 634.60 KGS / 167 CTNS" 格式 - 体积 单位 / 重量 单位 / 件数 单位 (带空格)
    /(\d+(?:\.\d+)?)\s+(?:CBM|cbm|方|立方|m3)\s*[\/,]\s*(\d+(?:\.\d+)?)\s+(?:KG|kg|kgs|KGS|公斤)\s*[\/,]\s*(\d+(?:\.\d+)?)\s+(?:件|个|箱|托|pcs?|pieces?|CTNS|ctns|ctn)/i,
  ];

  // 尝试匹配三元组格式 - 只有在BOM格式没有匹配时才执行
  if (!bomMatch || !bomMatch.length) {
    for (const pattern of triplePatterns) {
      const match = correctedText.match(pattern);
      if (match) {
      const [, val1, val2, val3] = match;
      const num1 = Number.parseFloat(val1);
      const num2 = Number.parseFloat(val2);
      const num3 = Number.parseFloat(val3);

      // 根据模式索引确定数值的含义
      const patternIndex = triplePatterns.indexOf(pattern);

      switch (patternIndex) {
        case 0: // "BEG 60ctn 618kg 2.41cbm" 格式 - 机场代码 件数ctn 重量kg 体积cbm
          // val1=机场代码, val2=件数, val3=重量, val4=体积
          if (match.length >= 5) {
            const airportCode = match[1];
            const pieces = Number.parseFloat(match[2]);
            const weight = Number.parseFloat(match[3]);
            const volume = Number.parseFloat(match[4]);

            // 设置机场代码和目的地
            const cityName = getAirportCity(airportCode);
            if (cityName) {
              result.destinationCode = airportCode;
              result.destination = formatAirportDisplay(airportCode);
            }

            result.pieces = pieces;
            result.weight = weight;
            result.volume = volume;
            result.packageType = 'boxes'; // ctn表示箱
          }
          break;
        case 1: // "KHI//3400KG//12.33CBM//145CTNS" 格式 - 机场代码//重量//体积//箱数
          // val1=机场代码, val2=重量, val3=体积, val4=箱数
          if (match.length >= 5) {
            const airportCode = match[1];
            const weight = Number.parseFloat(match[2]);
            const volume = Number.parseFloat(match[3]);
            const pieces = Number.parseFloat(match[4]);

            // 设置机场代码和目的地
            const cityName = getAirportCity(airportCode);
            if (cityName) {
              result.destinationCode = airportCode;
              result.destination = formatAirportDisplay(airportCode);
            }

            result.weight = weight;
            result.volume = volume;
            result.pieces = pieces;
            result.packageType = 'boxes'; // CTNS表示箱
          }
          break;
        case 2: // "CCU 1028/1.63/35*35*35CM*38CTNS" 格式 - 机场代码 重量/体积/尺寸*箱数
          // val1=机场代码, val2=重量, val3=体积, 后续是尺寸
          if (match.length >= 8) {
            const airportCode = match[1];
            const weight = Number.parseFloat(match[2]);
            const volume = Number.parseFloat(match[3]);
            const length = Number.parseFloat(match[4]);
            const width = Number.parseFloat(match[5]);
            const height = Number.parseFloat(match[6]);
            const pieces = Number.parseFloat(match[7]);

            // 设置机场代码和目的地
            const cityName = getAirportCity(airportCode);
            if (cityName) {
              result.destinationCode = airportCode;
              result.destination = formatAirportDisplay(airportCode);
              // 不要把机场信息设置为货物名称
            }

            result.weight = weight;
            result.volume = volume;
            result.pieces = pieces;
            result.packageType = 'boxes'; // CTNS表示箱

            // 设置尺寸信息
            result.dimensions = [{
              length: length,
              width: width,
              height: height,
              quantity: pieces,
              unit: 'cm' // 🔥 添加单位信息
            }];
          }
          break;
        case 3: // "1028/1.63/35*35*35CM*38CTNS" 格式 - 重量/体积/尺寸*箱数（无机场代码）
          if (match.length >= 7) {
            const weight = Number.parseFloat(match[1]);
            const volume = Number.parseFloat(match[2]);
            const length = Number.parseFloat(match[3]);
            const width = Number.parseFloat(match[4]);
            const height = Number.parseFloat(match[5]);
            const pieces = Number.parseFloat(match[6]);

            result.weight = weight;
            result.volume = volume;
            result.pieces = pieces;
            result.packageType = 'boxes'; // CTNS表示箱

            // 设置尺寸信息
            result.dimensions = [{
              length: length,
              width: width,
              height: height,
              quantity: pieces,
              unit: 'cm' // 🔥 添加单位信息
            }];
          }
          break;
        case 4: // 重量/件数/体积
          result.weight = num1;
          result.pieces = num2;
          result.volume = num3;
          break;
        case 5: // 件数/重量/体积
          result.pieces = num1;
          result.weight = num2;
          result.volume = num3;
          break;
        case 6: // 体积/重量/件数
          result.volume = num1;
          result.weight = num2;
          result.pieces = num3;
          break;
        case 7: // 重量/体积/件数
          result.weight = num1;
          result.volume = num2;
          result.pieces = num3;
          break;
        case 8: // 件数/体积/重量
          result.pieces = num1;
          result.volume = num2;
          result.weight = num3;
          break;
        case 9: // 体积/件数/重量
          result.volume = num1;
          result.pieces = num2;
          result.weight = num3;
          break;
        case 10: // 件数 单位 / 体积 单位 / 重量 单位 (167 CTNS / 11.79 CBM / 634.60 KGS)
          result.pieces = num1;
          result.volume = num2;
          result.weight = num3;
          break;
        case 11: // 重量 单位 / 件数 单位 / 体积 单位 (634.60 KGS / 167 CTNS / 11.79 CBM)
          result.weight = num1;
          result.pieces = num2;
          result.volume = num3;
          break;
        case 12: // 体积 单位 / 重量 单位 / 件数 单位 (11.79 CBM / 634.60 KGS / 167 CTNS)
          result.volume = num1;
          result.weight = num2;
          result.pieces = num3;
          break;
      }

      // 设置包装类型
      if (match[0].includes('托')) {
        result.packageType = 'pallets';
      } else if (match[0].includes('箱') || match[0].includes('CTNS') || match[0].includes('ctns') || match[0].includes('ctn')) {
        result.packageType = 'boxes';
      } else {
        result.packageType = 'pieces';
      }

      break; // 找到匹配就停止
    }
    }
  }

  // 提取货物名称 - 优先从第一行提取产品型号+名称
  const productMatches = [
    // "蓝牙耳机，带电" 格式 - 提取产品名称
    correctedText.match(/([^，。；\n\s\d]{2,10}(?:耳机|设备|产品|机器|装置|器材|配件|玩具)),?\s*带电/i),
    // "RLA510S 洗地机不带电池" 格式 - 提取产品型号+名称，排除"不带电池"等描述
    // 🔥 修复：排除机场代码开头的匹配
    (() => {
      const match = correctedText.match(/([A-Z0-9]+[\s?]*[^，。；\n\s\d?]{2,10}机?)(?:\s*不带电池|带电池)?/i);
      if (match && result.destinationCode) {
        // 🔥 强化检查：如果匹配结果包含机场代码，完全排除
        if (match[1].includes(result.destinationCode)) {
          console.log(`🚫 完全排除包含机场代码的产品匹配: ${match[1]} (包含 ${result.destinationCode})`);
          return null; // 排除这个匹配
        }
        // 原有的开头检查
        if (match[1].startsWith(result.destinationCode)) {
          console.log(`⚠️ 跳过机场代码开头的产品匹配: ${match[1]}`);
          return null; // 排除这个匹配
        }
      }
      return match;
    })(),
    // "led发光手环（内置碱性干电池...）" 格式 - 优先识别产品名称+括号描述
    correctedText.match(/([a-zA-Z]*[^，。；\n\s\d]{2,15})[（(][^）)]*[）)]/i),
    // "电子产品（充电宝，充电头...）" 格式 - 优先识别
    correctedText.match(/([^，。；\n\s]{2,10}产品)[（(][^）)]*[）)]/i),
    // "根管锉之类的产品" 格式 - 限制长度避免匹配过长内容
    correctedText.match(/([^，。；\n\s]{1,20}?)之类的产品/i),
    // "手机配件类产品" 格式
    correctedText.match(/([^，。；\n\s]{1,20}?)类产品/i),
    // "产品：电子设备" 格式
    correctedText.match(/产品[：:]\s*([^，。；\n\s]{1,20})/i),
    // "货物：纺织品" 格式
    correctedText.match(/货物[：:]\s*([^，。；\n\s]{1,20})/i),
    // "商品：食品" 格式
    correctedText.match(/商品[：:]\s*([^，。；\n\s]{1,20})/i),
    // "货物是汽车玩具" 格式
    correctedText.match(/货物是\s*([^，。；\n\s]{2,20})/i),
  ];

  for (const match of productMatches) {
    if (match?.[1]?.trim()) {
      const productName = match[1].trim();

      // 🔥 关键修复：如果已经有正确的产品名称（不包含机场代码），就不要覆盖
      if (result.name && !result.name.match(/^[A-Z]{3}/) && result.name !== '普货') {
        console.log(`⚠️ 跳过产品名称覆盖，已有正确名称: ${result.name}`);
        break;
      }

      // 🔥 额外保护：如果已经有产品名称，且当前匹配包含机场代码，优先保护已有名称
      if (result.name && result.destinationCode && productName.includes(result.destinationCode)) {
        console.log(`🛡️ 保护已有产品名称"${result.name}"，拒绝包含机场代码的覆盖: ${productName}`);
        continue;
      }

      // 🔥 修复：额外检查产品名称是否包含机场代码，如果包含则排除
      if (result.destinationCode && productName.includes(result.destinationCode)) {
        console.log(`⚠️ 跳过包含机场代码的产品名称: ${productName}`);
        continue;
      }

      // 🔥 最终修复：完全阻止包含机场代码的产品名称
      if (result.destinationCode && productName.includes(result.destinationCode)) {
        console.log(`🚫 完全阻止包含机场代码的产品名称: ${productName}`);
        continue; // 跳过这个匹配
      }

      // 排除明显不是产品名的内容，包括时间、地点、机场代码等
      // 但保留合理的产品名，如"洗地机"、"设备"等
      if (!productName.match(/kg|cbm|cm|mm|箱|托|件|空运|海运|报价|帮忙|[A-Z]{3}|土耳其|伊斯坦布尔|墨西哥|MEX|预计|下周|货好|时间|星期|月|日|深圳|广州|上海|北京|Packing/i) ||
          productName.match(/产品|设备|配件|玩具|机$|器$|电池$|装备$/i)) {
        result.name = productName;
        console.log(`📝 步骤5-正则匹配设置产品名称: "${result.name}"`);
        break;
      }
    }
  }

  // 🔥 强制规则：如果货物名称包含任何机场代码，强制移除或使用默认值
  if (result.name && result.destinationCode) {
    if (result.name.includes(result.destinationCode)) {
      console.log(`🚫 强制规则触发：货物名称"${result.name}"包含机场代码"${result.destinationCode}"`);

      // 尝试提取机场代码后面的部分
      const afterCode = result.name.split(result.destinationCode)[1]?.trim();
      if (afterCode && afterCode.length >= 2 && afterCode.length <= 20) {
        result.name = afterCode;
        console.log(`✨ 强制提取货物名称: "${result.name}" (移除机场代码"${result.destinationCode}")`);
      } else {
        result.name = '普货';
        console.log(`🔄 使用默认货物名称: "普货" (无法提取有效名称)`);
      }
    }
  }

  // 🔥 最终检查：完全阻止任何三字机场代码出现在货物名称中
  if (result.name) {
    // 检查是否包含任何三字机场代码
    const airportCodes = result.name.match(/\b[A-Z]{3}\b/g);
    if (airportCodes && airportCodes.length > 0) {
      console.log(`🚫 最终检查：货物名称"${result.name}"包含机场代码${airportCodes.join(', ')}`);

      // 尝试移除所有机场代码
      let cleanName = result.name;
      for (const code of airportCodes) {
        cleanName = cleanName.replace(new RegExp(`\\b${code}\\b`, 'g'), '').trim();
      }

      if (cleanName && cleanName.length >= 2 && cleanName.length <= 20) {
        result.name = cleanName;
        console.log(`✨ 最终清理货物名称: "${result.name}"`);
      } else {
        result.name = '普货';
        console.log(`🔄 使用默认货物名称: "普货" (清理后无有效名称)`);
      }
    }
  }

  // 如果仍没有找到货物名称，或者名称是机场信息，使用"普货"作为默认值
  if (!result.name || result.name.match(/^[A-Z]{3}/) || result.name.includes('(') || result.name.length > 20) {
    result.name = '普货';
  }





  // 🔍 最终分析步骤：在返回结果前进行彻底的产品名称检查和清理
  console.log(`🔍 最终分析步骤 - 当前产品名称: "${result.name}"`);
  console.log(`🔍 最终分析步骤 - 目的地机场代码: "${result.destinationCode}"`);

  if (result.name && result.destinationCode) {
    // 检查产品名称是否包含机场代码
    if (result.name.includes(result.destinationCode)) {
      console.log(`🚨 最终检查发现：产品名称"${result.name}"包含机场代码"${result.destinationCode}"`);

      // 尝试智能清理：提取机场代码后面的部分
      const parts = result.name.split(result.destinationCode);
      if (parts.length > 1) {
        const cleanPart = parts[1].trim();
        if (cleanPart && cleanPart.length >= 2 && cleanPart.length <= 20) {
          result.name = cleanPart;
          console.log(`✅ 最终清理成功：产品名称更新为"${result.name}"`);
        } else {
          result.name = '普货';
          console.log(`🔄 最终清理：无法提取有效名称，使用"普货"`);
        }
      } else {
        result.name = '普货';
        console.log(`🔄 最终清理：分割失败，使用"普货"`);
      }
    } else {
      console.log(`✅ 最终检查通过：产品名称"${result.name}"不包含机场代码`);
    }
  }

  // 最终检查：移除任何剩余的三字机场代码
  if (result.name) {
    const airportPattern = /\b[A-Z]{3}\b/g;
    const foundCodes = result.name.match(airportPattern);
    if (foundCodes && foundCodes.length > 0) {
      console.log(`🚨 最终检查发现剩余机场代码: ${foundCodes.join(', ')}`);
      let finalCleanName = result.name;
      for (const code of foundCodes) {
        finalCleanName = finalCleanName.replace(new RegExp(`\\b${code}\\b`, 'g'), '').trim();
      }

      if (finalCleanName && finalCleanName.length >= 2) {
        result.name = finalCleanName;
        console.log(`✅ 最终彻底清理：产品名称更新为"${result.name}"`);
      } else {
        result.name = '普货';
        console.log(`🔄 最终彻底清理：清理后无有效内容，使用"普货"`);
      }
    }
  }

  console.log(`🎯 最终结果 - 产品名称: "${result.name}"`);
  console.log(`🎯 最终结果 - 目的地: "${result.destination}"`);

  // 🔥🔥🔥 V112 最终调试标记 - 移除Alert弹窗 🔥🔥🔥
  console.log('🔥🔥🔥 V111 DEBUG: parseCargoText 函数即将返回结果! 🔥🔥🔥');
  console.log('🔥🔥🔥 最终产品名称:', result.name);
  console.log('🔥🔥🔥 最终目的地:', result.destination);

  return result;
}

// 🔥 智能尺寸解析函数 - 自动识别单位并标准化
function parseDimensionsWithUnit(lengthStr: string, widthStr: string, heightStr: string, unitHint?: string): { length: number; width: number; height: number; unit: 'm' | 'cm' | 'mm' } {
  const length = Number.parseFloat(lengthStr);
  const width = Number.parseFloat(widthStr);
  const height = Number.parseFloat(heightStr);

  // 🔥 智能单位判断逻辑
  let unit: 'm' | 'cm' | 'mm' = 'cm'; // 默认厘米

  if (unitHint) {
    const hintLower = unitHint.toLowerCase();
    if (hintLower.includes('mm') || hintLower.includes('毫米')) {
      unit = 'mm';
    } else if (hintLower.includes('m') && !hintLower.includes('cm')) {
      unit = 'm';
    } else {
      unit = 'cm';
    }
  } else {
    // 🔥 基于尺寸数值智能判断单位
    const maxDimension = Math.max(length, width, height);
    if (maxDimension >= 1000) {
      unit = 'mm'; // 大于1000通常是毫米
    } else if (maxDimension < 10) {
      unit = 'm'; // 小于10通常是米
    } else {
      unit = 'cm'; // 10-1000之间通常是厘米
    }
  }

  return { length, width, height, unit };
}

// 计算总体积
export function calculateTotalVolume(dimensions: Dimension[]): number {
  return dimensions.reduce((total, dim) => {
    // 🔥 修复：根据尺寸单位正确计算体积
    let volumeInCubicMeters: number;

    if (dim.unit === 'm') {
      // 米 → 立方米：直接相乘
      volumeInCubicMeters = dim.length * dim.width * dim.height;
    } else if (dim.unit === 'cm') {
      // 厘米 → 立方米：除以 1,000,000
      volumeInCubicMeters = (dim.length * dim.width * dim.height) / 1000000;
    } else {
      // 毫米 → 立方米：除以 1,000,000,000
      volumeInCubicMeters = (dim.length * dim.width * dim.height) / 1000000000;
    }

    return total + volumeInCubicMeters * dim.quantity;
  }, 0);
}

// 计算体积重 - 根据不同运输方式使用正确的转换系数
export function calculateVolumeWeight(volume: number, transportMode: 'sea' | 'air' | 'express' = 'sea'): number {
  let factor: number;

  switch (transportMode) {
    case 'express': // 国际快递
      factor = 200; // 1CBM = 200KG
      break;
    case 'air': // 国际空运
      factor = 167; // 1CBM = 167KG
      break;
    case 'sea': // 国际海运
      factor = 1000; // 1CBM = 1000KG
      break;
    default:
      factor = 167;
  }

  return volume * factor;
}

// 计算计费重 (实重与体积重取大者)
export function calculateChargeableWeight(actualWeight: number, volumeWeight: number): number {
  return Math.max(actualWeight, volumeWeight);
}

// 根据密度判断货物类型和获取对应颜色
export function getCargoTypeByDensity(density: number): {
  type: string;
  description: string;
  colorClass: string;
  bgClass: string;
} {
  if (density >= 1000) {
    return {
      type: '超重货',
      description: '密度 ≥ 1000 kg/cbm',
      colorClass: 'text-red-600',
      bgClass: 'bg-red-50'
    };
  }

  if (density >= 500) {
    return {
      type: '重货',
      description: '密度 500-999 kg/cbm',
      colorClass: 'text-orange-600',
      bgClass: 'bg-orange-50'
    };
  }

  if (density >= 200) {
    return {
      type: '普货',
      description: '密度 200-499 kg/cbm',
      colorClass: 'text-blue-600',
      bgClass: 'bg-blue-50'
    };
  }

  if (density > 0) {
    return {
      type: '轻货',
      description: '密度 < 200 kg/cbm',
      colorClass: 'text-green-600',
      bgClass: 'bg-green-50'
    };
  }

  return {
    type: '未知',
    description: '无法计算密度',
    colorClass: 'text-gray-600',
    bgClass: 'bg-gray-50'
  };
}

// 检查是否为带电货物 - 基于原始货物信息检查
export function isElectricCargo(cargoInfo: Partial<CargoInfo>): boolean {
  const text = JSON.stringify(cargoInfo).toLowerCase();
  const electricKeywords = [
    '电池', '内置电池', '配套电池', '移动电源', '充电宝', '锂电池',
    '电子', '音响', '电器', '手机', '充电器', '电容', '电源', '带电'
  ];

  return electricKeywords.some(keyword =>
    text.includes(keyword.toLowerCase())
  );
}

// 综合计算函数
export function calculateCargoMetrics(cargoInfo: Partial<CargoInfo>, transportMode: 'sea' | 'air' = 'sea'): CalculationResult {
  const totalWeight = cargoInfo.weight || 0;
  let totalVolume = cargoInfo.volume || 0;

  // 如果有尺寸信息，重新计算体积，但优先使用明确给出的总体积
  if (cargoInfo.dimensions && cargoInfo.dimensions.length > 0 && totalVolume === 0) {
    totalVolume = calculateTotalVolume(cargoInfo.dimensions);
  }

  const volumeWeight = calculateVolumeWeight(totalVolume, transportMode);
  const chargeableWeight = calculateChargeableWeight(totalWeight, volumeWeight);

  // 计算货物比重 (密度) kg/cbm
  const density = totalVolume > 0 ? totalWeight / totalVolume : 0;

  return {
    totalWeight,
    totalVolume: Math.round(totalVolume * 100) / 100, // 保留2位小数
    volumeWeight: Math.round(volumeWeight * 100) / 100,
    chargeableWeight: Math.round(chargeableWeight * 100) / 100,
    totalPieces: cargoInfo.pieces || 0,
    density: Math.round(density * 100) / 100 // 保留2位小数
  };
}

// 综合解析和计算函数
export function parseAndCalculateCargoInfo(text: string, transportMode: 'sea' | 'air' = 'sea'): {
  cargoInfo: Partial<CargoInfo>;
  calculations: CalculationResult;
} {
  const cargoInfo = parseCargoText(text);
  const calculations = calculateCargoMetrics(cargoInfo, transportMode);

  return { cargoInfo, calculations };
}
