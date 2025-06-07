// 测试当前批量格式解析结果
import { parseCargoText } from './src/lib/cargo-parser.ts';

console.log('🧪 测试当前批量格式解析...\n');

const batchFormatTest = `148*113*80/1
168*113*72.5/1
188.5*35.5*71/1
单个托盘120KG`;

const result = parseCargoText(batchFormatTest);
console.log('当前解析结果:', JSON.stringify(result, null, 2));

console.log('\n期望结果应该是:');
console.log('- 3个尺寸规格');
console.log('- 总件数: 3件 (1+1+1)');
console.log('- 单件重量: 120kg');
console.log('- 总重量: 360kg (120×3)');
console.log('- 包装类型: pieces');
