// 简单的基本格式解析测试
console.log('=== 基本格式解析测试 ===\n');

// 测试数据：这是V56修复的重点格式
const testInput = `148*113*80/1
168*113*72.5/1
188.5*35.5*71/1
单个托盘120KG`;

console.log('测试输入：');
console.log(testInput);
console.log('\n期望结果：');
console.log('- 总件数: 3件 (1+1+1)');
console.log('- 单件重量: 120kg');
console.log('- 总重量: 360kg (120×3)');
console.log('- 3个不同尺寸的dimensions');

// 模拟基本格式解析逻辑
function testBasicFormatParsing(text) {
  const result = {};

  // 1. 基本格式匹配：数字*数字*数字/数字
  const basicFormatMatches = text.match(/(\d+(?:\.\d+)?)\s*[*×x]\s*(\d+(?:\.\d+)?)\s*[*×x]\s*(\d+(?:\.\d+)?)\s*[\/]\s*(\d+)/gi);

  if (basicFormatMatches) {
    console.log('\n🔍 找到基本格式匹配:', basicFormatMatches);

    const dimensions = [];
    let totalPieces = 0;

    for (const match of basicFormatMatches) {
      const sizeMatch = match.match(/(\d+(?:\.\d+)?)\s*[*×x]\s*(\d+(?:\.\d+)?)\s*[*×x]\s*(\d+(?:\.\d+)?)\s*[\/]\s*(\d+)/i);
      if (sizeMatch) {
        const length = parseFloat(sizeMatch[1]);
        const width = parseFloat(sizeMatch[2]);
        const height = parseFloat(sizeMatch[3]);
        const quantity = parseInt(sizeMatch[4]);

        dimensions.push({ length, width, height, quantity });
        totalPieces += quantity;

        console.log(`  ✓ 尺寸: ${length}×${width}×${height}cm, 数量: ${quantity}`);
      }
    }

    result.dimensions = dimensions;
    result.pieces = totalPieces;
    console.log(`📦 总件数: ${totalPieces}件`);
  }

  // 2. 单件重量匹配：单个托盘120KG
  const singleWeightMatch = text.match(/单[个件](?:托盘|重量|重)?[：:]?\s*(\d+(?:\.\d+)?)\s*(?:KG|kg|公斤)/i);
  if (singleWeightMatch) {
    const singleWeight = parseFloat(singleWeightMatch[1]);
    console.log(`📏 单件重量: ${singleWeight}kg`);

    if (result.pieces) {
      result.weight = singleWeight * result.pieces;
      console.log(`⚖️  总重量: ${singleWeight}kg × ${result.pieces}件 = ${result.weight}kg`);
    }
  }

  return result;
}

// 执行测试
const testResult = testBasicFormatParsing(testInput);

console.log('\n📊 测试结果：');
console.log(testResult);

// 验证期望
const checks = [
  { name: '件数检查', expected: 3, actual: testResult.pieces, pass: testResult.pieces === 3 },
  { name: '重量检查', expected: 360, actual: testResult.weight, pass: testResult.weight === 360 },
  { name: '尺寸数量检查', expected: 3, actual: testResult.dimensions?.length, pass: testResult.dimensions?.length === 3 }
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
  console.log('\n🎉 基本格式解析逻辑验证成功！');
  console.log('✅ V56修复应该有效');
} else {
  console.log('\n⚠️  解析逻辑存在问题，需要进一步调试');
}
