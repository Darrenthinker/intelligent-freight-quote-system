// 直接测试BOM格式正则表达式
const bomText = 'BOM 460CTN/3270KG/34CBM/CW5686KG';

console.log('=== 测试BOM格式正则表达式 ===');
console.log('输入:', bomText);

// 测试现有的正则表达式
const patterns = [
  // 现有模式1 - 需要GW前缀
  /([A-Z]{3})\s+(\d+(?:\.\d+)?)\s*(?:CTN|ctns|ctn|CTNS)\s*[\/]?\s*(?:GW|gw|毛重|Gross Weight)\s*(\d+(?:\.\d+)?)\s*(?:KG|kg|kgs|KGS)\s*[\/]?\s*(\d+(?:\.\d+)?)\s*(?:CBM|cbm|方|立方|m3)\s*[\/]?\s*(?:CW|cw|计费重|Chargeable Weight)\s*(\d+(?:\.\d+)?)\s*(?:KG|kg|kgs|KGS)/i,

  // 现有模式2 - 需要NW前缀
  /([A-Z]{3})\s+(\d+(?:\.\d+)?)\s*(?:CTN|ctns|ctn|CTNS)\s*[\/]?\s*(?:NW|nw|净重|Net Weight)\s*(\d+(?:\.\d+)?)\s*(?:KG|kg|kgs|KGS)\s*[\/]?\s*(\d+(?:\.\d+)?)\s*(?:CBM|cbm|方|立方|m3)\s*[\/]?\s*(?:CW|cw|计费重|Chargeable Weight)\s*(\d+(?:\.\d+)?)\s*(?:KG|kg|kgs|KGS)/i,

  // 新的直接模式 - 无前缀
  /([A-Z]{3})\s+(\d+(?:\.\d+)?)\s*(?:CTN|ctns|ctn|CTNS)\s*[\/]\s*(\d+(?:\.\d+)?)\s*(?:KG|kg|kgs|KGS)\s*[\/]\s*(\d+(?:\.\d+)?)\s*(?:CBM|cbm|方|立方|m3)\s*[\/]\s*(?:CW|cw)?\s*(\d+(?:\.\d+)?)\s*(?:KG|kg|kgs|KGS)/i
];

patterns.forEach((pattern, index) => {
  const match = bomText.match(pattern);
  console.log(`\n模式 ${index + 1}:`, pattern.source);
  console.log('匹配结果:', match ? '✅ 匹配' : '❌ 不匹配');

  if (match) {
    console.log('捕获组:');
    console.log('- 机场代码:', match[1]);
    console.log('- 件数:', match[2]);
    console.log('- 重量:', match[3]);
    console.log('- 体积:', match[4]);
    console.log('- 计费重:', match[5]);
  }
});

console.log('\n=== 结论 ===');
console.log('需要添加新的正则表达式来处理直接BOM格式（无GW/NW前缀）');
