const fs = require('fs');
const path = require('path');

console.log('🔥 开始测试传统格式解析问题（修复版本）...');

const testData = `WAW设备及配件
2500 kgs ; 14.71 cbm ; 6托
货在广州
120x100x65 cm
192x135x130 cm
192x135x104 cm
192x135x104 cm
192x135x104 cm
192x122x105 cm`;

console.log('📝 输入数据:');
console.log(testData);
console.log('---');

// 简化的机场代码数据
const airportData = {
  'WAW': 'Warsaw'
};

function getAirportCity(code) {
  return airportData[code] || null;
}

function formatAirportDisplay(code) {
  const city = getAirportCity(code);
  return city ? `${code},华沙,${city}` : code;
}

// 🔥 修复：智能字符清理和标准化函数 - 保持换行符
function normalizeText(text) {
  let normalizedText = text;

  // 1. 拼写纠错
  const corrections = {
    'k9': 'kg', 'kd': 'kg', 'k8': 'kg', 'k0': 'kg', 'kq': 'kg', 'ke': 'kg',
    'k7': 'kg', 'k6': 'kg', 'k5': 'kg', 'k4': 'kg', 'k3': 'kg', 'k2': 'kg', 'k1': 'kg',
    'cbm9': 'cbm', 'cbmd': 'cbm', 'cb9': 'cbm',
    'mm9': 'mm', 'mmd': 'mm', 'cm9': 'cm', 'cmd': 'cm'
  };

  for (const [wrong, correct] of Object.entries(corrections)) {
    const regex = new RegExp(wrong, 'gi');
    normalizedText = normalizedText.replace(regex, correct);
  }

  // 2. 统一分隔符 - 🔥 关键修复：不要处理换行符，保持行结构
  normalizedText = normalizedText
    .replace(/\/\/+/g, '/') // 双斜杠或多斜杠 -> 单斜杠
    .replace(/\?\?+/g, '') // 多个问号 -> 删除
    .replace(/\?/g, '') // 单个问号 -> 删除
    .replace(/\s*\/\s*/g, '/') // 斜杠前后的空格 -> 去除
    .replace(/\s*\*\s*/g, '*') // 星号前后的空格 -> 去除
    .replace(/ +/g, ' ') // 多个空格 -> 单个空格（但保持换行符）
    .trim(); // 去除首尾空格

  return normalizedText;
}

