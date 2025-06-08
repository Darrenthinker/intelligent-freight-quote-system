// V57修复验证测试脚本
import { parseCargoText, calculateCargoMetrics } from './src/lib/cargo-parser.js';

console.log('🔥 V57修复验证测试开始...\n');

// 测试数据1：米单位
const v57MeterTestSampleText = `重量：23托 重量:9765 KGS
尺寸：1.2*1.0*1.54m
体积：42 CBM`;

console.log('📋 测试案例1（米单位）:');
console.log(v57MeterTestSampleText);
console.log('\n🔬 解析结果:');

try {
  const result1 = parseCargoText(v57MeterTestSampleText);
  console.log('✅ 解析成功:', JSON.stringify(result1, null, 2));

  const calc1 = calculateCargoMetrics(result1, 'air');
  console.log('✅ 计算结果:', JSON.stringify(calc1, null, 2));
} catch (error) {
  console.error('❌ 解析失败:', error.message);
}

console.log('\n' + '='.repeat(50) + '\n');

// 测试数据2：毫米单位
const v57MillimeterTestSampleText = `货在深圳   -TAS  4件/8.95方/1210kg
尺寸1336*706*2005*2件
2546*781*1300*2件
尺寸mm`;

console.log('📋 测试案例2（毫米单位）:');
console.log(v57MillimeterTestSampleText);
console.log('\n🔬 解析结果:');

try {
  const result2 = parseCargoText(v57MillimeterTestSampleText);
  console.log('✅ 解析成功:', JSON.stringify(result2, null, 2));

  const calc2 = calculateCargoMetrics(result2, 'air');
  console.log('✅ 计算结果:', JSON.stringify(calc2, null, 2));
} catch (error) {
  console.error('❌ 解析失败:', error.message);
}

console.log('\n🎯 V57修复验证测试完成!');
