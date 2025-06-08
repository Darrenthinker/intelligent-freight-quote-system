// 单独测试毫米案例

import { parseAndCalculateCargoInfo } from './src/lib/cargo-parser.ts';

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
  console.log('货物信息:', JSON.stringify(result2.cargoInfo, null, 2));
  console.log('计算结果:', JSON.stringify(result2.calculations, null, 2));

  if (result2.cargoInfo.dimensions && result2.cargoInfo.dimensions.length > 0) {
    console.log('✅ 识别到尺寸明细，单位:', result2.cargoInfo.dimensions[0].unit);
    console.log('📊 计算的总体积:', result2.calculations.totalVolume, 'cbm');

    // 手工计算期望值
    const vol1 = (1336 * 706 * 2005 * 2) / 1000000000;
    const vol2 = (2546 * 781 * 1300 * 2) / 1000000000;
    const expectedVolume = vol1 + vol2;
    console.log('🎯 期望体积（从尺寸计算）:', expectedVolume.toFixed(3), 'cbm');
    console.log('📋 给定的体积: 8.95 cbm');

    // 检查是否使用了给定的体积（8.95）而不是计算的体积
    if (Math.abs(result2.calculations.totalVolume - 8.95) < 0.1) {
      console.log('✅ 正确使用了给定的体积8.95 CBM!');
    } else if (Math.abs(result2.calculations.totalVolume - expectedVolume) < 0.1) {
      console.log('✅ 毫米单位体积计算正确! 使用了尺寸计算的体积');
    } else {
      console.log('❌ 体积计算有问题! 期望:', expectedVolume.toFixed(3), '或8.95, 实际:', result2.calculations.totalVolume);
    }

    // 检查重量和件数
    console.log('📊 重量:', result2.cargoInfo.weight || result2.calculations.totalWeight, 'kg');
    console.log('📊 件数:', result2.cargoInfo.pieces || result2.calculations.totalPieces);
  } else {
    console.log('❌ 未识别到毫米单位尺寸明细');
  }
} catch (error) {
  console.error('❌ 测试2解析失败:', error.message);
}

console.log('\n='.repeat(50));
console.log('🎯 V57毫米单位修复验证完成!');
