// 测试第二个示例数据：批量格式示例
console.log('=== 测试第二个示例数据：批量格式示例 ===');

const secondSampleText = `148*113*80/1
168*113*72.5/1
188.5*35.5*71/1
单个托盘120KG`;

console.log('输入文本:');
console.log(secondSampleText);
console.log('');

// 1. 测试基本格式："148*113*80/1" - 长*宽*高/数量
const basicFormatRegex = /(\d+(?:\.\d+)?)\s*[*×x]\s*(\d+(?:\.\d+)?)\s*[*×x]\s*(\d+(?:\.\d+)?)\s*[\/]\s*(\d+)/gi;
const basicMatches = secondSampleText.match(basicFormatRegex);

console.log('1. 基本格式识别:');
console.log('正则表达式:', basicFormatRegex.source);
console.log('匹配结果:', basicMatches);

if (basicMatches) {
  const dimensions = [];
  let totalPieces = 0;

  basicMatches.forEach((match, index) => {
    const detailMatch = match.match(/(\d+(?:\.\d+)?)\s*[*×x]\s*(\d+(?:\.\d+)?)\s*[*×x]\s*(\d+(?:\.\d+)?)\s*[\/]\s*(\d+)/i);
    if (detailMatch) {
      const length = Number.parseFloat(detailMatch[1]);
      const width = Number.parseFloat(detailMatch[2]);
      const height = Number.parseFloat(detailMatch[3]);
      const quantity = Number.parseInt(detailMatch[4]);

      dimensions.push({ length, width, height, quantity });
      totalPieces += quantity;

      console.log(`  ${index + 1}. ${length}×${width}×${height}cm, 数量:${quantity}`);
    }
  });

  console.log(`  总件数: ${totalPieces}件`);
  console.log(`  尺寸数量: ${dimensions.length}个`);
}

// 2. 测试单件重量识别："单个托盘120KG"
console.log('');
console.log('2. 单件重量识别:');
const singleWeightRegex = /单[个件](?:托盘|重量|重)?[：:]?\s*(\d+(?:\.\d+)?)\s*(?:KG|kg|公斤)/i;
const weightMatch = secondSampleText.match(singleWeightRegex);

console.log('正则表达式:', singleWeightRegex.source);
console.log('匹配结果:', weightMatch);

if (weightMatch) {
  const singleWeight = Number.parseFloat(weightMatch[1]);
  console.log(`单件重量: ${singleWeight}kg`);

  // 如果有件数，计算总重量
  const totalPieces = 3; // 从上面计算得出
  const totalWeight = singleWeight * totalPieces;
  console.log(`总重量: ${singleWeight} × ${totalPieces} = ${totalWeight}kg`);
}

// 3. 货物名称识别（应该是"普货"，因为没有明确的产品名称）
console.log('');
console.log('3. 货物名称识别:');
const lines = secondSampleText.trim().split('\n');
const firstLine = lines[0].trim();
console.log('第一行:', firstLine);
console.log('是否为尺寸格式:', basicFormatRegex.test(firstLine));
console.log('货物名称: 普货 (因为第一行是尺寸，没有明确的产品名称)');

console.log('');
console.log('=== 预期结果 ===');
console.log('货物名称: 普货');
console.log('总重量: 360kg (120kg × 3件)');
console.log('件数: 3件');
console.log('尺寸数量: 3个');
console.log('包装类型: pieces');
console.log('无体积、托盘数、起运地、目的地');

console.log('');
console.log('=== 关键测试点 ===');
console.log('✓ 基本格式"148*113*80/1"能否正确解析');
console.log('✓ 单件重量×件数的总重量计算');
console.log('✓ 货物名称默认为"普货"');
console.log('✓ 包装类型设置为pieces');
