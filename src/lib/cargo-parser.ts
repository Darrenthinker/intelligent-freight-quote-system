/*
 * 国际货运重量术语说明：
 *
 * GW (Gross Weight) - 毛重：货物连同包装的总重量
 * NW (Net Weight) - 净重：仅指货物本身的重量，不包括包装
 * CW (Chargeable Weight) - 计费重：用于计算运费的重量，通常取实重和体积重的较大值
 *
 * 在国际贸易和物流中，这三种重量都很重要：
 * - 毛重用于承运和搬运计算
 * - 净重用于海关申报和贸易统计
 * - 计费重用于运费计算
 */

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
  length: number; // cm
  width: number; // cm
  height: number; // cm
  quantity: number;
  unit: 'm' | 'cm' | 'mm'; // 单位：米、厘米、毫米
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
  // 先进行字符清理和标准化
  const correctedText = normalizeText(text);

  const result: Partial<CargoInfo> = {};

  // 优先处理空运格式 - 机场代码识别
  const lines = correctedText.trim().split('\n').filter(line => line.trim());

  // 检查第一行是否为单独的三字机场代码
  if (lines.length > 0) {
    const firstLine = lines[0].trim();
    if (firstLine.match(/^[A-Z]{3}$/)) {
      const airportCode = firstLine;
      const cityName = getAirportCity(airportCode);
      if (cityName) {
        result.destinationCode = airportCode;
        result.destination = formatAirportDisplay(airportCode);
        // 不要把机场信息设置为货物名称
      }
    }
  }

  // 如果没有找到，检查文本中是否包含三字机场代码
  // 🔥 修复：只在明确的空运格式下才识别机场代码，避免误识别产品名称
  if (!result.destinationCode) {
    // 只有在出现空运关键词或明确的机场格式时才匹配三字代码
    const hasAirShippingContext = correctedText.match(/空运|飞|机场|到[A-Z]{3}|[A-Z]{3}$|^[A-Z]{3}\s/);

    if (hasAirShippingContext) {
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
  }

  // 识别货物所在地 - 支持多种格式
  let originMatch = correctedText.match(/货在(.+?)(?=\s|$)/);
  if (originMatch) {
    result.origin = originMatch[1].trim();
  }

  // 支持英文FOB格式识别起运地 - "FOB NINGBO"
  if (!result.origin) {
    const fobMatch = correctedText.match(/FOB\s+([A-Z]+)/i);
    if (fobMatch) {
      const englishCity = fobMatch[1].toLowerCase();
      const cityMapping: { [key: string]: string } = {
        'ningbo': '宁波',
        'shanghai': '上海',
        'shenzhen': '深圳',
        'guangzhou': '广州',
        'beijing': '北京',
        'tianjin': '天津',
        'qingdao': '青岛',
        'dalian': '大连',
        'xiamen': '厦门',
        'yiwu': '义乌',
        'hangzhou': '杭州',
        'suzhou': '苏州',
        'nanjing': '南京'
      };

      if (cityMapping[englishCity]) {
        result.origin = cityMapping[englishCity];
      }
    }
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

  // 🔥 修复：支持传统格式解析 - "2500 kgs ; 14.71 cbm ; 6托"
  const traditionalFormatMatch = correctedText.match(/(\d+(?:\.\d+)?)\s*(?:kgs?|KGS?|公斤)\s*[;；,]\s*(\d+(?:\.\d+)?)\s*(?:cbm|CBM|方|立方|m3)\s*[;；,]\s*(\d+(?:\.\d+)?)\s*(?:托|pallet)/i);
  if (traditionalFormatMatch) {
    result.weight = Number.parseFloat(traditionalFormatMatch[1]); // 2500kg
    result.volume = Number.parseFloat(traditionalFormatMatch[2]); // 14.71cbm
    result.pallets = Number.parseFloat(traditionalFormatMatch[3]); // 6托
    result.pieces = result.pallets; // 托盘数=件数
    result.packageType = 'pallets';
  }

  // 🔥 V57修复：支持特殊重量+托盘格式 - "重量：23托 重量:9765 KGS"
  const specialWeightPalletMatch = correctedText.match(/重量[：:]\s*(\d+(?:\.\d+)?)\s*托\s+重量[：:]\s*(\d+(?:\.\d+)?)\s*(?:KG|kg|kgs|KGS)/i);
  if (specialWeightPalletMatch) {
    result.pallets = Number.parseFloat(specialWeightPalletMatch[1]); // 23托
    result.weight = Number.parseFloat(specialWeightPalletMatch[2]); // 9765kg
    result.pieces = result.pallets; // 托盘数=件数
    result.packageType = 'pallets';
  }

  // 🔥 V57修复：支持单独的体积标注 - "体积：42 CBM"
  if (!result.volume) {
    const volumeMatch = correctedText.match(/体积[：:]\s*(\d+(?:\.\d+)?)\s*(?:CBM|cbm|方|立方|m3)/i);
    if (volumeMatch) {
      result.volume = Number.parseFloat(volumeMatch[1]);
    }
  }

  // 处理包装格式 - 支持 "Packing size: 1300*600*1150mm, Packing Weight: 110KG" 格式
  // 同时支持缺少单位的情况，如 "Packing Weight:130"
  const packingLines = correctedText.split('\n');
  const dimensions: Dimension[] = [];
  let totalPackingWeight = 0;
  let packingCount = 0;

  for (let i = 0; i < packingLines.length; i++) {
    const currentLine = packingLines[i];
    const nextLine = i + 1 < packingLines.length ? packingLines[i + 1] : '';

    // 匹配包装尺寸
    const sizeMatch = currentLine.match(/Packing[\s?]*size[\s?：:]*(\d+)\s*\*\s*(\d+)\s*\*\s*(\d+)\s*mm/i);
    if (sizeMatch) {
      let weight = 0;

      // 在当前行查找重量
      const weightInSameLine = currentLine.match(/Packing[\s?]*Weight[\s?：:]*(\d+(?:\.\d+)?)[\s]*(?:KG|kg)?/i);
      if (weightInSameLine) {
        weight = Number.parseFloat(weightInSameLine[1]);
      } else {
        // 在下一行查找重量
        const weightInNextLine = nextLine.match(/Packing[\s?]*Weight[\s?：:]*(\d+(?:\.\d+)?)[\s]*(?:KG|kg)?/i);
        if (weightInNextLine) {
          weight = Number.parseFloat(weightInNextLine[1]);
        }
      }

      if (weight > 0) {
        totalPackingWeight += weight;
        packingCount++;

        const length = Number.parseFloat(sizeMatch[1]) / 10; // mm转cm
        const width = Number.parseFloat(sizeMatch[2]) / 10;
        const height = Number.parseFloat(sizeMatch[3]) / 10;
        const unit = 'cm'; // 默认厘米
        dimensions.push({
          length: length,
          width: width,
          height: height,
          quantity: 1, // 每个包装1件
          unit: unit
        });
      }
    }
  }

  if (totalPackingWeight > 0) {
    result.weight = totalPackingWeight;
  }

  if (packingCount > 0) {
    result.pieces = packingCount; // 包装数量作为件数
    result.packageType = 'pieces'; // 设置包装类型为件
  }

  if (dimensions.length > 0) {
    result.dimensions = dimensions;
  }

  // 🔥 修复：传统格式多尺寸解析 - 优先级高于三元组
  // 先检查是否有传统格式的多尺寸行
  if (!result.dimensions || result.dimensions.length === 0) {
    const traditionalSizeLines = correctedText.split('\n').filter(line => {
      // 匹配纯尺寸行：数字x数字x数字 单位
      return line.trim().match(/^\s*(\d+(?:\.\d+)?)\s*[x×*]\s*(\d+(?:\.\d+)?)\s*[x×*]\s*(\d+(?:\.\d+)?)\s*(?:cm|CM|mm|MM)?\s*$/);
    });

    if (traditionalSizeLines.length > 0) {
      const newDimensions: Dimension[] = [];

      for (const line of traditionalSizeLines) {
        const sizeMatch = line.trim().match(/(\d+(?:\.\d+)?)\s*[x×*]\s*(\d+(?:\.\d+)?)\s*[x×*]\s*(\d+(?:\.\d+)?)\s*(?:cm|CM|mm|MM)?\s*$/);
        if (sizeMatch) {
          const length = Number.parseFloat(sizeMatch[1]);
          const width = Number.parseFloat(sizeMatch[2]);
          const height = Number.parseFloat(sizeMatch[3]);

          // 智能单位判断
          let unit: 'm' | 'cm' | 'mm' = 'cm';
          const maxDimension = Math.max(length, width, height);
          if (maxDimension >= 1000) {
            unit = 'mm';
          } else if (maxDimension < 10) {
            unit = 'm';
          }

          newDimensions.push({
            length: length,
            width: width,
            height: height,
            quantity: 1, // 每行代表1个尺寸
            unit: unit
          });
        }
      }

      if (newDimensions.length > 0) {
        result.dimensions = newDimensions;
        // 不要覆盖已有的件数，传统格式的件数通常来自托盘数
        if (!result.packageType) {
          result.packageType = 'pieces';
        }
      }
    }
  }

  // 🔥 V57修复：预解析三元组数据（避免被尺寸明细解析跳过）
  const preTripleMatch = correctedText.match(/(\d+)件[\/]\s*(\d+(?:\.\d+)?)\s*方[\/]\s*(\d+(?:\.\d+)?)\s*kg/i);
  if (preTripleMatch && !result.weight && !result.volume) {
    result.pieces = Number.parseInt(preTripleMatch[1]);
    result.volume = Number.parseFloat(preTripleMatch[2]);
    result.weight = Number.parseFloat(preTripleMatch[3]);
    result.packageType = 'pieces';
  }

  // 🔥 高优先级：毫米单位尺寸明细检测 - 在三元组解析前执行
  const hasMmUnitEarly = correctedText.includes('尺寸mm') || correctedText.includes('毫米');
  if (hasMmUnitEarly && (!result.dimensions || result.dimensions.length === 0)) {
    // 🔥 支持两种格式：带"尺寸"前缀和不带前缀的
    const sizeDetailMatches = [];

    // 匹配所有"尺寸"开头的行 - 🔥 修复：支持"尺寸"后面可能有空格
    for (const match of correctedText.matchAll(/尺寸\s*(\d+(?:\.\d+)?)\s*\*\s*(\d+(?:\.\d+)?)\s*\*\s*(\d+(?:\.\d+)?)\s*\*\s*(\d+)\s*件/gi)) {
      sizeDetailMatches.push(match);
    }

    // 🔥 重要修复：使用原始文本分行，而不是标准化后的文本
    const originalLines = text.split('\n');
    for (const line of originalLines) {
      const lineMatch = line.match(/^(\d+(?:\.\d+)?)\s*\*\s*(\d+(?:\.\d+)?)\s*\*\s*(\d+(?:\.\d+)?)\s*\*\s*(\d+)\s*件/i);
      if (lineMatch) {
        sizeDetailMatches.push(lineMatch);
      }
    }

    if (sizeDetailMatches.length > 0) {
      const newDimensions: Dimension[] = [];
      let totalDetailPieces = 0;

      for (const match of sizeDetailMatches) {
        const length = Number.parseFloat(match[1]);
        const width = Number.parseFloat(match[2]);
        const height = Number.parseFloat(match[3]);
        const quantity = Number.parseInt(match[4]);

        newDimensions.push({
          length: length,
          width: width,
          height: height,
          quantity: quantity,
          unit: 'mm' // 🔥 毫米单位
        });

        totalDetailPieces += quantity;
      }

      if (newDimensions.length > 0) {
        result.dimensions = newDimensions;
        result.pieces = totalDetailPieces; // 🔥 使用尺寸明细的件数
        result.packageType = 'pieces';

        // 🔥 跳过后续的三元组解析，因为我们已经有详细的尺寸信息
        console.log('🔥 跳过三元组解析，使用毫米尺寸明细');
      }
    }
  }

  // 🧠 智能三元组识别系统 - 支持重量/件数/体积的任意顺序组合（仅在没有详细尺寸时执行）
  const triplePatterns = [
    // 🔥 新增：修复 "KHI/2289KG/5.88CBM/109CTN" 格式 - 机场代码/重量KG/体积CBM/件数CTN
    /([A-Z]{3})\s*[\/]\s*(\d+(?:\.\d+)?)\s*(?:KG|kg|kgs|KGS)\s*[\/]\s*(\d+(?:\.\d+)?)\s*(?:CBM|cbm|方|立方|m3)\s*[\/]\s*(\d+(?:\.\d+)?)\s*(?:CTN|ctns|ctn|CTNS|箱|件|个)/i,
    // "BOM 460CTN/3270KG/34CBM/C.W5686KG" 格式 - 机场代码 件数CTN/重量KG/体积CBM/计费重
    /([A-Z]{3})\s+(\d+(?:\.\d+)?)\s*(?:CTN|ctns|ctn|CTNS)\s*[\/]?\s*(?:GW|gw|毛重|Gross Weight)\s*(\d+(?:\.\d+)?)\s*(?:KG|kg|kgs|KGS)\s*[\/]?\s*(\d+(?:\.\d+)?)\s*(?:CBM|cbm|方|立方|m3)\s*[\/]?\s*(?:CW|cw|计费重|Chargeable Weight)\s*(\d+(?:\.\d+)?)\s*(?:KG|kg|kgs|KGS)/i,
    // "BOM 460CTN/GW3270KG/34CBM/CW5686KG" 格式 - 机场代码 件数CTN/毛重GW/体积CBM/计费重CW (无斜杠分隔)
    /([A-Z]{3})\s+(\d+(?:\.\d+)?)\s*(?:CTN|ctns|ctn|CTNS)\s*[\/]?\s*(?:GW|gw|毛重|Gross Weight)\s*(\d+(?:\.\d+)?)\s*(?:KG|kg|kgs|KGS)\s*[\/]?\s*(\d+(?:\.\d+)?)\s*(?:CBM|cbm|方|立方|m3)\s*[\/]?\s*(?:CW|cw|计费重|Chargeable Weight)\s*(\d+(?:\.\d+)?)\s*(?:KG|kg|kgs|KGS)/i,
    // "BOM 460CTN/NW2800KG/34CBM/CW5686KG" 格式 - 机场代码 件数CTN/净重NW/体积CBM/计费重CW
    /([A-Z]{3})\s+(\d+(?:\.\d+)?)\s*(?:CTN|ctns|ctn|CTNS)\s*[\/]?\s*(?:NW|nw|净重|Net Weight)\s*(\d+(?:\.\d+)?)\s*(?:KG|kg|kgs|KGS)\s*[\/]?\s*(\d+(?:\.\d+)?)\s*(?:CBM|cbm|方|立方|m3)\s*[\/]?\s*(?:CW|cw|计费重|Chargeable Weight)\s*(\d+(?:\.\d+)?)\s*(?:KG|kg|kgs|KGS)/i,
    // "120/3000KG/11.8CBM" 格式 - 数字/重量/体积 (第一个数字默认为件数，无单位)
    /(\d+(?:\.\d+)?)\s*[\/,]\s*(\d+(?:\.\d+)?)\s*(?:KG|kg|kgs|KGS|公斤)\s*[\/,]\s*(\d+(?:\.\d+)?)\s*(?:CBM|cbm|方|立方|m3)/i,
    // "PEK---VCP 120×80×127 厘米 1.22方 计费重753.6KG" 格式 - 起运地---目的地 尺寸 体积 计费重
    /([A-Z]{3})\s*-{2,3}\s*([A-Z]{3})\s+(\d+(?:\.\d+)?)\s*[×x*]\s*(\d+(?:\.\d+)?)\s*[×x*]\s*(\d+(?:\.\d+)?)\s*(?:厘米|cm|CM)\s+(\d+(?:\.\d+)?)\s*方\s+计费重\s*(\d+(?:\.\d+)?)\s*(?:KG|kg)/i,
    // "PEK---VCP 计费重753.6KG 1.22方" 格式 - 起运地---目的地 计费重 体积（简化版）
    /([A-Z]{3})\s*-{2,3}\s*([A-Z]{3})\s+计费重\s*(\d+(?:\.\d+)?)\s*(?:KG|kg)\s+(\d+(?:\.\d+)?)\s*方/i,
    // "BEG 60ctn 618kg 2.41cbm" 格式 - 机场代码 件数ctn 重量kg 体积cbm
    /([A-Z]{3})\s+(\d+(?:\.\d+)?)\s*(?:ctn|ctns|箱|件|个)\s+(\d+(?:\.\d+)?)\s*(?:kg|kgs|KG|KGS)\s+(\d+(?:\.\d+)?)\s*(?:cbm|CBM|方|立方|m3)/i,
    // "KHI//3400KG//12.33CBM//145CTNS" 格式 - 机场代码//重量//体积//箱数 (支持双斜杠分隔)
    /([A-Z]{3})\s*(\d+(?:\.\d+)?)\s*(?:KG|kg|kgs|KGS)\s*(\d+(?:\.\d+)?)\s*(?:CBM|cbm|方|立方|m3)\s*(\d+)\s*(?:CTNS|ctns|箱)/i,
    // "CCU 1028/1.63/35*35*35CM*38CTNS" 格式 - 机场代码 重量/体积/尺寸*箱数
    /([A-Z]{3})\s+(\d+(?:\.\d+)?)\s*[\/]\s*(\d+(?:\.\d+)?)\s*[\/]\s*(\d+(?:\.\d+)?)\s*\*\s*(\d+(?:\.\d+)?)\s*\*\s*(\d+(?:\.\d+)?)\s*cm\s*\*\s*(\d+)\s*(?:CTNS|ctns|箱)/i,
    // "1028/1.63/35*35*35CM*38CTNS" 格式 - 重量/体积/尺寸*箱数（无机场代码）
    /(\d+(?:\.\d+)?)\s*[\/]\s*(\d+(?:\.\d+)?)\s*[\/]\s*(\d+(?:\.\d+)?)\s*\*\s*(\d+(?:\.\d+)?)\s*\*\s*(\d+(?:\.\d+)?)\s*cm\s*\*\s*(\d+)\s*(?:CTNS|ctns|箱)/i,
    // "751KG/42件/2.57CBM" 格式 - 重量/件数/体积
    /(\d+(?:\.\d+)?)\s*(?:KG|kg|kgs|KGS|公斤)\s*[\/,]\s*(\d+)\s*(?:件|个|箱|托|pcs?|pieces?|CTNS|ctns)\s*[\/,]\s*(\d+(?:\.\d+)?)\s*(?:CBM|cbm|方|立方|m3)/i,
    // "42件/751KG/2.57CBM" 格式 - 件数/重量/体积
    /(\d+)\s*(?:件|个|箱|托|pcs?|pieces?|CTNS|ctns)\s*[\/,]\s*(\d+(?:\.\d+)?)\s*(?:KG|kg|kgs|KGS|公斤)\s*[\/,]\s*(\d+(?:\.\d+)?)\s*(?:CBM|cbm|方|立方|m3)/i,
    // "2.57CBM/751KG/42件" 格式 - 体积/重量/件数
    /(\d+(?:\.\d+)?)\s*(?:CBM|cbm|方|立方|m3)\s*[\/,]\s*(\d+(?:\.\d+)?)\s*(?:KG|kg|kgs|KGS|公斤)\s*[\/,]\s*(\d+)\s*(?:件|个|箱|托|pcs?|pieces?|CTNS|ctns)/i,
    // "751KG/2.57CBM/42件" 格式 - 重量/体积/件数
    /(\d+(?:\.\d+)?)\s*(?:KG|kg|kgs|KGS|公斤)\s*[\/,]\s*(\d+(?:\.\d+)?)\s*(?:CBM|cbm|方|立方|m3)\s*[\/,]\s*(\d+)\s*(?:件|个|箱|托|pcs?|pieces?|CTNS|ctns)/i,
    // "42件/2.57CBM/751KG" 格式 - 件数/体积/重量
    /(\d+)\s*(?:件|个|箱|托|pcs?|pieces?|CTNS|ctns)\s*[\/,]\s*(\d+(?:\.\d+)?)\s*(?:CBM|cbm|方|立方|m3)\s*[\/,]\s*(\d+(?:\.\d+)?)\s*(?:KG|kg|kgs|KGS|公斤)/i,
    // "2.57CBM/42件/751KG" 格式 - 体积/件数/重量
    /(\d+(?:\.\d+)?)\s*(?:CBM|cbm|方|立方|m3)\s*[\/,]\s*(\d+)\s*(?:件|个|箱|托|pcs?|pieces?|CTNS|ctns)\s*[\/,]\s*(\d+(?:\.\d+)?)\s*(?:KG|kg|kgs|KGS|公斤)/i,
    // "167 CTNS / 11.79 CBM / 634.60 KGS" 格式 - 件数 单位 / 体积 单位 / 重量 单位 (带空格)
    /(\d+(?:\.\d+)?)\s+(?:件|个|箱|托|pcs?|pieces?|CTNS|ctns)\s*[\/,]\s*(\d+(?:\.\d+)?)\s+(?:CBM|cbm|方|立方|m3)\s*[\/,]\s*(\d+(?:\.\d+)?)\s+(?:KG|kg|kgs|KGS|公斤)/i,
    // "634.60 KGS / 167 CTNS / 11.79 CBM" 格式 - 重量 单位 / 件数 单位 / 体积 单位 (带空格)
    /(\d+(?:\.\d+)?)\s+(?:KG|kg|kgs|KGS|公斤)\s*[\/,]\s*(\d+(?:\.\d+)?)\s+(?:件|个|箱|托|pcs?|pieces?|CTNS|ctns)\s*[\/,]\s*(\d+(?:\.\d+)?)\s+(?:CBM|cbm|方|立方|m3)/i,
    // "11.79 CBM / 634.60 KGS / 167 CTNS" 格式 - 体积 单位 / 重量 单位 / 件数 单位 (带空格)
    /(\d+(?:\.\d+)?)\s+(?:CBM|cbm|方|立方|m3)\s*[\/,]\s*(\d+(?:\.\d+)?)\s+(?:KG|kg|kgs|KGS|公斤)\s*[\/,]\s*(\d+(?:\.\d+)?)\s+(?:件|个|箱|托|pcs?|pieces?|CTNS|ctns)/i,
  ];

  // 尝试匹配三元组格式 - 仅在没有详细尺寸信息时执行
  if (!result.dimensions || result.dimensions.length === 0) {
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
        case 0: // 🔥 新增："KHI/2289KG/5.88CBM/109CTN" 格式 - 机场代码/重量KG/体积CBM/件数CTN
          if (match.length >= 5) {
            const airportCode = match[1]; // KHI
            const weight = Number.parseFloat(match[2]); // 2289
            const volume = Number.parseFloat(match[3]); // 5.88
            const pieces = Number.parseFloat(match[4]); // 109

            // 设置机场代码和目的地
            const cityName = getAirportCity(airportCode);
            if (cityName) {
              result.destinationCode = airportCode;
              result.destination = formatAirportDisplay(airportCode);
            }

            result.weight = weight; // ✅ 正确：2289kg
            result.volume = volume; // ✅ 正确：5.88cbm
            result.pieces = pieces; // ✅ 正确：109件
            result.packageType = 'boxes'; // CTN表示箱
          }
          break;
        case 1: // "BOM 460CTN/3270KG/34CBM/C.W5686KG" 格式 - 机场代码 件数CTN/重量KG/体积CBM/计费重
          if (match.length >= 6) {
            const airportCode = match[1]; // BOM
            const pieces = Number.parseFloat(match[2]); // 460
            const actualWeight = Number.parseFloat(match[3]); // 3270 (实重)
            const volume = Number.parseFloat(match[4]); // 34
            const chargeableWeight = Number.parseFloat(match[5]); // 5686 (计费重)

            // 设置机场代码和目的地
            const cityName = getAirportCity(airportCode);
            if (cityName) {
              result.destinationCode = airportCode;
              result.destination = formatAirportDisplay(airportCode);
            }

            result.pieces = pieces; // ✅ 正确：460件
            result.weight = actualWeight; // ✅ 使用实重3270kg，而不是计费重
            result.volume = volume; // ✅ 正确：34cbm
            result.packageType = 'boxes'; // CTN表示箱

            // 🔥 新增：保存计费重信息到额外字段，供后续计算使用
            // 注意：计费重将在calculateCargoMetrics函数中重新计算和使用
          }
          break;
        case 2: // "BOM 460CTN/GW3270KG/34CBM/CW5686KG" 格式 - 机场代码 件数CTN/毛重GW/体积CBM/计费重CW (无斜杠分隔)
          if (match.length >= 6) {
            const airportCode = match[1]; // BOM
            const pieces = Number.parseFloat(match[2]); // 460
            const actualWeight = Number.parseFloat(match[3]); // 3270 (实重)
            const volume = Number.parseFloat(match[4]); // 34
            const chargeableWeight = Number.parseFloat(match[5]); // 5686 (计费重)

            // 设置机场代码和目的地
            const cityName = getAirportCity(airportCode);
            if (cityName) {
              result.destinationCode = airportCode;
              result.destination = formatAirportDisplay(airportCode);
            }

            result.pieces = pieces; // ✅ 正确：460件
            result.weight = actualWeight; // ✅ 使用实重3270kg，而不是计费重
            result.volume = volume; // ✅ 正确：34cbm
            result.packageType = 'boxes'; // CTN表示箱
          }
          break;
        case 3: // "BOM 460CTN/NW2800KG/34CBM/CW5686KG" 格式 - 机场代码 件数CTN/净重NW/体积CBM/计费重CW
          if (match.length >= 6) {
            const airportCode = match[1]; // BOM
            const pieces = Number.parseFloat(match[2]); // 460
            const actualWeight = Number.parseFloat(match[3]); // 3270 (实重)
            const volume = Number.parseFloat(match[4]); // 34
            const chargeableWeight = Number.parseFloat(match[5]); // 5686 (计费重)

            // 设置机场代码和目的地
            const cityName = getAirportCity(airportCode);
            if (cityName) {
              result.destinationCode = airportCode;
              result.destination = formatAirportDisplay(airportCode);
            }

            result.pieces = pieces; // ✅ 正确：460件
            result.weight = actualWeight; // ✅ 使用实重3270kg，而不是计费重
            result.volume = volume; // ✅ 正确：34cbm
            result.packageType = 'boxes'; // CTN表示箱
          }
          break;
        case 4: // "120/3000KG/11.8CBM" 格式 - 数字/重量/体积 (第一个数字默认为件数，无单位)
          if (match.length >= 4) {
            const pieces = Number.parseFloat(match[1]); // 120
            const weight = Number.parseFloat(match[2]); // 3000
            const volume = Number.parseFloat(match[3]); // 11.8

            // 设置件数、重量和体积
            result.pieces = pieces;
            result.weight = weight;
            result.volume = volume;
            result.packageType = 'pieces'; // 默认为件
          }
          break;
        case 5: // "PEK---VCP 120×80×127 厘米 1.22方 计费重753.6KG" 格式 - 起运地---目的地 尺寸 体积 计费重
          if (match.length >= 8) {
            const originCode = match[1]; // PEK
            const destCode = match[2]; // VCP
            const length = Number.parseFloat(match[3]); // 120
            const width = Number.parseFloat(match[4]); // 80
            const height = Number.parseFloat(match[5]); // 127
            const volume = Number.parseFloat(match[6]); // 1.22
            const weight = Number.parseFloat(match[7]); // 753.6

            // 智能设置起运地和目的地
            const originCity = getAirportCity(originCode);
            const destCity = getAirportCity(destCode);

            if (originCity) {
              result.origin = originCity;
            }

            if (destCity) {
              result.destinationCode = destCode;
              result.destination = formatAirportDisplay(destCode);
            }

            result.weight = weight; // 使用计费重作为重量
            result.volume = volume;
            result.pieces = 1; // 默认1件
            result.packageType = 'pieces';

            // 设置尺寸信息
            result.dimensions = [{
              length: length,
              width: width,
              height: height,
              quantity: 1,
              unit: 'cm' // 🔥 默认厘米单位
            }];
          }
          break;
        case 6: // "PEK---VCP 计费重753.6KG 1.22方" 格式 - 起运地---目的地 计费重 体积（简化版）
          if (match.length >= 5) {
            const originCode = match[1]; // PEK
            const destCode = match[2]; // VCP
            const weight = Number.parseFloat(match[3]); // 753.6
            const volume = Number.parseFloat(match[4]); // 1.22

            // 智能设置起运地和目的地
            const originCity = getAirportCity(originCode);
            const destCity = getAirportCity(destCode);

            if (originCity) {
              result.origin = originCity;
            }

            if (destCity) {
              result.destinationCode = destCode;
              result.destination = formatAirportDisplay(destCode);
            }

            result.weight = weight;
            result.volume = volume;
            result.pieces = 1; // 默认1件
            result.packageType = 'pieces';
          }
          break;
        case 7: // "BEG 60ctn 618kg 2.41cbm" 格式 - 机场代码 件数ctn 重量kg 体积cbm
          if (match.length >= 5) {
            const airportCode = match[1]; // BEG
            const pieces = Number.parseFloat(match[2]); // 60 (件数)
            const weight = Number.parseFloat(match[3]); // 618 (重量)
            const volume = Number.parseFloat(match[4]); // 2.41 (体积)

            // 设置机场代码和目的地
            const cityName = getAirportCity(airportCode);
            if (cityName) {
              result.destinationCode = airportCode;
              result.destination = formatAirportDisplay(airportCode);
            }

            result.pieces = pieces; // ✅ 正确：60件
            result.weight = weight; // ✅ 正确：618kg
            result.volume = volume; // ✅ 正确：2.41cbm
            result.packageType = 'boxes'; // ctn表示箱
          }
          break;
        case 8: // "KHI//3400KG//12.33CBM//145CTNS" 格式 - 机场代码//重量//体积//箱数 (支持双斜杠分隔)
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
        case 9: // "CCU 1028/1.63/35*35*35CM*38CTNS" 格式 - 机场代码 重量/体积/尺寸*箱数
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
              unit: 'cm' // 🔥 默认厘米单位
            }];
          }
          break;
        case 10: // "1028/1.63/35*35*35CM*38CTNS" 格式 - 重量/体积/尺寸*箱数（无机场代码）
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
              unit: 'cm' // 🔥 默认厘米单位
            }];
          }
          break;
        case 11: // 重量/件数/体积
          result.weight = num1;
          result.pieces = num2;
          result.volume = num3;
          break;
        case 12: // 件数/重量/体积
          result.pieces = num1;
          result.weight = num2;
          result.volume = num3;
          break;
        case 13: // 体积/重量/件数
          result.volume = num1;
          result.weight = num2;
          result.pieces = num3;
          break;
        case 14: // 重量/体积/件数
          result.weight = num1;
          result.volume = num2;
          result.pieces = num3;
          break;
        case 15: // 件数/体积/重量
          result.pieces = num1;
          result.volume = num2;
          result.weight = num3;
          break;
        case 16: // 体积/件数/重量
          result.volume = num1;
          result.pieces = num2;
          result.weight = num3;
          break;
        case 17: // 件数 单位 / 体积 单位 / 重量 单位 (167 CTNS / 11.79 CBM / 634.60 KGS)
          result.pieces = num1;
          result.volume = num2;
          result.weight = num3;
          break;
        case 18: // 重量 单位 / 件数 单位 / 体积 单位 (634.60 KGS / 167 CTNS / 11.79 CBM)
          result.weight = num1;
          result.pieces = num2;
          result.volume = num3;
          break;
        case 19: // 体积 单位 / 重量 单位 / 件数 单位 (11.79 CBM / 634.60 KGS / 167 CTNS)
          result.volume = num1;
          result.weight = num2;
          result.pieces = num3;
          break;
      }

      // 设置包装类型
      if (match[0].includes('托')) {
        result.packageType = 'pallets';
      } else if (match[0].includes('箱') || match[0].includes('CTNS') || match[0].includes('ctns')) {
        result.packageType = 'boxes';
      } else {
        result.packageType = 'pieces';
      }

      break; // 找到匹配就停止
    }
    }
  }

  // 🔥 已移至前面：传统格式多尺寸解析已在前面优先处理

  // 🔥 解析基本格式 - "148*113*80/1" 这类最基础的格式（重新添加）
  if (!result.dimensions || result.dimensions.length === 0) {
    const basicFormatMatches = correctedText.match(/(\d+(?:\.\d+)?)\s*[*×x]\s*(\d+(?:\.\d+)?)\s*[*×x]\s*(\d+(?:\.\d+)?)\s*[\/]\s*(\d+)/gi);
    if (basicFormatMatches) {
      const newDimensions: Dimension[] = [];
      let totalBasicPieces = 0;

      for (const basicMatch of basicFormatMatches) {
        const sizeMatch = basicMatch.match(/(\d+(?:\.\d+)?)\s*[*×x]\s*(\d+(?:\.\d+)?)\s*[*×x]\s*(\d+(?:\.\d+)?)\s*[\/]\s*(\d+)/i);
        if (sizeMatch) {
          const length = Number.parseFloat(sizeMatch[1]);
          const width = Number.parseFloat(sizeMatch[2]);
          const height = Number.parseFloat(sizeMatch[3]);
          const quantity = Number.parseInt(sizeMatch[4]);

          // 智能单位判断
          let unit: 'm' | 'cm' | 'mm' = 'cm';
          const maxDimension = Math.max(length, width, height);
          if (maxDimension >= 1000) {
            unit = 'mm';
          } else if (maxDimension < 10) {
            unit = 'm';
          }

          newDimensions.push({
            length: length,
            width: width,
            height: height,
            quantity: quantity,
            unit: unit
          });

          totalBasicPieces += quantity;
        }
      }

      if (newDimensions.length > 0) {
        result.dimensions = newDimensions;
        if (!result.pieces) {
          result.pieces = totalBasicPieces;
        }
        if (!result.packageType) {
          result.packageType = 'pieces';
        }
      }
    }
  }

  // 📦 "箱规" 格式解析 - 支持 "53.8*32*41cm箱规" 格式
  if (!result.dimensions || result.dimensions.length === 0) {
    const boxSpecMatches = correctedText.match(/(\d+(?:\.\d+)?)\s*\*\s*(\d+(?:\.\d+)?)\s*\*\s*(\d+(?:\.\d+)?)\s*cm\s*箱规/gi);
    if (boxSpecMatches) {
      const newDimensions: Dimension[] = [];
      for (const boxMatch of boxSpecMatches) {
        const sizeMatch = boxMatch.match(/(\d+(?:\.\d+)?)\s*\*\s*(\d+(?:\.\d+)?)\s*\*\s*(\d+(?:\.\d+)?)\s*cm/i);
        if (sizeMatch) {
          const length = Number.parseFloat(sizeMatch[1]);

          const width = Number.parseFloat(sizeMatch[2]);

          const height = Number.parseFloat(sizeMatch[3]);

          const quantity = 1; // 默认1件

          newDimensions.push({
            length: length,
            width: width,
            height: height,
            quantity: quantity,
            unit: 'cm' // 🔥 默认厘米单位
          });
        }
      }

      if (newDimensions.length > 0) {
        result.dimensions = newDimensions;
        if (!result.packageType) {
          result.packageType = 'boxes'; // 箱规默认为箱
        }
      }
    }
  }

  // 🔥 优先处理第一行产品名称 - "WAW设备及配件"
  const firstLine = correctedText.split('\n')[0]?.trim();
  if (firstLine && !firstLine.match(/^\s*[A-Z]{3}\s*$/) && !firstLine.match(/\d+.*(?:kg|cbm|cm|方|托|件|箱)/)) {
    // 如果第一行不是纯机场代码，且不包含数据信息，检查是否包含产品关键词
    const cleanName = firstLine.replace(/[?？]/g, '').trim();
    if (cleanName.length >= 2 && cleanName.length <= 20 && cleanName.match(/产品|设备|配件|玩具|机$|器$|电池$|装备/i)) {
      result.name = cleanName;
    }
  }

  // 🔥 解析米单位尺寸格式 - "尺寸：1.2*1.0*1.54m"
  if (!result.dimensions || result.dimensions.length === 0) {
    const meterSizeMatches = correctedText.match(/尺寸[：:]\s*(\d+(?:\.\d+)?)\s*[*×x]\s*(\d+(?:\.\d+)?)\s*[*×x]\s*(\d+(?:\.\d+)?)\s*m(?!m)/gi);
    if (meterSizeMatches) {

      const newDimensions: Dimension[] = [];

      for (const meterMatch of meterSizeMatches) {
        const sizeMatch = meterMatch.match(/尺寸[：:]\s*(\d+(?:\.\d+)?)\s*[*×x]\s*(\d+(?:\.\d+)?)\s*[*×x]\s*(\d+(?:\.\d+)?)\s*m(?!m)/i);
        if (sizeMatch) {
          const length = Number.parseFloat(sizeMatch[1]);
          const width = Number.parseFloat(sizeMatch[2]);
          const height = Number.parseFloat(sizeMatch[3]);
          const quantity = result.pieces || 1; // 使用已解析的件数，或默认1

          newDimensions.push({
            length: length,
            width: width,
            height: height,
            quantity: quantity,
            unit: 'm' // 🔥 米单位
          });


        }
      }

      if (newDimensions.length > 0) {
        result.dimensions = newDimensions;
        if (!result.packageType) {
          result.packageType = 'pieces';
        }
      }
    }
  }



  // 提取货物名称 - 优先从第一行提取产品型号+名称
  const productMatches = [
    // 🔥 修复：传统格式第一行产品名称 - "WAW设备及配件"
    (() => {
      const firstLine = correctedText.split('\n')[0]?.trim();
      if (firstLine && !firstLine.match(/^\s*[A-Z]{3}\s*$/) && !firstLine.match(/\d+.*(?:kg|cbm|cm|方|托|件|箱)/)) {
        // 如果第一行不是纯机场代码，且不包含数据信息，则作为产品名称
        const cleanName = firstLine.replace(/[?？]/g, '').trim();
        if (cleanName.length >= 2 && cleanName.length <= 20) {
          return [cleanName, cleanName];
        }
      }
      return null;
    })(),
    // "RLA510S 洗地机不带电池" 格式 - 提取产品型号+名称，排除"不带电池"等描述
    correctedText.match(/([A-Z0-9]+[\s?]*[^，。；\n\s\d?]{2,10}机?)(?:\s*不带电池|带电池)?/i),
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
      // 排除明显不是产品名的内容，包括时间、地点、机场代码等
      // 但保留合理的产品名，如"洗地机"、"设备"等
      if (!productName.match(/kg|cbm|cm|mm|箱|托|件|空运|海运|报价|帮忙|土耳其|伊斯坦布尔|墨西哥|MEX|预计|下周|货好|时间|星期|月|日|深圳|广州|上海|北京|Packing/i) ||
          productName.match(/产品|设备|配件|玩具|机$|器$|电池$/i)) {
        // 🔥 修复：如果产品名包含合理关键词（如设备、配件），即使有三字代码也接受
        if (productName.match(/产品|设备|配件|玩具|机$|器$|电池$/i) ||
            !productName.match(/^[A-Z]{3}$/)) { // 不是纯三字代码
          result.name = productName;
          break;
        }
      }
    }
  }

  // 如果仍没有找到货物名称，或者名称是机场信息，使用"普货"作为默认值
  // 🔥 修复：保护第一行已提取的产品名称，不被默认值覆盖
  if (!result.name || (result.name.match(/^[A-Z]{3}/) && !result.name.match(/产品|设备|配件|玩具|机$|器$|电池$|装备/i)) || result.name.includes('(') || result.name.length > 20) {
    result.name = '普货';
  }

  return result;
}

// 计算总体积
export function calculateTotalVolume(dimensions: Dimension[]): number {
  return dimensions.reduce((total, dim) => {
    let volume: number;

    // 🔥 根据单位正确计算体积
    switch (dim.unit) {
      case 'm': // 米
        volume = dim.length * dim.width * dim.height; // 已经是立方米
        break;
      case 'mm': // 毫米
        volume = (dim.length * dim.width * dim.height) / 1000000000; // 除以10^9转换为立方米
        break;
      default: // 厘米或其他单位
        volume = (dim.length * dim.width * dim.height) / 1000000; // 除以10^6转换为立方米
        break;
    }

    return total + volume * dim.quantity;
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
    '电子', '音响', '电器', '手机', '充电器', '电容', '电源'
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
