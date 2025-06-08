// 测试V57版本单位修复的脚本

// 导入解析函数（简化版本）
function normalizeText(text) {
  let normalizedText = text;
  normalizedText = normalizedText
    .replace(/\/\/+/g, '/')
    .replace(/\?\?+/g, '')
    .replace(/\?/g, '')
    .replace(/\s*\/\s*/g, '/')
    .replace(/\s*\*\s*/g, '*')
    .replace(/\s+/g, ' ')
    .trim();
  return normalizedText;
}

function calculateTotalVolume(dimensions) {
  return dimensions.reduce((total, dim) => {
    let volume;

    // 根据单位正确计算体积
    switch (dim.unit) {
      case 'm': // 米
        volume = dim.length * dim.width * dim.height; // 已经是立方米
        break;
      case 'mm': // 毫米
        volume = (dim.length * dim.width * dim.height) / 1000000000; // 除以10^9转换为立方米
        break;
      case 'cm': // 厘米
      default:
        volume = (dim.length * dim.width * dim.height) / 1000000; // 除以10^6转换为立方米
        break;
    }

    return total + volume * dim.quantity;
  }, 0);
}

// 测试数据1（米）：
const testData1 = `重量：23托 重量:9765 KGS
尺寸：1.2*1.0*1.54m
体积：42 CBM`;

console.log('🧪 测试数据1（米单位）:');
console.log(testData1);

// 简化解析 - 测试米单位识别
const meterMatch = testData1.match(/尺寸[：:]\s*(\d+(?:\.\d+)?)\s*[*×x]\s*(\d+(?:\.\d+)?)\s*[*×x]\s*(\d+(?:\.\d+)?)\s*m(?!m)/i);
if (meterMatch) {
  const dimensions = [{
    length: parseFloat(meterMatch[1]),
    width: parseFloat(meterMatch[2]),
    height: parseFloat(meterMatch[3]),
    quantity: 23, // 23托
    unit: 'm'
  }];

  console.log('✅ 识别到米单位尺寸:', dimensions);

  const volume = calculateTotalVolume(dimensions);
  console.log('🔥 计算的体积:', volume.toFixed(3), 'cbm');
  console.log('📋 期望体积: 42 CBM');

  // 验证计算是否正确
  const expectedVolume = 1.2 * 1.0 * 1.54 * 23; // 42.624
  console.log('🎯 手工计算期望值:', expectedVolume.toFixed(3), 'cbm');

  if (Math.abs(volume - expectedVolume) < 0.01) {
    console.log('✅ 米单位体积计算正确!');
  } else {
    console.log('❌ 米单位体积计算错误!');
  }
} else {
  console.log('❌ 未能识别米单位尺寸');
}

console.log('\n='.repeat(50));

// 测试数据2（毫米）：
const testData2 = `货在深圳   -TAS  4件/8.95方/1210kg
尺寸1336*706*2005*2件
2546*781*1300*2件
尺寸mm`;

console.log('🧪 测试数据2（毫米单位）:');
console.log(testData2);

// 简化解析 - 测试毫米单位识别
const hasMmUnit = testData2.includes('尺寸mm');
if (hasMmUnit) {
  console.log('✅ 识别到毫米单位提示');

  // 提取尺寸
  const sizeMatches = testData2.match(/(\d+(?:\.\d+)?)\s*\*\s*(\d+(?:\.\d+)?)\s*\*\s*(\d+(?:\.\d+)?)\s*\*\s*(\d+)\s*件/gi);
  if (sizeMatches) {
    const dimensions = [];
    let totalPieces = 0;

    for (const match of sizeMatches) {
      const sizeMatch = match.match(/(\d+(?:\.\d+)?)\s*\*\s*(\d+(?:\.\d+)?)\s*\*\s*(\d+(?:\.\d+)?)\s*\*\s*(\d+)/i);
      if (sizeMatch) {
        dimensions.push({
          length: parseFloat(sizeMatch[1]),
          width: parseFloat(sizeMatch[2]),
          height: parseFloat(sizeMatch[3]),
          quantity: parseInt(sizeMatch[4]),
          unit: 'mm'
        });
        totalPieces += parseInt(sizeMatch[4]);
      }
    }

    console.log('✅ 识别到毫米尺寸:', dimensions);
    console.log('📊 总件数:', totalPieces);

    const volume = calculateTotalVolume(dimensions);
    console.log('🔥 计算的体积:', volume.toFixed(3), 'cbm');
    console.log('📋 期望体积: 8.95 CBM');

    // 手工验证计算
    const vol1 = (1336 * 706 * 2005 * 2) / 1000000000;
    const vol2 = (2546 * 781 * 1300 * 2) / 1000000000;
    const expectedVolume = vol1 + vol2;

    console.log('🎯 手工计算期望值:', expectedVolume.toFixed(3), 'cbm');

    if (Math.abs(volume - expectedVolume) < 0.01) {
      console.log('✅ 毫米单位体积计算正确!');
    } else {
      console.log('❌ 毫米单位体积计算错误!');
    }

    if (Math.abs(volume - 8.95) < 0.5) {
      console.log('✅ 与期望体积8.95 CBM基本匹配!');
    } else {
      console.log('❌ 与期望体积8.95 CBM差异较大!');
    }
  } else {
    console.log('❌ 未能提取毫米尺寸明细');
  }
} else {
  console.log('❌ 未能识别毫米单位提示');
}

console.log('\n='.repeat(50));
console.log('🎯 测试总结:');
console.log('1. 米单位识别和计算');
console.log('2. 毫米单位识别和计算');
console.log('3. calculateTotalVolume函数正确处理不同单位');
