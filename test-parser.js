// 临时测试脚本 - 测试解析功能
const testBasicFormat = (text) => {
  console.log('Testing text:', text);
  console.log('---');

  // 模拟 normalizeText 函数
  const normalizedText = text
    .replace(/\/\/+/g, '/') // 双斜杠或多斜杠 -> 单斜杠
    .replace(/\?\?+/g, '') // 多个问号 -> 删除
    .replace(/\?/g, '') // 单个问号 -> 删除
    .replace(/\s*\/\s*/g, '/') // 斜杠前后的空格 -> 去除
    .replace(/\s*\*\s*/g, '*') // 星号前后的空格 -> 去除
    .replace(/\s+/g, ' ') // 多个空格 -> 单个空格
    .trim(); // 去除首尾空格

  console.log('Normalized text:', normalizedText);

  // 测试基本格式匹配
  const basicFormatMatches = normalizedText.match(/(\d+(?:\.\d+)?)\s*[*×x]\s*(\d+(?:\.\d+)?)\s*[*×x]\s*(\d+(?:\.\d+)?)\s*[\/]\s*(\d+)/gi);
  console.log('Basic format matches:', basicFormatMatches);

  // 测试单件重量匹配
  const singleWeightMatch = normalizedText.match(/单[个件](?:托盘|重量|重)?[：:]?\s*(\d+(?:\.\d+)?)\s*(?:KG|kg|公斤)/i);
  console.log('Single weight match:', singleWeightMatch);

  console.log('===================');
};

// 测试基本格式
const testText1 = `148*113*80/1
168*113*72.5/1
188.5*35.5*71/1
单个托盘120KG`;

testBasicFormat(testText1);

// 测试单行
testBasicFormat('148*113*80/1');
testBasicFormat('单个托盘120KG');
