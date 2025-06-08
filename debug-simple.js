// 最简单的独立测试
console.log('=== 最简单的测试 ===');

// 测试文本
const testCases = [
  '148*113*80/1',
  '168*113*72.5/1',
  '80X60X120cm',
  '90X70X110cm',
  '单个托盘120KG'
];

testCases.forEach((text, index) => {
  console.log(`\n测试 ${index + 1}: "${text}"`);

  // 测试基本格式匹配
  const basicRegex = /(\d+(?:\.\d+)?)\s*[*×x]\s*(\d+(?:\.\d+)?)\s*[*×x]\s*(\d+(?:\.\d+)?)\s*[\/]\s*(\d+)/gi;
  const basicMatch = text.match(basicRegex);
  console.log('基本格式匹配:', basicMatch);

  // 测试尺寸格式匹配
  const sizeRegex = /(\d+(?:\.\d+)?)\s*[*×xX]\s*(\d+(?:\.\d+)?)\s*[*×xX]\s*(\d+(?:\.\d+)?)\s*cm/gi;
  const sizeMatch = text.match(sizeRegex);
  console.log('尺寸格式匹配:', sizeMatch);

  // 测试重量格式匹配
  const weightRegex = /单[个件](?:托盘|重量|重)?[：:]?\s*(\d+(?:\.\d+)?)\s*(?:KG|kg|公斤)/i;
  const weightMatch = text.match(weightRegex);
  console.log('重量格式匹配:', weightMatch);
});

console.log('\n=== 组合测试 ===');
const combinedText = `148*113*80/1
168*113*72.5/1
188.5*35.5*71/1
单个托盘120KG`;

console.log('组合文本:', combinedText);

// 标准化处理
const normalized = combinedText
  .replace(/\/\/+/g, '/')
  .replace(/\?\?+/g, '')
  .replace(/\?/g, '')
  .replace(/\s*\/\s*/g, '/')
  .replace(/\s*\*\s*/g, '*')
  .replace(/\s+/g, ' ')
  .trim();

console.log('标准化后:', normalized);

// 基本格式匹配
const allBasicMatches = normalized.match(/(\d+(?:\.\d+)?)\s*[*×x]\s*(\d+(?:\.\d+)?)\s*[*×x]\s*(\d+(?:\.\d+)?)\s*[\/]\s*(\d+)/gi);
console.log('所有基本格式匹配:', allBasicMatches);

if (allBasicMatches) {
  console.log('解析每个匹配:');
  allBasicMatches.forEach((match, i) => {
    const sizeMatch = match.match(/(\d+(?:\.\d+)?)\s*[*×x]\s*(\d+(?:\.\d+)?)\s*[*×x]\s*(\d+(?:\.\d+)?)\s*[\/]\s*(\d+)/i);
    if (sizeMatch) {
      console.log(`  ${i + 1}:`, {
        length: parseFloat(sizeMatch[1]),
        width: parseFloat(sizeMatch[2]),
        height: parseFloat(sizeMatch[3]),
        quantity: parseInt(sizeMatch[4])
      });
    }
  });
}

// 重量匹配测试
const weightMatch = normalized.match(/单[个件](?:托盘|重量|重)?[：:]?\s*(\d+(?:\.\d+)?)\s*(?:KG|kg|公斤)/i);
console.log('重量匹配:', weightMatch);
if (weightMatch) {
  console.log('重量值:', parseFloat(weightMatch[1]));
}
