// 测试第一个传统格式示例
import { parseCargoText, calculateCargoMetrics, parseAndCalculateCargoInfo } from './src/lib/cargo-parser.js';

const sampleCargoText = `WAW设备及配件
2500 kgs ; 14.71 cbm ; 6托
货在广州
120x100x65 cm
192x135x130 cm
192x135x104 cm
192x135x104 cm
192x135x104 cm
192x122x105 cm`;

console.log('🎯 测试第一个传统格式示例');
console.log('输入数据：', sampleCargoText);
console.log('=====================');

try {
  // 测试基础解析
  const parsed = parseCargoText(sampleCargoText);
  console.log('📊 解析结果：', JSON.stringify(parsed, null, 2));

  // 测试计算结果
  const calculations = calculateCargoMetrics(parsed, 'air');
  console.log('🧮 计算结果：', JSON.stringify(calculations, null, 2));

  // 测试综合结果
  const { cargoInfo, calculations: calc } = parseAndCalculateCargoInfo(sampleCargoText, 'air');
  console.log('🔄 综合结果：');
  console.log('货物信息：', JSON.stringify(cargoInfo, null, 2));
  console.log('计算结果：', JSON.stringify(calc, null, 2));

} catch (error) {
  console.error('❌ 解析出错：', error);
}
