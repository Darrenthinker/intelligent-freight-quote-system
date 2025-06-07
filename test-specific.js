// 测试具体的LHR示例
const testLHRFormat = (text) => {
  console.log('=== 测试LHR格式 ===');
  console.log('原始文本:', text);

  // 模拟 normalizeText
  const normalized = text
    .replace(/\/\/+/g, '/') // 双斜杠或多斜杠 -> 单斜杠
    .replace(/\?\?+/g, '') // 多个问号 -> 删除
    .replace(/\?/g, '') // 单个问号 -> 删除
    .replace(/\s*\/\s*/g, '/') // 斜杠前后的空格 -> 去除
    .replace(/\s*\*\s*/g, '*') // 星号前后的空格 -> 去除
    .replace(/\s+/g, ' ') // 多个空格 -> 单个空格
    .trim();

  console.log('标准化文本:', normalized);

  // 检查机场代码
  const airportMatch = normalized.match(/\b([A-Z]{3})\b/g);
  console.log('机场代码匹配:', airportMatch);

  // 检查三元组格式 - 这可能是问题所在
  console.log('\n=== 检查三元组模式匹配 ===');

  // 这个可能匹配 "2/456.7/3.2CBM"
  const pattern1 = /(\d+(?:\.\d+)?)\s*[\/,]\s*(\d+(?:\.\d+)?)\s*[\/,]\s*(\d+(?:\.\d+)?)\s*(?:CBM|cbm|方|立方|m3)/i;
  const match1 = normalized.match(pattern1);
  console.log('Pattern1 (数字/数字/体积):', match1);

  if (match1) {
    console.log('⚠️  这会被三元组识别截取，阻止后续解析！');
    return;
  }

  // 检查基本格式
  console.log('\n=== 检查基本格式匹配 ===');
  const basicRegex = /(\d+(?:\.\d+)?)\s*[*×x]\s*(\d+(?:\.\d+)?)\s*[*×x]\s*(\d+(?:\.\d+)?)\s*[\/]\s*(\d+)/gi;
  const basicMatch = normalized.match(basicRegex);
  console.log('基本格式匹配:', basicMatch);

  // 检查尺寸格式（无数量）
  const sizeRegex = /(\d+(?:\.\d+)?)\s*[*×xX]\s*(\d+(?:\.\d+)?)\s*[*×xX]\s*(\d+(?:\.\d+)?)\s*cm/gi;
  const sizeMatch = normalized.match(sizeRegex);
  console.log('尺寸格式匹配:', sizeMatch);
};

const lhrText = `LHR
2/456.7/3.2CBM
80X60X120cm
90X70X110cm
货在上海`;

testLHRFormat(lhrText);
