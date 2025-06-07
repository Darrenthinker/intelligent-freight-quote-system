// 测试第三个示例数据：单托格式示例
console.log('=== 测试第三个示例数据：单托格式示例 ===');

const thirdSampleText = "83*63*77CM, 135KG，一托";

console.log('输入文本:', thirdSampleText);
console.log('');

// 1. 测试尺寸识别："83*63*77CM"
console.log('1. 尺寸识别:');
const dimensionRegex = /(\d+(?:\.\d+)?)\s*[*×xX]\s*(\d+(?:\.\d+)?)\s*[*×xX]\s*(\d+(?:\.\d+)?)\s*(?:CM|cm)/i;
const dimensionMatch = thirdSampleText.match(dimensionRegex);

console.log('正则表达式:', dimensionRegex.source);
console.log('匹配结果:', dimensionMatch);

if (dimensionMatch) {
  const length = Number.parseFloat(dimensionMatch[1]);
  const width = Number.parseFloat(dimensionMatch[2]);
  const height = Number.parseFloat(dimensionMatch[3]);
  console.log(`尺寸: ${length}×${width}×${height}cm`);
}

// 2. 测试重量识别："135KG"
console.log('');
console.log('2. 重量识别:');
const weightRegex = /(\d+(?:\.\d+)?)\s*(?:kgs?|KGS?|公斤|千克)/i;
const weightMatch = thirdSampleText.match(weightRegex);

console.log('正则表达式:', weightRegex.source);
console.log('匹配结果:', weightMatch);

if (weightMatch) {
  const weight = Number.parseFloat(weightMatch[1]);
  console.log(`重量: ${weight}kg`);
}

// 3. 测试托盘数识别："一托"
console.log('');
console.log('3. 托盘数识别:');

// 测试中文数字"一托"
const chinesePalletRegex = /一托/;
const chinesePalletMatch = thirdSampleText.match(chinesePalletRegex);
console.log('中文"一托"匹配:', chinesePalletMatch ? '是' : '否');

// 测试数字托盘格式
const palletRegex = /(\d+)\s*托/;
const palletMatch = thirdSampleText.match(palletRegex);
console.log('数字托盘匹配:', palletMatch);

// 如果匹配到"一托"，需要转换为数字
if (chinesePalletMatch) {
  console.log('识别到: 1托 (中文"一"转换为数字1)');
}

// 4. 检查货物名称（应该是"普货"）
console.log('');
console.log('4. 货物名称识别:');
console.log('第一行是尺寸和重量信息，货物名称应该默认为"普货"');

console.log('');
console.log('=== 预期结果 ===');
console.log('货物名称: 普货');
console.log('重量: 135kg');
console.log('托盘数: 1托');
console.log('件数: 1件');
console.log('尺寸: 83×63×77cm');
console.log('包装类型: pallets');

console.log('');
console.log('=== 需要修复的问题 ===');
console.log('❌ 中文数字"一托"无法被当前的托盘识别正则 /(\d+)\s*托/ 匹配');
console.log('❌ 需要添加中文数字转换逻辑："一" -> 1');

// 5. 测试中文数字转换
console.log('');
console.log('5. 中文数字转换测试:');
const chineseNumbers = {
  '一': 1, '二': 2, '三': 3, '四': 4, '五': 5,
  '六': 6, '七': 7, '八': 8, '九': 9, '十': 10
};

const enhancedPalletRegex = /(一|二|三|四|五|六|七|八|九|十|\d+)\s*托/;
const enhancedMatch = thirdSampleText.match(enhancedPalletRegex);

console.log('增强托盘正则:', enhancedPalletRegex.source);
console.log('增强匹配结果:', enhancedMatch);

if (enhancedMatch) {
  const palletText = enhancedMatch[1];
  const palletNumber = chineseNumbers[palletText] || Number.parseInt(palletText);
  console.log(`托盘数: ${palletNumber}托`);
}
