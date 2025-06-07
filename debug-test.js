// 详细调试测试脚本
const fs = require('fs');

// 读取 TypeScript 文件并尝试理解问题
const cargoParserContent = fs.readFileSync('./src/lib/cargo-parser.ts', 'utf8');

console.log('=== 检查基本格式解析位置 ===');
const basicFormatIndex = cargoParserContent.indexOf('🔥 基本格式解析');
const tripleSystemIndex = cargoParserContent.indexOf('🧠 智能三元组识别系统');

console.log('三元组识别系统位置:', tripleSystemIndex);
console.log('基本格式解析位置:', basicFormatIndex);
console.log('执行顺序:', tripleSystemIndex < basicFormatIndex ? '三元组 -> 基本格式' : '基本格式 -> 三元组');

console.log('\n=== 检查三元组patterns ===');
// 提取三元组pattern的部分
const tripleStart = cargoParserContent.indexOf('const triplePatterns = [');
const tripleEnd = cargoParserContent.indexOf('];', tripleStart);
const triplePatternsText = cargoParserContent.substring(tripleStart, tripleEnd + 2);

// 检查是否有可能匹配 148*113*80/1 的pattern
const testText = '148*113*80/1';
console.log('\n测试文本:', testText);

// 手动检查一些可能匹配的pattern
const possiblePatterns = [
  /(\d+(?:\.\d+)?)\s*[\/,]\s*(\d+(?:\.\d+)?)\s*(?:KG|kg|kgs|KGS|公斤)\s*[\/,]\s*(\d+(?:\.\d+)?)\s*(?:CBM|cbm|方|立方|m3)/i,
  /(\d+(?:\.\d+)?)\s*(?:KG|kg|kgs|KGS|公斤)\s*[\/,]\s*(\d+(?:\.\d+)?)\s*(?:CBM|cbm|方|立方|m3)\s*[\/,]\s*(\d+)\s*(?:件|个|箱|托|pcs?|pieces?|CTNS|ctns)/i
];

console.log('\n检查三元组patterns是否会误匹配:');
for (let i = 0; i < possiblePatterns.length; i++) {
  const match = testText.match(possiblePatterns[i]);
  console.log(`Pattern ${i + 1}:`, match ? 'MATCH! (这会阻止基本格式解析)' : 'no match');
  if (match) {
    console.log('匹配结果:', match);
  }
}

console.log('\n=== 检查基本格式regex ===');
const basicRegex = /(\d+(?:\.\d+)?)\s*[*×x]\s*(\d+(?:\.\d+)?)\s*[*×x]\s*(\d+(?:\.\d+)?)\s*[\/]\s*(\d+)/gi;
const basicMatch = testText.match(basicRegex);
console.log('基本格式匹配:', basicMatch);

console.log('\n=== 检查条件判断 ===');
// 假设 result.dimensions 可能已经被设置
console.log('如果 result.dimensions = [], 条件 (!result.dimensions || result.dimensions.length === 0) =',
  (![] || [].length === 0)); // true
console.log('如果 result.dimensions = [{}], 条件 (!result.dimensions || result.dimensions.length === 0) =',
  (![{}] || [{}].length === 0)); // false
