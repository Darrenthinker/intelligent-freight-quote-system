// 调试批量格式示例的单件重量计算问题
console.log('=== 调试批量格式示例 ===');

const newFormatText = `148*113*80/1
168*113*72.5/1
188.5*35.5*71/1
单个托盘120KG`;

console.log('输入文本:');
console.log(newFormatText);
console.log('');

// 逐步调试解析过程
console.log('1. 基本格式解析测试:');
const basicFormatRegex = /(\d+(?:\.\d+)?)\s*[*×x]\s*(\d+(?:\.\d+)?)\s*[*×x]\s*(\d+(?:\.\d+)?)\s*[\/]\s*(\d+)/gi;
const basicMatches = newFormatText.match(basicFormatRegex);
console.log('基本格式匹配:', basicMatches);

let totalPieces = 0;
if (basicMatches) {
  basicMatches.forEach((match, index) => {
    const sizeMatch = match.match(/(\d+(?:\.\d+)?)\s*[*×x]\s*(\d+(?:\.\d+)?)\s*[*×x]\s*(\d+(?:\.\d+)?)\s*[\/]\s*(\d+)/i);
    if (sizeMatch) {
      const quantity = Number.parseInt(sizeMatch[4]);
      totalPieces += quantity;
      console.log(`  ${index + 1}. ${match} -> 数量: ${quantity}`);
    }
  });
  console.log(`  总件数: ${totalPieces}`);
}

console.log('');
console.log('2. 单件重量解析测试:');
const singleWeightRegex = /单[个件](?:托盘|重量|重)?[：:]?\s*(\d+(?:\.\d+)?)\s*(?:KG|kg|公斤)/i;
const singleWeightMatch = newFormatText.match(singleWeightRegex);
console.log('单件重量匹配:', singleWeightMatch);

if (singleWeightMatch) {
  const singleWeight = Number.parseFloat(singleWeightMatch[1]);
  console.log(`单件重量: ${singleWeight}kg`);
  console.log(`总重量应该是: ${singleWeight} × ${totalPieces} = ${singleWeight * totalPieces}kg`);
}

console.log('');
console.log('3. 检查解析顺序:');
console.log('步骤1: 基本格式解析 -> 设置pieces = 3');
console.log('步骤2: 单件重量解析 -> 如果!result.weight && result.pieces存在 -> 计算总重量');
console.log('');

// 模拟实际解析顺序
console.log('4. 模拟实际解析:');
const mockResult = {};

// 步骤1: 基本格式解析
if (basicMatches) {
  let pieces = 0;
  basicMatches.forEach(match => {
    const sizeMatch = match.match(/(\d+(?:\.\d+)?)\s*[*×x]\s*(\d+(?:\.\d+)?)\s*[*×x]\s*(\d+(?:\.\d+)?)\s*[\/]\s*(\d+)/i);
    if (sizeMatch) {
      pieces += Number.parseInt(sizeMatch[4]);
    }
  });
  mockResult.pieces = pieces;
  console.log(`✓ 步骤1完成: pieces = ${mockResult.pieces}`);
}

// 步骤2: 重量解析 (先检查直接重量)
const directWeightMatch = newFormatText.match(/(\d+(?:\.\d+)?)\s*(?:kgs?|KGS?|公斤|千克)/i);
if (directWeightMatch) {
  mockResult.weight = Number.parseFloat(directWeightMatch[1]);
  console.log(`✓ 找到直接重量: ${mockResult.weight}kg`);
}

// 步骤3: 单件重量解析
if (!mockResult.weight && mockResult.pieces && singleWeightMatch) {
  const singleWeight = Number.parseFloat(singleWeightMatch[1]);
  mockResult.weight = singleWeight * mockResult.pieces;
  console.log(`✓ 步骤3完成: 单件重量 ${singleWeight}kg × ${mockResult.pieces}件 = ${mockResult.weight}kg`);
} else {
  console.log(`❌ 步骤3跳过: weight=${mockResult.weight}, pieces=${mockResult.pieces}, singleWeightMatch=${!!singleWeightMatch}`);
}

console.log('');
console.log('=== 诊断结果 ===');
console.log('最终结果:', mockResult);
console.log('预期重量: 360kg');
console.log('实际重量:', mockResult.weight || '未计算');

if (mockResult.weight !== 360) {
  console.log('');
  console.log('🔍 问题分析:');
  if (directWeightMatch) {
    console.log(`❌ 问题找到! 直接重量解析匹配了"120KG"，导致单件重量计算被跳过`);
    console.log(`直接重量匹配结果: "${directWeightMatch[0]}"`);
    console.log('解决方案: 需要优化重量解析的优先级，让单件重量计算优先于直接重量');
  }
}
