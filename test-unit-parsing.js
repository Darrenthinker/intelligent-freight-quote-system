// 测试用户提到的两个具体问题
import { parseCargoText, calculateTotalVolume } from './src/lib/cargo-parser.ts';

console.log('🧪 测试用户提到的两个具体单位问题...\n');

// 问题1: 米(m)单位的尺寸没有显示在尺寸明细中
console.log('=== 问题1: 米单位测试 ===');
const meterTest = `重量：23托 重量:9765 KGS
尺寸：1.2*1.0*1.54m
体积：42 CBM`;

const meterResult = parseCargoText(meterTest);
console.log('米单位解析结果:', JSON.stringify(meterResult, null, 2));

if (meterResult.dimensions) {
  console.log('尺寸数量:', meterResult.dimensions.length);
  meterResult.dimensions.forEach((dim, index) => {
    console.log(`尺寸${index + 1}: ${dim.length}×${dim.width}×${dim.height} 单位:${dim.unit || '未识别'} 数量:${dim.quantity}`);

    // 计算体积
    if (dim.unit === 'm') {
      const volume = dim.length * dim.width * dim.height * dim.quantity;
      console.log(`米单位体积计算: ${dim.length}×${dim.width}×${dim.height}×${dim.quantity} = ${volume} cbm`);
    }
  });
}

console.log('\n=== 问题2: 毫米单位测试 ===');
const mmTest = `货在深圳   -TAS  4件/8.95方/1210kg
尺寸1336*706*2005*2件
2546*781*1300*2件
尺寸mm`;

const mmResult = parseCargoText(mmTest);
console.log('毫米单位解析结果:', JSON.stringify(mmResult, null, 2));

if (mmResult.dimensions) {
  console.log('尺寸数量:', mmResult.dimensions.length);
  mmResult.dimensions.forEach((dim, index) => {
    console.log(`尺寸${index + 1}: ${dim.length}×${dim.width}×${dim.height} 单位:${dim.unit || '未识别'} 数量:${dim.quantity}`);

    // 计算体积
    if (dim.unit === 'mm') {
      const volume = (dim.length * dim.width * dim.height * dim.quantity) / 1000000000;
      console.log(`毫米单位体积计算: (${dim.length}×${dim.width}×${dim.height}×${dim.quantity})/1000000000 = ${volume} cbm`);
    } else if (dim.unit === 'cm' || !dim.unit) {
      const volume = (dim.length * dim.width * dim.height * dim.quantity) / 1000000;
      console.log(`❌ 错误按厘米计算: (${dim.length}×${dim.width}×${dim.height}×${dim.quantity})/1000000 = ${volume} cbm`);
    }
  });

  // 使用calculateTotalVolume函数测试
  const totalVolume = calculateTotalVolume(mmResult.dimensions);
  console.log(`总体积 (calculateTotalVolume): ${totalVolume} cbm`);
  console.log(`预期总体积应该是: 8.95 cbm`);
}

console.log('\n=== 总结 ===');
console.log('问题1 (米单位): ', meterResult.dimensions ? '有尺寸数据' : '❌ 没有尺寸数据');
console.log('问题2 (毫米单位): ', mmResult.dimensions ? '有尺寸数据' : '❌ 没有尺寸数据');
