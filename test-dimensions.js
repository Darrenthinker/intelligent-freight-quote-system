// 测试尺寸识别
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

console.log('🎯 测试尺寸识别');
console.log('输入数据：', sampleCargoText);
console.log('=====================');

const lines = sampleCargoText.split('\n');
console.log('分行结果：', lines);

// 测试尺寸行过滤
const traditionalSizeLines = sampleCargoText.split('\n').filter(line => {
  const match = line.trim().match(/^\s*(\d+(?:\.\d+)?)\s*[x×*]\s*(\d+(?:\.\d+)?)\s*[x×*]\s*(\d+(?:\.\d+)?)\s*(?:cm|CM|mm|MM)?\s*$/);
  console.log(`检查行 "${line.trim()}"：`, match ? '匹配' : '不匹配');
  return match;
});

console.log('识别的尺寸行：', traditionalSizeLines);

const parsed = parseCargoText(sampleCargoText);
console.log('📊 解析结果dimensions：', JSON.stringify(parsed.dimensions, null, 2));
