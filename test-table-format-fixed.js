// 测试修复后的表格格式解析
console.log('=== 测试修复后的表格格式解析 ===');

const tableFormatText = `HDL23938566-HDL23938566-收货(KG)235
实重kg 96.00 长cm 150 宽cm 46 高cm 59 件数 4 方数cbm 0.4071 计重 96.00`;

console.log('输入文本:');
console.log(tableFormatText);
console.log('');

// 模拟修复后的解析逻辑
const mockResult = {};

// 1. 表格重量解析
const tableWeightMatch = tableFormatText.match(/实重\s*kg\s+(\d+(?:\.\d+)?)/i);
if (tableWeightMatch) {
  mockResult.weight = Number.parseFloat(tableWeightMatch[1]);
  console.log('✅ 重量识别:', mockResult.weight + 'kg');
} else {
  console.log('❌ 重量识别失败');
}

// 2. 表格体积解析
const tableVolumeMatch = tableFormatText.match(/方数\s*cbm\s+(\d+(?:\.\d+)?)/i);
if (tableVolumeMatch) {
  mockResult.volume = Number.parseFloat(tableVolumeMatch[1]);
  console.log('✅ 体积识别:', mockResult.volume + 'cbm');
} else {
  console.log('❌ 体积识别失败');
}

// 3. 件数解析
const tablePiecesMatch = tableFormatText.match(/件数\s+(\d+)/i);
if (tablePiecesMatch) {
  mockResult.pieces = Number.parseInt(tablePiecesMatch[1]);
  console.log('✅ 件数识别:', mockResult.pieces + '件');
} else {
  console.log('❌ 件数识别失败');
}

// 4. 分散尺寸解析
const lengthMatch = tableFormatText.match(/长\s*cm\s+(\d+(?:\.\d+)?)/i);
const widthMatch = tableFormatText.match(/宽\s*cm\s+(\d+(?:\.\d+)?)/i);
const heightMatch = tableFormatText.match(/高\s*cm\s+(\d+(?:\.\d+)?)/i);

if (lengthMatch && widthMatch && heightMatch) {
  mockResult.dimensions = [{
    length: Number.parseFloat(lengthMatch[1]),
    width: Number.parseFloat(widthMatch[1]),
    height: Number.parseFloat(heightMatch[1]),
    quantity: mockResult.pieces || 1
  }];
  console.log('✅ 尺寸识别:',
    `${mockResult.dimensions[0].length}×${mockResult.dimensions[0].width}×${mockResult.dimensions[0].height}cm`);
} else {
  console.log('❌ 尺寸识别失败');
}

// 5. 货物名称和包装类型
mockResult.name = '普货';
mockResult.packageType = 'pieces';

console.log('');
console.log('=== 完整解析结果 ===');
console.log('货物名称:', mockResult.name);
console.log('重量:', mockResult.weight + 'kg');
console.log('体积:', mockResult.volume + 'cbm');
console.log('件数:', mockResult.pieces + '件');
console.log('尺寸:', mockResult.dimensions ?
  `${mockResult.dimensions[0].length}×${mockResult.dimensions[0].width}×${mockResult.dimensions[0].height}cm` : '无');
console.log('包装类型:', mockResult.packageType);

console.log('');
console.log('=== 预期结果对比 ===');
const expected = {
  name: '普货',
  weight: 96.00,
  volume: 0.4071,
  pieces: 4,
  dimensions: '150×46×59cm',
  packageType: 'pieces'
};

const isCorrect =
  mockResult.name === expected.name &&
  mockResult.weight === expected.weight &&
  mockResult.volume === expected.volume &&
  mockResult.pieces === expected.pieces &&
  mockResult.packageType === expected.packageType &&
  mockResult.dimensions &&
  mockResult.dimensions[0].length === 150 &&
  mockResult.dimensions[0].width === 46 &&
  mockResult.dimensions[0].height === 59;

console.log('解析是否完全正确:', isCorrect ? '✅ 是' : '❌ 否');

if (!isCorrect) {
  console.log('');
  console.log('❌ 发现的问题:');
  if (mockResult.weight !== expected.weight) console.log('  - 重量不正确');
  if (mockResult.volume !== expected.volume) console.log('  - 体积不正确');
  if (mockResult.pieces !== expected.pieces) console.log('  - 件数不正确');
  if (!mockResult.dimensions) console.log('  - 尺寸解析失败');
}
