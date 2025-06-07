// 测试第四个示例数据：表格格式示例
console.log('=== 测试第四个示例数据：表格格式示例 ===');

const fourthSampleText = `HDL23938566-HDL23938566-收货(KG)235
实重kg 96.00 长cm 150 宽cm 46 高cm 59 件数 4 方数cbm 0.4071 计重 96.00`;

console.log('输入文本:');
console.log(fourthSampleText);
console.log('');

// 1. 测试基本重量识别
console.log('1. 重量识别测试:');
const weightRegex = /(\d+(?:\.\d+)?)\s*(?:kgs?|KGS?|公斤|千克)/i;
const weightMatch = fourthSampleText.match(weightRegex);
console.log('基本重量正则:', weightMatch);

// 表格格式特殊重量识别
const tableWeightRegex = /实重\s*kg\s+(\d+(?:\.\d+)?)/i;
const tableWeightMatch = fourthSampleText.match(tableWeightRegex);
console.log('表格重量正则:', tableWeightMatch);

// 2. 测试体积识别
console.log('');
console.log('2. 体积识别测试:');
const volumeRegex = /(\d+(?:\.\d+)?)\s*(?:cbm|CBM|方|立方|m3)/i;
const volumeMatch = fourthSampleText.match(volumeRegex);
console.log('基本体积正则:', volumeMatch);

// 表格格式特殊体积识别
const tableVolumeRegex = /方数\s*cbm\s+(\d+(?:\.\d+)?)/i;
const tableVolumeMatch = fourthSampleText.match(tableVolumeRegex);
console.log('表格体积正则:', tableVolumeMatch);

// 3. 测试件数识别
console.log('');
console.log('3. 件数识别测试:');
const piecesRegex = /件数\s+(\d+)/i;
const piecesMatch = fourthSampleText.match(piecesRegex);
console.log('件数正则:', piecesMatch);

// 4. 测试尺寸识别（分散式）
console.log('');
console.log('4. 尺寸识别测试:');
const lengthRegex = /长\s*cm\s+(\d+(?:\.\d+)?)/i;
const widthRegex = /宽\s*cm\s+(\d+(?:\.\d+)?)/i;
const heightRegex = /高\s*cm\s+(\d+(?:\.\d+)?)/i;

const lengthMatch = fourthSampleText.match(lengthRegex);
const widthMatch = fourthSampleText.match(widthRegex);
const heightMatch = fourthSampleText.match(heightRegex);

console.log('长度匹配:', lengthMatch);
console.log('宽度匹配:', widthMatch);
console.log('高度匹配:', heightMatch);

if (lengthMatch && widthMatch && heightMatch) {
  const length = Number.parseFloat(lengthMatch[1]);
  const width = Number.parseFloat(widthMatch[1]);
  const height = Number.parseFloat(heightMatch[1]);
  console.log(`组合尺寸: ${length}×${width}×${height}cm`);
}

// 5. 货物名称识别（应该是普货）
console.log('');
console.log('5. 货物名称识别:');
console.log('第一行是单号信息，应该默认为"普货"');

console.log('');
console.log('=== 模拟解析结果 ===');
const mockResult = {};

// 重量
if (tableWeightMatch) {
  mockResult.weight = Number.parseFloat(tableWeightMatch[1]);
}

// 体积
if (tableVolumeMatch) {
  mockResult.volume = Number.parseFloat(tableVolumeMatch[1]);
}

// 件数
if (piecesMatch) {
  mockResult.pieces = Number.parseInt(piecesMatch[1]);
}

// 尺寸
if (lengthMatch && widthMatch && heightMatch) {
  mockResult.dimensions = [{
    length: Number.parseFloat(lengthMatch[1]),
    width: Number.parseFloat(widthMatch[1]),
    height: Number.parseFloat(heightMatch[1]),
    quantity: mockResult.pieces || 1
  }];
}

// 货物名称
mockResult.name = '普货';
mockResult.packageType = 'pieces';

console.log('货物名称:', mockResult.name);
console.log('重量:', mockResult.weight ? mockResult.weight + 'kg' : '未识别');
console.log('体积:', mockResult.volume ? mockResult.volume + 'cbm' : '未识别');
console.log('件数:', mockResult.pieces ? mockResult.pieces + '件' : '未识别');
console.log('尺寸:', mockResult.dimensions ?
  `${mockResult.dimensions[0].length}×${mockResult.dimensions[0].width}×${mockResult.dimensions[0].height}cm` : '未识别');
console.log('包装类型:', mockResult.packageType);

console.log('');
console.log('=== 需要添加的表格格式解析逻辑 ===');
console.log('❌ 需要添加"实重kg XX.XX"格式的重量识别');
console.log('❌ 需要添加"方数cbm XX.XX"格式的体积识别');
console.log('❌ 需要添加"件数 X"格式的件数识别');
console.log('❌ 需要添加分散尺寸"长cm XX 宽cm XX 高cm XX"的识别');
