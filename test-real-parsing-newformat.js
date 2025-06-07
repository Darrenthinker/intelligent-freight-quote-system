// 使用实际的parseCargoText函数测试批量格式示例
import { parseCargoText } from './src/lib/cargo-parser.js';

console.log('=== 使用实际解析函数测试批量格式示例 ===');

const newFormatText = `148*113*80/1
168*113*72.5/1
188.5*35.5*71/1
单个托盘120KG`;

console.log('输入文本:');
console.log(newFormatText);
console.log('');

try {
  const result = parseCargoText(newFormatText);

  console.log('解析结果:');
  console.log('货物名称:', result.name);
  console.log('重量:', result.weight ? result.weight + 'kg' : '无');
  console.log('体积:', result.volume ? result.volume + 'cbm' : '无');
  console.log('件数:', result.pieces ? result.pieces + '件' : '无');
  console.log('托盘数:', result.pallets ? result.pallets + '托' : '无');
  console.log('尺寸数量:', result.dimensions ? result.dimensions.length + '个' : '无');
  console.log('包装类型:', result.packageType || '无');

  console.log('');
  console.log('=== 预期 vs 实际 ===');
  console.log('预期重量: 360kg (120kg × 3件)');
  console.log('实际重量:', result.weight ? result.weight + 'kg' : '无');
  console.log('是否正确:', result.weight === 360 ? '✅ 是' : '❌ 否');

  if (result.weight !== 360) {
    console.log('');
    console.log('🔍 详细调试信息:');
    console.log('完整解析结果:', JSON.stringify(result, null, 2));
  }

} catch (error) {
  console.error('解析失败:', error.message);
}
