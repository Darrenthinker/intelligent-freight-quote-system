// 调试尺寸识别
import fs from 'fs';

// 读取cargo-parser.ts源码并在关键位置添加调试日志
const sourceCode = fs.readFileSync('./src/lib/cargo-parser.ts', 'utf8');

// 在传统格式多尺寸解析处添加调试日志
const modifiedCode = sourceCode.replace(
  '// 🔥 修复：传统格式多尺寸解析 - 优先级高于三元组',
  `console.log('🔍 开始传统格式多尺寸解析检查...');
  // 🔥 修复：传统格式多尺寸解析 - 优先级高于三元组`
).replace(
  'if (!result.dimensions || result.dimensions.length === 0) {',
  `console.log('🔍 dimensions检查:', result.dimensions ? '已有' : '无', result.dimensions?.length);
  if (!result.dimensions || result.dimensions.length === 0) {`
).replace(
  'if (traditionalSizeLines.length > 0) {',
  `console.log('🔍 识别到尺寸行数量:', traditionalSizeLines.length, traditionalSizeLines);
  if (traditionalSizeLines.length > 0) {`
).replace(
  'if (newDimensions.length > 0) {',
  `console.log('🔍 解析出的尺寸数量:', newDimensions.length, newDimensions);
  if (newDimensions.length > 0) {`
);

// 写入临时文件
fs.writeFileSync('./src/lib/cargo-parser-debug.js', modifiedCode.replace(/\.ts/g, '.js'));

console.log('✅ 调试版本已生成，运行测试...');

// 动态导入调试版本
const { parseCargoText } = await import('./src/lib/cargo-parser-debug.js');

const sampleCargoText = `WAW设备及配件
2500 kgs ; 14.71 cbm ; 6托
货在广州
120x100x65 cm
192x135x130 cm
192x135x104 cm
192x135x104 cm
192x135x104 cm
192x122x105 cm`;

console.log('🎯 调试尺寸识别');
console.log('输入数据：', sampleCargoText);
console.log('=====================');

const parsed = parseCargoText(sampleCargoText);
console.log('📊 最终解析结果dimensions：', JSON.stringify(parsed.dimensions, null, 2));
