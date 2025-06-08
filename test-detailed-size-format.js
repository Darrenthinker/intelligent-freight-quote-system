// 详细尺寸格式解析测试
console.log('=== 详细尺寸格式解析测试 ===\n');

// 测试数据：用户提供的多尺寸格式
const testInput = `货在深圳  -TAS  4件/8.95方/1210kg
尺寸1336*706*2005*2件
2546*781*1300*2件
尺寸mm`;

console.log('测试输入：');
console.log(testInput);
console.log('\n期望结果：');
console.log('- 总件数: 4件 (2件+2件)');
console.log('- 总重量: 1210kg');
console.log('- 总体积: 8.95cbm');
console.log('- 2种不同尺寸');
console.log('- 货物所在地: 深圳');

// 模拟详细尺寸格式解析逻辑
function testDetailedSizeFormatParsing(text) {
  const result = {};

  // 1. 三元组解析："4件/8.95方/1210kg"
  const tripleMatch = text.match(/(\d+)\s*件[\/]\s*(\d+(?:\.\d+)?)\s*方[\/]\s*(\d+(?:\.\d+)?)\s*kg/i);
  if (tripleMatch) {
    result.pieces = parseInt(tripleMatch[1]);
    result.volume = parseFloat(tripleMatch[2]);
    result.weight = parseFloat(tripleMatch[3]);
    result.packageType = 'pieces';
    console.log('✓ 三元组:', result.pieces, '件/', result.volume, '方/', result.weight, 'kg');
  }

  // 2. 详细尺寸解析："尺寸1336*706*2005*2件" 和 "2546*781*1300*2件"
  const detailedSizeMatches = text.match(/(?:尺寸)?(\d+(?:\.\d+)?)\s*\*\s*(\d+(?:\.\d+)?)\s*\*\s*(\d+(?:\.\d+)?)\s*\*\s*(\d+)\s*件/gi);
  if (detailedSizeMatches) {
    console.log('✓ 找到详细尺寸匹配:', detailedSizeMatches);

    const dimensions = [];
    let totalPiecesFromDimensions = 0;

    for (const sizeMatch of detailedSizeMatches) {
      const match = sizeMatch.match(/(?:尺寸)?(\d+(?:\.\d+)?)\s*\*\s*(\d+(?:\.\d+)?)\s*\*\s*(\d+(?:\.\d+)?)\s*\*\s*(\d+)\s*件/i);
      if (match) {
        const length = parseFloat(match[1]);
        const width = parseFloat(match[2]);
        const height = parseFloat(match[3]);
        const quantity = parseInt(match[4]);

        dimensions.push({ length, width, height, quantity });
        totalPiecesFromDimensions += quantity;

        console.log(`  ✓ 尺寸: ${length}×${width}×${height}mm, 数量: ${quantity}件`);
      }
    }

    result.dimensions = dimensions;
    console.log('✓ 尺寸累计件数:', totalPiecesFromDimensions);

    // 验证件数一致性
    if (result.pieces && totalPiecesFromDimensions !== result.pieces) {
      console.log('⚠️ 件数不一致: 三元组', result.pieces, '件 vs 尺寸累计', totalPiecesFromDimensions, '件');
    }
  }

  // 3. 起运地解析："货在深圳"
  const originMatch = text.match(/货在(.+?)(?=\s|$|，|。|-)/);
  if (originMatch) {
    result.origin = originMatch[1].trim();
    console.log('✓ 起运地:', result.origin);
  }

  return result;
}

// 执行测试
const testResult = testDetailedSizeFormatParsing(testInput);

console.log('\n📊 测试结果：');
console.log(testResult);

// 验证期望
const checks = [
  { name: '件数检查', expected: 4, actual: testResult.pieces, pass: testResult.pieces === 4 },
  { name: '重量检查', expected: 1210, actual: testResult.weight, pass: testResult.weight === 1210 },
  { name: '体积检查', expected: 8.95, actual: testResult.volume, pass: testResult.volume === 8.95 },
  { name: '尺寸数量', expected: 2, actual: testResult.dimensions?.length, pass: testResult.dimensions?.length === 2 },
  { name: '起运地检查', expected: '深圳', actual: testResult.origin, pass: testResult.origin === '深圳' }
];

console.log('\n🎯 验证结果：');
let passCount = 0;
checks.forEach(check => {
  const status = check.pass ? '✅' : '❌';
  console.log(`${status} ${check.name}: 期望 ${check.expected}, 实际 ${check.actual}`);
  if (check.pass) passCount++;
});

console.log(`\n📈 测试通过率: ${passCount}/${checks.length} (${Math.round(passCount/checks.length*100)}%)`);

if (passCount === checks.length) {
  console.log('\n🎉 详细尺寸格式解析逻辑验证成功！');
  console.log('✅ 新格式支持应该有效');
} else {
  console.log('\n⚠️  解析逻辑存在问题，需要进一步调试');
}
