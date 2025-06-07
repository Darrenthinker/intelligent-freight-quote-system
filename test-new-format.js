// 新格式解析测试
console.log('=== 多行描述格式解析测试 ===\n');

// 测试数据：用户提供的新格式
const testInput = `Comm 运动器具
数量：17箱
尺寸：每箱48 x 48 x 58 厘米
总重量：400公斤`;

console.log('测试输入：');
console.log(testInput);
console.log('\n期望结果：');
console.log('- 货物名称: 运动器具');
console.log('- 数量: 17箱');
console.log('- 尺寸: 48×48×58厘米');
console.log('- 总重量: 400公斤');
console.log('- 包装类型: boxes');

// 模拟多行描述格式解析逻辑
function testMultiLineFormatParsing(text) {
  const result = {};

  // 1. 货物名称解析
  const lines = text.trim().split('\n').filter(line => line.trim());
  if (lines.length > 0) {
    const firstLine = lines[0].trim();
    if (!firstLine.match(/^[A-Z]{3}$/) && !firstLine.match(/^\d+/)) {
      result.name = firstLine;

      // 特殊处理：提取中文部分
      if (result.name && result.name.includes(' ')) {
        const chineseMatch = result.name.match(/[\u4e00-\u9fff]+/);
        if (chineseMatch) {
          result.name = chineseMatch[0];
        }
      }
      console.log('✓ 货物名称:', result.name);
    }
  }

  // 2. 数量解析："数量：17箱"
  const quantityMatch = text.match(/数量[：:]\s*(\d+)\s*(?:箱|件|个|托|pcs?|pieces?|CTNS|ctns)/i);
  if (quantityMatch) {
    result.pieces = parseInt(quantityMatch[1]);
    const unit = quantityMatch[0].toLowerCase();
    if (unit.includes('箱') || unit.includes('ctn')) {
      result.packageType = 'boxes';
    } else if (unit.includes('托')) {
      result.packageType = 'pallets';
    } else {
      result.packageType = 'pieces';
    }
    console.log('✓ 数量:', result.pieces, result.packageType);
  }

  // 3. 尺寸解析："尺寸：每箱48 x 48 x 58 厘米"
  const sizeDescriptionMatch = text.match(/尺寸[：:]\s*(?:每[箱件个托]?)?\s*(\d+(?:\.\d+)?)\s*[x×*]\s*(\d+(?:\.\d+)?)\s*[x×*]\s*(\d+(?:\.\d+)?)\s*(?:厘米|cm|CM)/i);
  if (sizeDescriptionMatch) {
    const length = parseFloat(sizeDescriptionMatch[1]);
    const width = parseFloat(sizeDescriptionMatch[2]);
    const height = parseFloat(sizeDescriptionMatch[3]);
    const quantity = result.pieces || 1;

    result.dimensions = [{
      length: length,
      width: width,
      height: height,
      quantity: quantity
    }];

    if (!result.packageType) {
      result.packageType = 'boxes';
    }

    console.log(`✓ 尺寸: ${length}×${width}×${height}厘米, 数量: ${quantity}`);
  }

  // 4. 总重量解析："总重量：400公斤"
  const totalWeightMatch = text.match(/总重量[：:]\s*(\d+(?:\.\d+)?)\s*(?:公斤|kg|KG)/i);
  if (totalWeightMatch) {
    result.weight = parseFloat(totalWeightMatch[1]);
    console.log('✓ 总重量:', result.weight);
  }

  return result;
}

// 执行测试
const testResult = testMultiLineFormatParsing(testInput);

console.log('\n📊 测试结果：');
console.log(testResult);

// 验证期望
const checks = [
  { name: '货物名称', expected: '运动器具', actual: testResult.name, pass: testResult.name === '运动器具' },
  { name: '件数检查', expected: 17, actual: testResult.pieces, pass: testResult.pieces === 17 },
  { name: '包装类型', expected: 'boxes', actual: testResult.packageType, pass: testResult.packageType === 'boxes' },
  { name: '重量检查', expected: 400, actual: testResult.weight, pass: testResult.weight === 400 },
  { name: '尺寸数量', expected: 1, actual: testResult.dimensions?.length, pass: testResult.dimensions?.length === 1 }
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
  console.log('\n🎉 多行描述格式解析逻辑验证成功！');
  console.log('✅ 新格式支持应该有效');
} else {
  console.log('\n⚠️  解析逻辑存在问题，需要进一步调试');
}
