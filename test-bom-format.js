// 测试BOM格式解析
import { parseCargoText } from './src/lib/cargo-parser.js';

console.log('=== 测试BOM格式 ===');

const bomText = 'BOM 460CTN/3270KG/34CBM/CW5686KG';
console.log('输入:', bomText);

const result = parseCargoText(bomText);
console.log('\n解析结果:');
console.log('- 机场代码:', result.destinationCode);
console.log('- 目的地:', result.destination);
console.log('- 件数:', result.pieces);
console.log('- 重量:', result.weight);
console.log('- 体积:', result.volume);
console.log('- 包装类型:', result.packageType);

console.log('\n=== 验证结果 ===');
console.log('期望件数: 460件, 实际:', result.pieces || 0);
console.log('期望重量: 3270kg, 实际:', result.weight || 0);
console.log('期望体积: 34cbm, 实际:', result.volume || 0);

const isCorrect = result.pieces === 460 && result.weight === 3270 && result.volume === 34;
console.log('BOM格式解析', isCorrect ? '✅ 正确' : '❌ 错误');

if (!isCorrect) {
  console.log('\n🔍 详细分析:');
  console.log('完整结果:', JSON.stringify(result, null, 2));
}
