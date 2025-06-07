// 测试第302行的模式
const testPattern302 = (text) => {
  const normalized = text
    .replace(/\/\/+/g, '/')
    .replace(/\?\?+/g, '')
    .replace(/\?/g, '')
    .replace(/\s*\/\s*/g, '/')
    .replace(/\s*\*\s*/g, '*')
    .replace(/\s+/g, ' ')
    .trim();

  console.log('测试文本:', normalized);

  // 第302行的模式 - 这个可能是问题
  const pattern302 = /(\d+(?:\.\d+)?)\s*[\/]\s*(\d+(?:\.\d+)?)\s*[\/]\s*(\d+(?:\.\d+)?)\s*\*\s*(\d+(?:\.\d+)?)\s*\*\s*(\d+(?:\.\d+)?)\s*cm\s*\*\s*(\d+)\s*(?:CTNS|ctns|箱)/i;

  const match = normalized.match(pattern302);
  console.log('第302行模式匹配:', match ? '匹配' : '不匹配');
  if (match) {
    console.log('匹配内容:', match[0]);
    console.log('分组:', match.slice(1));
  }

  // 但是我觉得可能不是302行的问题，让我检查是否有更宽松的模式
  // 让我检查是否有任何模式可以匹配这个文本
  console.log('\n逐段测试:');
  console.log('2/456.7 部分:', normalized.includes('2/456.7'));
  console.log('3.2CBM 部分:', normalized.includes('3.2CBM'));

  // 检查可能的宽松匹配
  const loosePattern = /(\d+(?:\.\d+)?)\s*[\/]\s*(\d+(?:\.\d+)?)/;
  const looseMatch = normalized.match(loosePattern);
  console.log('宽松匹配 (数字/数字):', looseMatch);

  // 再检查 数字/数字/数字CBM 这种模式
  const suspiciousPattern = /(\d+(?:\.\d+)?)\s*[\/]\s*(\d+(?:\.\d+)?)\s*[\/]\s*(\d+(?:\.\d+)?)\s*(?:CBM|cbm)/i;
  const suspiciousMatch = normalized.match(suspiciousPattern);
  console.log('可疑模式 (数字/数字/数字CBM):', suspiciousMatch ? '匹配' : '不匹配');
  if (suspiciousMatch) {
    console.log('可疑匹配内容:', suspiciousMatch[0]);
  }
};

testPattern302('LHR 2/456.7/3.2CBM 80X60X120cm 90X70X110cm 货在上海');
