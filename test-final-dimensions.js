// 最终尺寸调试测试
import { parseCargoText } from './src/lib/cargo-parser.js';

const sampleCargoText = `WAW设备及配件
2500 kgs ; 14.71 cbm ; 6托
货在广州
120x100x65 cm
192x135x130 cm
192x135x104 cm
192x135x104 cm
192x135x104 cm
192x122x105 cm`;

console.log('🎯 最终尺寸调试测试');
console.log('输入数据：', sampleCargoText);
console.log('=====================');

// 解析前检查
const lines = sampleCargoText.split('\n');
console.log('分行结果：', lines);

// 检查尺寸行过滤
const traditionalSizeLines = sampleCargoText.split('\n').filter(line => {
  return line.trim().match(/^\s*(\d+(?:\.\d+)?)\s*[x×*]\s*(\d+(?:\.\d+)?)\s*[x×*]\s*(\d+(?:\.\d+)?)\s*(?:cm|CM|mm|MM)?\s*$/);
});

console.log('✅ 应该识别的尺寸行：', traditionalSizeLines);

// 解析结果
const parsed = parseCargoText(sampleCargoText);
console.log('📊 最终解析结果：', JSON.stringify(parsed, null, 2));

console.log('\n🔍 关键检查：');
console.log('- 货物名称:', parsed.name);
console.log('- 重量:', parsed.weight);
console.log('- 体积:', parsed.volume);
console.log('- 托盘:', parsed.pallets);
console.log('- 件数:', parsed.pieces);
console.log('- 尺寸数组:', parsed.dimensions ? `${parsed.dimensions.length}个尺寸` : '未识别到尺寸');

if (parsed.dimensions && parsed.dimensions.length > 0) {
  console.log('\n📏 尺寸明细：');
  parsed.dimensions.forEach((dim, index) => {
    console.log(`  ${index + 1}: ${dim.length} × ${dim.width} × ${dim.height} ${dim.unit} (数量: ${dim.quantity})`);
  });
}
