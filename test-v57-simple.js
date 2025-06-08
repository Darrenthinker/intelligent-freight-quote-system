// 简化测试脚本 - 直接在这里验证逻辑

console.log('🔥 V57修复验证测试开始...\n');

// 测试数据1：米单位
const v57MeterTestSampleText = `重量：23托 重量:9765 KGS
尺寸：1.2*1.0*1.54m
体积：42 CBM`;

console.log('📋 测试案例1（米单位）:');
console.log(v57MeterTestSampleText);

// 测试数据2：毫米单位
const v57MillimeterTestSampleText = `货在深圳   -TAS  4件/8.95方/1210kg
尺寸1336*706*2005*2件
2546*781*1300*2件
尺寸mm`;

console.log('\n📋 测试案例2（毫米单位）:');
console.log(v57MillimeterTestSampleText);

console.log('\n🎯 根据用户反馈，这些数据无法正确识别');
console.log('📌 需要重新检查和修复解析逻辑');

// 检查的关键点：
console.log('\n🔍 关键检查点:');
console.log('1. 米单位: "尺寸：1.2*1.0*1.54m" - 是否正确识别单位为米？');
console.log('2. 毫米单位: "尺寸mm" - 是否正确识别为毫米而不是厘米？');
console.log('3. 特殊重量格式: "重量：23托 重量:9765 KGS" - 是否正确解析？');
console.log('4. 体积标注: "体积：42 CBM" - 是否使用42而不是计算尺寸体积？');

console.log('\n🎯 测试完成 - 需要实际检查Web界面!');
