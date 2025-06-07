// 测试产品名称提取
const sampleCargoText = `WAW设备及配件
2500 kgs ; 14.71 cbm ; 6托
货在广州
120x100x65 cm`;

console.log('🎯 测试产品名称提取');
console.log('输入数据：', sampleCargoText);
console.log('=====================');

const correctedText = sampleCargoText;
const firstLine = correctedText.split('\n')[0]?.trim();
console.log('第一行:', firstLine);

// 测试第一行是否符合条件
const isNotAirportCode = !firstLine.match(/^\s*[A-Z]{3}\s*$/);
const hasNoDataInfo = !firstLine.match(/\d+.*(?:kg|cbm|cm|方|托|件|箱)/);

console.log('不是纯机场代码:', isNotAirportCode);
console.log('不包含数据信息:', hasNoDataInfo);

if (firstLine && isNotAirportCode && hasNoDataInfo) {
  const cleanName = firstLine.replace(/[?？]/g, '').trim();
  console.log('清理后的名称:', cleanName);
  console.log('长度检查:', cleanName.length >= 2 && cleanName.length <= 20);

  if (cleanName.length >= 2 && cleanName.length <= 20) {
    console.log('✅ 应该提取为产品名称:', cleanName);
  }
} else {
  console.log('❌ 不符合第一行产品名称条件');
}

// 测试产品名称过滤逻辑
const productName = "WAW设备及配件";
const hasDeviceKeyword = productName.match(/产品|设备|配件|玩具|机$|器$|电池$/i);
const isPureAirportCode = productName.match(/^[A-Z]{3}$/);

console.log('包含设备关键词:', hasDeviceKeyword);
console.log('是纯三字代码:', isPureAirportCode);

if (hasDeviceKeyword || !isPureAirportCode) {
  console.log('✅ 应该通过过滤检查');
} else {
  console.log('❌ 被过滤检查拒绝');
}
