console.log('🔥 测试产品名称提取问题...');

const testInput = "WAW设备及配件";
const airportCode = "WAW";

console.log('📝 输入文本:', testInput);
console.log('✈️ 机场代码:', airportCode);

// 当前的逻辑
const afterAirportCode = testInput.split(airportCode)[1]?.trim();
console.log('📦 机场代码后的文本:', `"${afterAirportCode}"`);
console.log('📏 文本长度:', afterAirportCode?.length);

// 期望结果
console.log('🎯 期望结果:', '"设备及配件"');

// 分析split结果
const splitResult = testInput.split(airportCode);
console.log('🔍 split分析:', splitResult);
console.log('  - 第0部分:', `"${splitResult[0]}"`);
console.log('  - 第1部分:', `"${splitResult[1]}"`);

// 验证条件
const isLengthValid = afterAirportCode && afterAirportCode.length >= 2 && afterAirportCode.length <= 20;
console.log('✅ 长度条件:', isLengthValid);

console.log('\n💡 结论: 逻辑是正确的，应该提取到"设备及配件"');
