// 测试增强的托盘识别逻辑
console.log('=== 测试增强的托盘识别逻辑 ===');

const testCases = [
  "83*63*77CM, 135KG，一托",
  "设备 2托",
  "货物 三托",
  "5托盘",
  "十托货物",
  "6托"
];

testCases.forEach((testCase, index) => {
  console.log(`\n${index + 1}. 测试案例: "${testCase}"`);

  // 模拟增强的托盘识别逻辑
  const chineseNumbers = {
    '一': 1, '二': 2, '三': 3, '四': 4, '五': 5,
    '六': 6, '七': 7, '八': 8, '九': 9, '十': 10
  };

  const enhancedPalletMatch = testCase.match(/(一|二|三|四|五|六|七|八|九|十|\d+)\s*托/);

  if (enhancedPalletMatch) {
    const palletText = enhancedPalletMatch[1];
    const palletNumber = chineseNumbers[palletText] || Number.parseInt(palletText);
    console.log(`   ✅ 识别到: ${palletNumber}托`);
  } else {
    console.log(`   ❌ 未识别到托盘数`);
  }
});

console.log('\n=== 第三个示例完整测试 ===');
const thirdSample = "83*63*77CM, 135KG，一托";

// 模拟完整解析
const mockResult = {};

// 1. 尺寸解析
const dimensionMatch = thirdSample.match(/(\d+(?:\.\d+)?)\s*[*×xX]\s*(\d+(?:\.\d+)?)\s*[*×xX]\s*(\d+(?:\.\d+)?)\s*(?:CM|cm)/i);
if (dimensionMatch) {
  mockResult.dimensions = [{
    length: Number.parseFloat(dimensionMatch[1]),
    width: Number.parseFloat(dimensionMatch[2]),
    height: Number.parseFloat(dimensionMatch[3]),
    quantity: 1
  }];
}

// 2. 重量解析
const weightMatch = thirdSample.match(/(\d+(?:\.\d+)?)\s*(?:kgs?|KGS?|公斤|千克)/i);
if (weightMatch) {
  mockResult.weight = Number.parseFloat(weightMatch[1]);
}

// 3. 增强托盘解析
const chineseNumbers = {
  '一': 1, '二': 2, '三': 3, '四': 4, '五': 5,
  '六': 6, '七': 7, '八': 8, '九': 9, '十': 10
};

const enhancedPalletMatch = thirdSample.match(/(一|二|三|四|五|六|七|八|九|十|\d+)\s*托/);
if (enhancedPalletMatch) {
  const palletText = enhancedPalletMatch[1];
  mockResult.pallets = chineseNumbers[palletText] || Number.parseInt(palletText);
  mockResult.pieces = mockResult.pallets;
  mockResult.packageType = 'pallets';
}

// 4. 货物名称默认
mockResult.name = '普货';

console.log('\n解析结果:');
console.log('货物名称:', mockResult.name);
console.log('重量:', mockResult.weight + 'kg');
console.log('托盘数:', mockResult.pallets + '托');
console.log('件数:', mockResult.pieces + '件');
console.log('尺寸:', mockResult.dimensions ? `${mockResult.dimensions[0].length}×${mockResult.dimensions[0].width}×${mockResult.dimensions[0].height}cm` : '无');
console.log('包装类型:', mockResult.packageType);

console.log('\n✅ 第三个示例应该能正确解析了！');
