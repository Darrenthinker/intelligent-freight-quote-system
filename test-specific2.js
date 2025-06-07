// 更详细地测试三元组匹配
const testAllPatterns = (text) => {
  const normalized = text
    .replace(/\/\/+/g, '/')
    .replace(/\?\?+/g, '')
    .replace(/\?/g, '')
    .replace(/\s*\/\s*/g, '/')
    .replace(/\s*\*\s*/g, '*')
    .replace(/\s+/g, ' ')
    .trim();

  console.log('测试文本:', normalized);

  // 所有可能的三元组模式
  const patterns = [
    // 第0个模式 - KHI/2289KG/5.88CBM/109CTN
    /([A-Z]{3})\s*[\/]\s*(\d+(?:\.\d+)?)\s*(?:KG|kg|kgs|KGS)\s*[\/]\s*(\d+(?:\.\d+)?)\s*(?:CBM|cbm|方|立方|m3)\s*[\/]\s*(\d+(?:\.\d+)?)\s*(?:CTN|ctns|ctn|CTNS|箱|件|个)/i,

    // 第3个模式 - 120/3000KG/11.8CBM (需要KG单位)
    /(\d+(?:\.\d+)?)\s*[\/,]\s*(\d+(?:\.\d+)?)\s*(?:KG|kg|kgs|KGS|公斤)\s*[\/,]\s*(\d+(?:\.\d+)?)\s*(?:CBM|cbm|方|立方|m3)/i,

    // 可能有个危险的模式 - 没有单位要求的？
    /(\d+(?:\.\d+)?)\s*[\/,]\s*(\d+(?:\.\d+)?)\s*[\/,]\s*(\d+(?:\.\d+)?)\s*(?:CBM|cbm|方|立方|m3)/i,
  ];

  patterns.forEach((pattern, index) => {
    const match = normalized.match(pattern);
    console.log(`模式 ${index}:`, match ? '匹配' : '不匹配');
    if (match) {
      console.log('  匹配内容:', match[0]);
      console.log('  分组:', match.slice(1));
    }
  });
};

testAllPatterns('LHR 2/456.7/3.2CBM 80X60X120cm 90X70X110cm 货在上海');
