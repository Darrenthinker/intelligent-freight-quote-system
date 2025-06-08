// 测试 Packing size 解析
const testPackingSize = (text) => {
  console.log('测试 Packing size 解析');
  console.log('原文:', text);

  const normalized = text
    .replace(/\/\/+/g, '/')
    .replace(/\?\?+/g, '')
    .replace(/\?/g, '')
    .replace(/\s*\/\s*/g, '/')
    .replace(/\s*\*\s*/g, '*')
    .replace(/\s+/g, ' ')
    .trim();

  console.log('标准化:', normalized);

  // 模拟 Packing size 解析
  const packingLines = normalized.split('\n');
  const dimensions = [];
  let totalPackingWeight = 0;
  let packingCount = 0;

  console.log('分行:', packingLines);

  for (let i = 0; i < packingLines.length; i++) {
    const currentLine = packingLines[i];
    const nextLine = i + 1 < packingLines.length ? packingLines[i + 1] : '';

    console.log(`行 ${i}:`, currentLine);

    // Packing size 匹配
    const sizeMatch = currentLine.match(/Packing[\s?]*size[\s?：:]*(\d+)\s*\*\s*(\d+)\s*\*\s*(\d+)\s*mm/i);
    if (sizeMatch) {
      console.log('⚠️  发现 Packing size 匹配!', sizeMatch);

      let weight = 0;

      const weightInSameLine = currentLine.match(/Packing[\s?]*Weight[\s?：:]*(\d+(?:\.\d+)?)[\s]*(?:KG|kg)?/i);
      if (weightInSameLine) {
        weight = Number.parseFloat(weightInSameLine[1]);
        console.log('同行重量:', weight);
      } else {
        const weightInNextLine = nextLine.match(/Packing[\s?]*Weight[\s?：:]*(\d+(?:\.\d+)?)[\s]*(?:KG|kg)?/i);
        if (weightInNextLine) {
          weight = Number.parseFloat(weightInNextLine[1]);
          console.log('下行重量:', weight);
        }
      }

      if (weight > 0) {
        totalPackingWeight += weight;
        packingCount++;

        dimensions.push({
          length: Number.parseFloat(sizeMatch[1]) / 10,
          width: Number.parseFloat(sizeMatch[2]) / 10,
          height: Number.parseFloat(sizeMatch[3]) / 10,
          quantity: 1
        });

        console.log('添加到 dimensions:', dimensions[dimensions.length - 1]);
      }
    }
  }

  console.log('最终结果:');
  console.log('dimensions.length:', dimensions.length);
  console.log('packingCount:', packingCount);
  console.log('totalPackingWeight:', totalPackingWeight);

  // 检查条件
  const condition = (!dimensions || dimensions.length === 0);
  console.log('基本格式解析条件 (!dimensions || dimensions.length === 0):', condition);
};

const lhrText = `LHR
2/456.7/3.2CBM
80X60X120cm
90X70X110cm
货在上海`;

testPackingSize(lhrText);
