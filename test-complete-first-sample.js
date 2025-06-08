// 完整测试第一个示例数据的解析
console.log('=== 完整测试第一个示例数据 ===');

const firstSampleText = `WAW设备及配件
2500 kgs ; 14.71 cbm ; 6托
货在广州
120x100x65 cm
192x135x130 cm
192x135x104 cm
192x135x104 cm
192x135x104 cm
192x122x105 cm`;

console.log('输入文本:');
console.log(firstSampleText);
console.log('');

// 模拟完整的解析过程
const result = {};

// 1. 货物名称提取（第一行）
const lines = firstSampleText.trim().split('\n').filter(line => line.trim());
const firstLine = lines[0].trim();

// 检查第一行是否为货物名称（不是单独的机场代码）
if (!firstLine.match(/^[A-Z]{3}$/) && firstLine.length <= 50) {
  // 使用第一个正则表达式匹配
  const nameMatch = firstSampleText.match(/([A-Z0-9]+[\s]*[^，。；\n\s\d]{2,10}机?)(?:\s*不带电池|带电池)?/i);
  if (nameMatch) {
    const productName = nameMatch[1].trim();
    const excludePattern = /kg|cbm|cm|mm|箱|托|件|空运|海运|报价|帮忙|[A-Z]{3}|土耳其|伊斯坦布尔|墨西哥|MEX|预计|下周|货好|时间|星期|月|日|深圳|广州|上海|北京|Packing/i;
    const includePattern = /产品|设备|配件|玩具|机$|器$|电池$/i;

    const shouldExclude = excludePattern.test(productName) && !includePattern.test(productName);
    if (!shouldExclude) {
      result.name = productName;
    }
  }

  if (!result.name) {
    result.name = firstLine; // 直接使用第一行
  }
}

console.log('1. 货物名称:', result.name || '未识别');

// 2. 重量识别
const weightMatch = firstSampleText.match(/(\d+(?:\.\d+)?)\s*(?:kgs?|KGS?|公斤|千克)/i);
if (weightMatch) {
  result.weight = Number.parseFloat(weightMatch[1]);
}
console.log('2. 重量:', result.weight ? result.weight + 'kg' : '未识别');

// 3. 体积识别
const volumeMatch = firstSampleText.match(/(\d+(?:\.\d+)?)\s*(?:cbm|CBM|方|立方|m3)/i);
if (volumeMatch) {
  result.volume = Number.parseFloat(volumeMatch[1]);
}
console.log('3. 体积:', result.volume ? result.volume + 'cbm' : '未识别');

// 4. 托盘数识别
const palletMatch = firstSampleText.match(/(\d+)\s*托/);
if (palletMatch) {
  result.pallets = Number.parseInt(palletMatch[1]);
  result.pieces = result.pallets; // 托盘数作为件数
  result.packageType = 'pallets';
}
console.log('4. 托盘数:', result.pallets ? result.pallets + '托' : '未识别');

// 5. 起运地识别
const originMatch = firstSampleText.match(/货在(.+?)(?=\s|$)/);
if (originMatch) {
  result.origin = originMatch[1].trim();
}
console.log('5. 起运地:', result.origin || '未识别');

// 6. 尺寸识别
const dimensionMatches = firstSampleText.match(/(\d+(?:\.\d+)?)\s*[*×xX]\s*(\d+(?:\.\d+)?)\s*[*×xX]\s*(\d+(?:\.\d+)?)\s*cm/gi);
if (dimensionMatches) {
  result.dimensions = [];
  dimensionMatches.forEach((dimText, index) => {
    const match = dimText.match(/(\d+(?:\.\d+)?)\s*[*×xX]\s*(\d+(?:\.\d+)?)\s*[*×xX]\s*(\d+(?:\.\d+)?)\s*cm/i);
    if (match) {
      result.dimensions.push({
        length: Number.parseFloat(match[1]),
        width: Number.parseFloat(match[2]),
        height: Number.parseFloat(match[3]),
        quantity: 1
      });
    }
  });
}
console.log('6. 尺寸数量:', result.dimensions ? result.dimensions.length + '个' : '未识别');

// 7. 机场代码识别（这个案例不应该识别出机场代码）
const restText = lines.slice(1).join('\n');
const airportCodeMatch = restText.match(/\b([A-Z]{3})\b/g);
let destinationCode = null;
if (airportCodeMatch) {
  // 这里需要检查机场代码是否有效，但我们简化处理
  console.log('7. 检测到三字码:', airportCodeMatch, '(需要验证是否为有效机场代码)');
} else {
  console.log('7. 机场代码: 未识别 (正确，WAW在货物名称中)');
}

console.log('');
console.log('=== 解析结果汇总 ===');
console.log('货物名称:', result.name || '未识别');
console.log('重量:', result.weight ? result.weight + 'kg' : '未识别');
console.log('体积:', result.volume ? result.volume + 'cbm' : '未识别');
console.log('托盘数:', result.pallets ? result.pallets + '托' : '未识别');
console.log('件数:', result.pieces ? result.pieces + '件' : '未识别');
console.log('起运地:', result.origin || '未识别');
console.log('尺寸数量:', result.dimensions ? result.dimensions.length + '个' : '未识别');
console.log('包装类型:', result.packageType || '未识别');

console.log('');
console.log('=== 预期结果对比 ===');
console.log('✓ 货物名称: WAW设备及配件');
console.log('✓ 重量: 2500kg');
console.log('✓ 体积: 14.71cbm');
console.log('✓ 托盘数: 6托');
console.log('✓ 件数: 6件');
console.log('✓ 起运地: 广州');
console.log('✓ 尺寸数量: 5个');
console.log('✓ 包装类型: pallets');
console.log('✓ 机场代码: 无 (不应该识别WAW为目的地)');

// 检查结果是否正确
const isCorrect =
  result.name === 'WAW设备及配件' &&
  result.weight === 2500 &&
  result.volume === 14.71 &&
  result.pallets === 6 &&
  result.pieces === 6 &&
  result.origin === '广州' &&
  result.dimensions && result.dimensions.length === 5 &&
  result.packageType === 'pallets';

console.log('');
console.log('=== 最终验证 ===');
console.log('解析是否完全正确:', isCorrect ? '✅ 是' : '❌ 否');

if (!isCorrect) {
  console.log('');
  console.log('❌ 发现的问题:');
  if (result.name !== 'WAW设备及配件') console.log('  - 货物名称不正确:', result.name);
  if (result.weight !== 2500) console.log('  - 重量不正确:', result.weight);
  if (result.volume !== 14.71) console.log('  - 体积不正确:', result.volume);
  if (result.pallets !== 6) console.log('  - 托盘数不正确:', result.pallets);
  if (result.pieces !== 6) console.log('  - 件数不正确:', result.pieces);
  if (result.origin !== '广州') console.log('  - 起运地不正确:', result.origin);
  if (!result.dimensions || result.dimensions.length !== 5) console.log('  - 尺寸数量不正确:', result.dimensions?.length);
  if (result.packageType !== 'pallets') console.log('  - 包装类型不正确:', result.packageType);
}
