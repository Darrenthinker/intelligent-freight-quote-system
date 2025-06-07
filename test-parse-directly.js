// 直接测试解析函数
const fs = require('fs');
const path = require('path');

// 读取cargo-parser.ts文件内容
const cargoParserPath = path.join(__dirname, 'src/lib/cargo-parser.ts');
const cargoParserContent = fs.readFileSync(cargoParserPath, 'utf8');

console.log('🔥 V57修复验证测试开始...\n');

// 测试数据1：米单位
const v57MeterTestSampleText = `重量：23托 重量:9765 KGS
尺寸：1.2*1.0*1.54m
体积：42 CBM`;

console.log('📋 测试案例1（米单位）:');
console.log(v57MeterTestSampleText);

// 检查关键解析点
console.log('\n🔍 代码分析:');
console.log('1. 特殊重量+托盘格式解析:');
const specialWeightRegex = /重量[：:]\s*(\d+(?:\.\d+)?)\s*托\s+重量[：:]\s*(\d+(?:\.\d+)?)\s*(?:KG|kg|kgs|KGS)/i;
const specialMatch = v57MeterTestSampleText.match(specialWeightRegex);
console.log('   - 正则匹配结果:', specialMatch ? '✅ 匹配成功' : '❌ 匹配失败');
if (specialMatch) {
  console.log('   - 托盘数:', specialMatch[1]);
  console.log('   - 重量:', specialMatch[2]);
}

console.log('\n2. 体积标注解析:');
const volumeRegex = /体积[：:]\s*(\d+(?:\.\d+)?)\s*(?:CBM|cbm|方|立方|m3)/i;
const volumeMatch = v57MeterTestSampleText.match(volumeRegex);
console.log('   - 正则匹配结果:', volumeMatch ? '✅ 匹配成功' : '❌ 匹配失败');
if (volumeMatch) {
  console.log('   - 体积:', volumeMatch[1]);
}

console.log('\n3. 米单位尺寸解析:');
const meterRegex = /尺寸[：:]\s*(\d+(?:\.\d+)?)\s*[*×x]\s*(\d+(?:\.\d+)?)\s*[*×x]\s*(\d+(?:\.\d+)?)\s*m(?!m)/gi;
const meterMatch = v57MeterTestSampleText.match(meterRegex);
console.log('   - 正则匹配结果:', meterMatch ? '✅ 匹配成功' : '❌ 匹配失败');
if (meterMatch) {
  console.log('   - 匹配内容:', meterMatch);
}

console.log('\n' + '='.repeat(50) + '\n');

// 测试数据2：毫米单位
const v57MillimeterTestSampleText = `货在深圳   -TAS  4件/8.95方/1210kg
尺寸1336*706*2005*2件
2546*781*1300*2件
尺寸mm`;

console.log('📋 测试案例2（毫米单位）:');
console.log(v57MillimeterTestSampleText);

console.log('\n🔍 代码分析:');
console.log('1. 三元组解析 (4件/8.95方/1210kg):');
const tripleRegex = /(\d+)件[\/]\s*(\d+(?:\.\d+)?)\s*方[\/]\s*(\d+(?:\.\d+)?)\s*kg/i;
const tripleMatch = v57MillimeterTestSampleText.match(tripleRegex);
console.log('   - 正则匹配结果:', tripleMatch ? '✅ 匹配成功' : '❌ 匹配失败');
if (tripleMatch) {
  console.log('   - 件数:', tripleMatch[1]);
  console.log('   - 体积:', tripleMatch[2]);
  console.log('   - 重量:', tripleMatch[3]);
}

console.log('\n2. 毫米单位检测:');
const hasMmUnit = v57MillimeterTestSampleText.includes('尺寸mm') || v57MillimeterTestSampleText.includes('毫米');
console.log('   - 毫米单位检测:', hasMmUnit ? '✅ 检测到' : '❌ 未检测到');

console.log('\n3. 毫米尺寸解析:');
const lines = v57MillimeterTestSampleText.split('\n');
console.log('   - 分行结果:', lines);

// 检查修复后的正则 (支持"尺寸"后面有空格)
const mmRegex1 = /尺寸\s*(\d+(?:\.\d+)?)\s*\*\s*(\d+(?:\.\d+)?)\s*\*\s*(\d+(?:\.\d+)?)\s*\*\s*(\d+)\s*件/gi;
const mmMatch1 = v57MillimeterTestSampleText.match(mmRegex1);
console.log('   - 尺寸开头正则匹配:', mmMatch1 ? '✅ 匹配成功' : '❌ 匹配失败');
if (mmMatch1) {
  console.log('   - 匹配内容:', mmMatch1);
}

// 检查行开头的正则
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const lineRegex = /^(\d+(?:\.\d+)?)\s*\*\s*(\d+(?:\.\d+)?)\s*\*\s*(\d+(?:\.\d+)?)\s*\*\s*(\d+)\s*件/i;
  const lineMatch = line.match(lineRegex);
  if (lineMatch) {
    console.log(`   - 第${i+1}行匹配成功:`, lineMatch[0]);
    console.log(`     尺寸: ${lineMatch[1]}*${lineMatch[2]}*${lineMatch[3]}, 数量: ${lineMatch[4]}`);
  }
}

console.log('\n🎯 分析完成！');