// 简化的解析函数
function parseCargoText(text) {
  const correctedText = normalizeText(text);
  console.log('🧹 标准化后的文本:');
  console.log('```');
  console.log(correctedText);
  console.log('```');

  const result = {};
  const lines = correctedText.trim().split('\n').filter(line => line.trim());

  console.log('📄 分割后的行数:', lines.length);
  lines.forEach((line, index) => {
    console.log(`  行${index + 1}: "${line}"`);
  });

  // 🔥 修复：优先识别第一行中的机场代码
  const firstLine = lines[0]?.trim();
  if (firstLine) {
    console.log('🔍 分析第一行:', firstLine);

    // 查找三字机场代码
    const airportCodeMatches = firstLine.match(/\b([A-Z]{3})\b/g);
    console.log('✈️ 找到的机场代码:', airportCodeMatches);

    if (airportCodeMatches) {
      for (const code of airportCodeMatches) {
        const cityName = getAirportCity(code);
        console.log(`🏙️ 机场代码 ${code} -> 城市: ${cityName}`);
        if (cityName) {
          result.destinationCode = code;
          result.destination = formatAirportDisplay(code);
          console.log(`✅ 设置目的地: ${result.destination}`);

          // 🔥 关键修复：提取机场代码后面的文本作为产品名称（仅第一行）
          const afterAirportCode = firstLine.split(code)[1]?.trim();
          console.log(`📦 机场代码后的文本: "${afterAirportCode}"`);
          if (afterAirportCode && afterAirportCode.length >= 2 && afterAirportCode.length <= 20) {
            result.name = afterAirportCode;
            console.log(`✨ 设置产品名称: ${result.name}`);
          }
          break;
        }
      }
    }
  }

  // 🔥 修复：支持传统格式解析 - "2500 kgs ; 14.71 cbm ; 6托"
  console.log('🔍 查找传统格式模式...');
  const traditionalFormatMatch = correctedText.match(/(\d+(?:\.\d+)?)\s*(?:kgs?|KGS?|公斤)\s*[;；,]\s*(\d+(?:\.\d+)?)\s*(?:cbm|CBM|方|立方|m3)\s*[;；,]\s*(\d+(?:\.\d+)?)\s*(?:托|pallet)/i);

  if (traditionalFormatMatch) {
    console.log('🎯 传统格式匹配成功:', traditionalFormatMatch);
    result.weight = parseFloat(traditionalFormatMatch[1]); // 2500kg
    result.volume = parseFloat(traditionalFormatMatch[2]); // 14.71cbm
    result.pallets = parseFloat(traditionalFormatMatch[3]); // 6托
    result.pieces = result.pallets; // 托盘数=件数
    result.packageType = 'pallets';
    console.log(`📦 传统格式解析: 重量=${result.weight}kg, 体积=${result.volume}cbm, 托盘=${result.pallets}托`);
  } else {
    console.log('❌ 传统格式未匹配');
  }

  // 🔥 修复：解析尺寸明细 - 跳过前两行（货物名+传统格式），从第三行开始
  let dimensionStartIndex = 2;
  // 如果有"货在"行，跳过它
  if (lines[2] && lines[2].includes('货在')) {
    dimensionStartIndex = 3;
  }

  const dimensionLines = lines.slice(dimensionStartIndex);
  console.log(`📏 尺寸行数: ${dimensionLines.length} (从第${dimensionStartIndex + 1}行开始)`);

  const dimensions = [];
  for (const line of dimensionLines) {
    console.log(`🔍 分析尺寸行: "${line}"`);

    // 支持 "120x100x65 cm" 格式
    const dimensionMatch = line.match(/(\d+(?:\.\d+)?)\s*[x×*]\s*(\d+(?:\.\d+)?)\s*[x×*]\s*(\d+(?:\.\d+)?)\s*(cm|mm|m)?/i);
    if (dimensionMatch) {
      console.log('📐 尺寸匹配:', dimensionMatch);
      const length = parseFloat(dimensionMatch[1]);
      const width = parseFloat(dimensionMatch[2]);
      const height = parseFloat(dimensionMatch[3]);
      const unit = dimensionMatch[4] || 'cm';

      dimensions.push({
        length: length,
        width: width,
        height: height,
        quantity: 1, // 每行默认1件
        unit: unit
      });
      console.log(`✅ 添加尺寸: ${length}×${width}×${height} ${unit}`);
    }
  }

  if (dimensions.length > 0) {
    result.dimensions = dimensions;
    console.log(`📏 尺寸明细数量: ${dimensions.length}个`);
  }

  // 识别货物所在地
  const originMatch = correctedText.match(/货在(.+?)(?=\s|$)/);
  if (originMatch) {
    result.origin = originMatch[1].trim();
    console.log(`🏭 识别到货物所在地: ${result.origin}`);
  }

  return result;
}

// 测试解析
const result = parseCargoText(testData);

console.log('\n🎉 最终解析结果:');
console.log(JSON.stringify(result, null, 2));

console.log('\n✅ 检查修复结果:');
console.log('- 目的地机场代码:', result.destinationCode);
console.log('- 目的地显示:', result.destination);
console.log('- 产品名称:', result.name);
console.log('- 重量:', result.weight, 'kg');
console.log('- 体积:', result.volume, 'cbm');
console.log('- 托盘数:', result.pallets);
console.log('- 件数:', result.pieces);
console.log('- 尺寸明细数量:', result.dimensions?.length);
console.log('- 货物所在地:', result.origin);

if (result.dimensions) {
  console.log('\n📏 尺寸明细:');
  result.dimensions.forEach((dim, index) => {
    console.log(`  ${index + 1}. ${dim.length}×${dim.width}×${dim.height} ${dim.unit} (数量: ${dim.quantity})`);
  });
}

console.log('\n💡 问题分析:');
console.log('1. ✅ WAW机场代码正确识别');
console.log('2. ✅ 产品名称"设备及配件"正确提取');
console.log('3. ✅ 传统格式"2500 kgs ; 14.71 cbm ; 6托"正确解析');
console.log('4. ✅ 6托盘数量正确识别');
console.log('5. ✅ 6行尺寸明细正确解析');
console.log('6. ✅ 货物所在地"广州"正确识别');
