// 从真实代码中复制的所有三元组模式
const realPatterns = [
  // 第0个
  /([A-Z]{3})\s*[\/]\s*(\d+(?:\.\d+)?)\s*(?:KG|kg|kgs|KGS)\s*[\/]\s*(\d+(?:\.\d+)?)\s*(?:CBM|cbm|方|立方|m3)\s*[\/]\s*(\d+(?:\.\d+)?)\s*(?:CTN|ctns|ctn|CTNS|箱|件|个)/i,
  // 第1个
  /([A-Z]{3})\s+(\d+(?:\.\d+)?)\s*(?:CTN|ctns|ctn|CTNS)\s*[\/]?\s*(?:GW|gw|毛重|Gross Weight)\s*(\d+(?:\.\d+)?)\s*(?:KG|kg|kgs|KGS)\s*[\/]?\s*(\d+(?:\.\d+)?)\s*(?:CBM|cbm|方|立方|m3)\s*[\/]?\s*(?:CW|cw|计费重|Chargeable Weight)\s*(\d+(?:\.\d+)?)\s*(?:KG|kg|kgs|KGS)/i,
  // 第2个
  /([A-Z]{3})\s+(\d+(?:\.\d+)?)\s*(?:CTN|ctns|ctn|CTNS)\s*[\/]?\s*(?:GW|gw|毛重|Gross Weight)\s*(\d+(?:\.\d+)?)\s*(?:KG|kg|kgs|KGS)\s*[\/]?\s*(\d+(?:\.\d+)?)\s*(?:CBM|cbm|方|立方|m3)\s*[\/]?\s*(?:CW|cw|计费重|Chargeable Weight)\s*(\d+(?:\.\d+)?)\s*(?:KG|kg|kgs|KGS)/i,
  // 第3个
  /([A-Z]{3})\s+(\d+(?:\.\d+)?)\s*(?:CTN|ctns|ctn|CTNS)\s*[\/]?\s*(?:NW|nw|净重|Net Weight)\s*(\d+(?:\.\d+)?)\s*(?:KG|kg|kgs|KGS)\s*[\/]?\s*(\d+(?:\.\d+)?)\s*(?:CBM|cbm|方|立方|m3)\s*[\/]?\s*(?:CW|cw|计费重|Chargeable Weight)\s*(\d+(?:\.\d+)?)\s*(?:KG|kg|kgs|KGS)/i,
  // 第4个
  /(\d+(?:\.\d+)?)\s*[\/,]\s*(\d+(?:\.\d+)?)\s*(?:KG|kg|kgs|KGS|公斤)\s*[\/,]\s*(\d+(?:\.\d+)?)\s*(?:CBM|cbm|方|立方|m3)/i,
  // 第5个
  /([A-Z]{3})\s*-{2,3}\s*([A-Z]{3})\s+(\d+(?:\.\d+)?)\s*[×x*]\s*(\d+(?:\.\d+)?)\s*[×x*]\s*(\d+(?:\.\d+)?)\s*(?:厘米|cm|CM)\s+(\d+(?:\.\d+)?)\s*方\s+计费重\s*(\d+(?:\.\d+)?)\s*(?:KG|kg)/i,
  // 第6个
  /([A-Z]{3})\s*-{2,3}\s*([A-Z]{3})\s+计费重\s*(\d+(?:\.\d+)?)\s*(?:KG|kg)\s+(\d+(?:\.\d+)?)\s*方/i,
  // 第7个
  /([A-Z]{3})\s+(\d+(?:\.\d+)?)\s*(?:ctn|ctns|箱|件|个)\s+(\d+(?:\.\d+)?)\s*(?:kg|kgs|KG|KGS)\s+(\d+(?:\.\d+)?)\s*(?:cbm|CBM|方|立方|m3)/i,
  // 第8个
  /([A-Z]{3})\s*(\d+(?:\.\d+)?)\s*(?:KG|kg|kgs|KGS)\s*(\d+(?:\.\d+)?)\s*(?:CBM|cbm|方|立方|m3)\s*(\d+)\s*(?:CTNS|ctns|箱)/i,
  // 第9个
  /([A-Z]{3})\s+(\d+(?:\.\d+)?)\s*[\/]\s*(\d+(?:\.\d+)?)\s*[\/]\s*(\d+(?:\.\d+)?)\s*\*\s*(\d+(?:\.\d+)?)\s*\*\s*(\d+(?:\.\d+)?)\s*cm\s*\*\s*(\d+)\s*(?:CTNS|ctns|箱)/i,
  // 第10个
  /(\d+(?:\.\d+)?)\s*[\/]\s*(\d+(?:\.\d+)?)\s*[\/]\s*(\d+(?:\.\d+)?)\s*\*\s*(\d+(?:\.\d+)?)\s*\*\s*(\d+(?:\.\d+)?)\s*cm\s*\*\s*(\d+)\s*(?:CTNS|ctns|箱)/i,
  // 第11个
  /(\d+(?:\.\d+)?)\s*(?:KG|kg|kgs|KGS|公斤)\s*[\/,]\s*(\d+)\s*(?:件|个|箱|托|pcs?|pieces?|CTNS|ctns)\s*[\/,]\s*(\d+(?:\.\d+)?)\s*(?:CBM|cbm|方|立方|m3)/i,
  // 第12个
  /(\d+)\s*(?:件|个|箱|托|pcs?|pieces?|CTNS|ctns)\s*[\/,]\s*(\d+(?:\.\d+)?)\s*(?:KG|kg|kgs|KGS|公斤)\s*[\/,]\s*(\d+(?:\.\d+)?)\s*(?:CBM|cbm|方|立方|m3)/i,
  // 第13个
  /(\d+(?:\.\d+)?)\s*(?:CBM|cbm|方|立方|m3)\s*[\/,]\s*(\d+(?:\.\d+)?)\s*(?:KG|kg|kgs|KGS|公斤)\s*[\/,]\s*(\d+)\s*(?:件|个|箱|托|pcs?|pieces?|CTNS|ctns)/i,
  // 第14个
  /(\d+(?:\.\d+)?)\s*(?:KG|kg|kgs|KGS|公斤)\s*[\/,]\s*(\d+(?:\.\d+)?)\s*(?:CBM|cbm|方|立方|m3)\s*[\/,]\s*(\d+)\s*(?:件|个|箱|托|pcs?|pieces?|CTNS|ctns)/i,
  // 第15个
  /(\d+)\s*(?:件|个|箱|托|pcs?|pieces?|CTNS|ctns)\s*[\/,]\s*(\d+(?:\.\d+)?)\s*(?:CBM|cbm|方|立方|m3)\s*[\/,]\s*(\d+(?:\.\d+)?)\s*(?:KG|kg|kgs|KGS|公斤)/i,
  // 第16个
  /(\d+(?:\.\d+)?)\s*(?:CBM|cbm|方|立方|m3)\s*[\/,]\s*(\d+)\s*(?:件|个|箱|托|pcs?|pieces?|CTNS|ctns)\s*[\/,]\s*(\d+(?:\.\d+)?)\s*(?:KG|kg|kgs|KGS|公斤)/i,
  // 第17个
  /(\d+(?:\.\d+)?)\s+(?:件|个|箱|托|pcs?|pieces?|CTNS|ctns)\s*[\/,]\s*(\d+(?:\.\d+)?)\s+(?:CBM|cbm|方|立方|m3)\s*[\/,]\s*(\d+(?:\.\d+)?)\s+(?:KG|kg|kgs|KGS|公斤)/i,
  // 第18个
  /(\d+(?:\.\d+)?)\s+(?:KG|kg|kgs|KGS|公斤)\s*[\/,]\s*(\d+(?:\.\d+)?)\s+(?:件|个|箱|托|pcs?|pieces?|CTNS|ctns)\s*[\/,]\s*(\d+(?:\.\d+)?)\s+(?:CBM|cbm|方|立方|m3)/i,
  // 第19个
  /(\d+(?:\.\d+)?)\s+(?:CBM|cbm|方|立方|m3)\s*[\/,]\s*(\d+(?:\.\d+)?)\s+(?:KG|kg|kgs|KGS|公斤)\s*[\/,]\s*(\d+(?:\.\d+)?)\s+(?:件|个|箱|托|pcs?|pieces?|CTNS|ctns)/i,
];

const testText = 'LHR 2/456.7/3.2CBM 80X60X120cm 90X70X110cm 货在上海';

console.log('测试文本:', testText);
console.log('==================');

realPatterns.forEach((pattern, index) => {
  const match = testText.match(pattern);
  if (match) {
    console.log(`❌ 模式 ${index} 匹配了!`);
    console.log('匹配内容:', match[0]);
    console.log('分组:', match.slice(1));
    console.log('---');
  }
});

console.log('测试完成');
