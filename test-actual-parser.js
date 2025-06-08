// 使用实际解析器测试V57单位修复

import { parseAndCalculateCargoInfo } from './src/lib/cargo-parser.ts';

// 测试数据1（米）：
const testData1 = `重量：23托 重量:9765 KGS
尺寸：1.2*1.0*1.54m
体积：42 CBM`;

console.log('🧪 测试数据1（米单位）:');
console.log(testData1);
console.log('\n解析结果:');

try {
  const result1 = parseAndCalculateCargoInfo(testData1, 'air');
  console.log('货物信息:', result1.cargoInfo);
  console.log('计算结果:', result1.calculations);

  if (result1.cargoInfo.dimensions && result1.cargoInfo.dimensions.length > 0) {
    console.log('✅ 识别到尺寸明细，单位:', result1.cargoInfo.dimensions[0].unit);
    console.log('📊 计算的总体积:', result1.calculations.totalVolume, 'cbm');

    if (Math.abs(result1.calculations.totalVolume - 42.504) < 0.1) {
      console.log('✅ 米单位体积计算正确!');
    } else {
      console.log('❌ 米单位体积计算错误! 期望: 42.504, 实际:', result1.calculations.totalVolume);
    }
  } else {
    console.log('❌ 未识别到米单位尺寸明细');
  }
} catch (error) {
  console.error('❌ 测试1解析失败:', error.message);
}

console.log('\n' + '='.repeat(50));

// 测试数据2（毫米）：
const testData2 = `货在深圳   -TAS  4件/8.95方/1210kg
尺寸1336*706*2005*2件
2546*781*1300*2件
尺寸mm`;

console.log('🧪 测试数据2（毫米单位）:');
console.log(testData2);
console.log('\n解析结果:');

try {
  const result2 = parseAndCalculateCargoInfo(testData2, 'air');
  console.log('货物信息:', result2.cargoInfo);
  console.log('计算结果:', result2.calculations);

  if (result2.cargoInfo.dimensions && result2.cargoInfo.dimensions.length > 0) {
    console.log('✅ 识别到尺寸明细，单位:', result2.cargoInfo.dimensions[0].unit);
    console.log('📊 计算的总体积:', result2.calculations.totalVolume, 'cbm');

    // 手工计算期望值
    const vol1 = (1336 * 706 * 2005 * 2) / 1000000000;
    const vol2 = (2546 * 781 * 1300 * 2) / 1000000000;
    const expectedVolume = vol1 + vol2;
    console.log('🎯 期望体积:', expectedVolume.toFixed(3), 'cbm');

    if (Math.abs(result2.calculations.totalVolume - expectedVolume) < 0.1) {
      console.log('✅ 毫米单位体积计算正确!');
    } else {
      console.log('❌ 毫米单位体积计算错误! 期望:', expectedVolume.toFixed(3), '实际:', result2.calculations.totalVolume);
    }

    if (Math.abs(result2.calculations.totalVolume - 8.95) < 0.5) {
      console.log('✅ 与标准体积8.95 CBM基本匹配!');
    } else {
      console.log('❌ 与标准体积8.95 CBM差异较大!');
    }
  } else {
    console.log('❌ 未识别到毫米单位尺寸明细');
  }
} catch (error) {
  console.error('❌ 测试2解析失败:', error.message);
}

console.log('\n' + '='.repeat(50));
console.log('🎯 V57修复验证完成!');
