// V56版本修复验证脚本
console.log('=== V56版本修复验证测试 ===\n');

// 导入解析函数
const { parseCargoText, calculateCargoMetrics } = require('./src/lib/cargo-parser');

// 测试用例：基本格式（这是V56修复的重点）
const testCase = `148*113*80/1
168*113*72.5/1
188.5*35.5*71/1
单个托盘120KG`;

console.log('🔍 测试用例：');
console.log(testCase);
console.log('\n📋 期望结果：');
console.log('- 货物名称: 148*113*80/1 (第一行)');
console.log('- 尺寸数量: 3个不同尺寸');
console.log('- 总件数: 3件 (1+1+1)');
console.log('- 单件重量: 120kg');
console.log('- 总重量: 360kg (120×3)');
console.log('- 包装类型: pieces');

console.log('\n🚀 开始解析...');

try {
  const cargoInfo = parseCargoText(testCase);
  const calculations = calculateCargoMetrics(cargoInfo, 'sea');

  console.log('\n✅ 解析结果：');
  console.log('货物信息:', cargoInfo);
  console.log('\n📊 计算结果：');
  console.log('计算指标:', calculations);

  console.log('\n🎯 验证结果：');

  // 检查关键指标
  const checks = [
    { name: '货物名称', expected: '148*113*80/1', actual: cargoInfo.name, pass: cargoInfo.name === '148*113*80/1' },
    { name: '总件数', expected: 3, actual: cargoInfo.pieces, pass: cargoInfo.pieces === 3 },
    { name: '总重量', expected: 360, actual: cargoInfo.weight, pass: cargoInfo.weight === 360 },
    { name: '包装类型', expected: 'pieces', actual: cargoInfo.packageType, pass: cargoInfo.packageType === 'pieces' },
    { name: '尺寸数量', expected: 3, actual: cargoInfo.dimensions?.length, pass: cargoInfo.dimensions?.length === 3 }
  ];

  let passCount = 0;
  checks.forEach(check => {
    const status = check.pass ? '✅' : '❌';
    console.log(`${status} ${check.name}: 期望 ${check.expected}, 实际 ${check.actual}`);
    if (check.pass) passCount++;
  });

  console.log(`\n📈 测试通过率: ${passCount}/${checks.length} (${Math.round(passCount/checks.length*100)}%)`);

  if (passCount === checks.length) {
    console.log('\n🎉 V56版本修复成功！基本格式解析功能已完全恢复！');
  } else {
    console.log('\n⚠️  V56版本修复不完整，需要进一步调试');
  }

} catch (error) {
  console.error('❌ 解析失败:', error);
}
