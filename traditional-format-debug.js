// 传统格式解析问题调试代码
// 问题：传统格式示例能解析重量、体积、托盘，但不显示尺寸明细计算过程

// 测试数据
const testData = `WAW设备及配件
2500 kgs ; 14.71 cbm ; 6托
货在广州
120x100x65 cm
192x135x130 cm
192x135x104 cm
192x135x104 cm
192x135x104 cm
192x122x105 cm`;

// 当前传统格式解析逻辑（简化版）
function parseTraditionalFormat(correctedText) {
  const result = {};

  // 1. 传统格式主要信息解析 - 这部分工作正常
  const traditionalFormatMatch = correctedText.match(/(\d+(?:\.\d+)?)\s*(?:kgs?|KGS?|公斤)\s*[;；,]\s*(\d+(?:\.\d+)?)\s*(?:cbm|CBM|方|立方|m3)\s*[;；,]\s*(\d+(?:\.\d+)?)\s*(?:托|pallet)/i);

  if (traditionalFormatMatch) {
    result.weight = Number.parseFloat(traditionalFormatMatch[1]); // 2500kg
    result.volume = Number.parseFloat(traditionalFormatMatch[2]); // 14.71cbm
    result.pallets = Number.parseFloat(traditionalFormatMatch[3]); // 6托
    result.pieces = result.pallets; // 托盘数=件数
    result.packageType = 'pallets';

    // 2. 尺寸明细解析 - 这部分可能有问题
    const traditionDimensions = [];
    const lines = correctedText.split('\n');

    console.log('所有行:', lines);

    for (const line of lines) {
      const trimmed = line.trim();
      console.log('检查行:', trimmed);

      const sizeMatch = trimmed.match(/^(\d+)\s*x\s*(\d+)\s*x\s*(\d+)\s*cm$/);
      console.log('尺寸匹配结果:', sizeMatch);

      if (sizeMatch) {
        const dimension = {
          length: Number.parseInt(sizeMatch[1]),
          width: Number.parseInt(sizeMatch[2]),
          height: Number.parseInt(sizeMatch[3]),
          quantity: 1,
          unit: 'cm'
        };
        traditionDimensions.push(dimension);
        console.log('添加尺寸:', dimension);
      }
    }

    console.log('最终尺寸数组:', traditionDimensions);

    if (traditionDimensions.length > 0) {
      result.dimensions = traditionDimensions;
    }
  }

  return result;
}

// UI显示条件检查
function checkUIDisplayCondition(parsedCargo) {
  // UI显示条件：parsedCargo.dimensions && parsedCargo.dimensions.length > 0
  console.log('UI显示检查:');
  console.log('dimensions存在:', !!parsedCargo.dimensions);
  console.log('dimensions长度:', parsedCargo.dimensions ? parsedCargo.dimensions.length : 0);
  console.log('应该显示尺寸明细:', !!(parsedCargo.dimensions && parsedCargo.dimensions.length > 0));
}

// 运行测试
console.log('=== 传统格式解析测试 ===');
const result = parseTraditionalFormat(testData);
console.log('解析结果:', result);
checkUIDisplayCondition(result);

// 预期结果：
// 应该解析出6个尺寸明细：
// 120x100x65 cm -> 0.780 cbm
// 192x135x130 cm -> 3.369 cbm
// 192x135x104 cm (3个) -> 2.700 cbm each
// 192x122x105 cm -> 2.462 cbm
