// 内联测试批量格式示例的解析逻辑
console.log('=== 内联测试批量格式示例 ===');

const newFormatText = `148*113*80/1
168*113*72.5/1
188.5*35.5*71/1
单个托盘120KG`;

console.log('输入文本:');
console.log(newFormatText);
console.log('');

// 模拟修复后的解析逻辑
function testNewParsingLogic(text) {
  const result = {};

  // 步骤1: 基本格式解析 (设置pieces)
  const basicFormatMatches = text.match(/(\d+(?:\.\d+)?)\s*[*×x]\s*(\d+(?:\.\d+)?)\s*[*×x]\s*(\d+(?:\.\d+)?)\s*[\/]\s*(\d+)/gi);
  if (basicFormatMatches) {
    let totalPieces = 0;
    basicFormatMatches.forEach(match => {
      const sizeMatch = match.match(/(\d+(?:\.\d+)?)\s*[*×x]\s*(\d+(?:\.\d+)?)\s*[*×x]\s*(\d+(?:\.\d+)?)\s*[\/]\s*(\d+)/i);
      if (sizeMatch) {
        totalPieces += Number.parseInt(sizeMatch[4]);
      }
    });
    result.pieces = totalPieces;
    result.packageType = 'pieces';
    console.log('✓ 步骤1: 基本格式解析完成, pieces =', result.pieces);
  }

  // 步骤2: 重量解析 (新的优先级顺序)
  if (!result.weight) {
    // 2.1 表格格式
    const tableWeightMatch = text.match(/实重\s*kg\s+(\d+(?:\.\d+)?)/i);
    if (tableWeightMatch) {
      result.weight = Number.parseFloat(tableWeightMatch[1]);
      console.log('✓ 步骤2.1: 表格重量解析, weight =', result.weight);
    }

    // 2.2 单件重量格式 (优先处理)
    if (!result.weight && result.pieces) {
      const singleWeightMatch = text.match(/单[个件](?:托盘|重量|重)?[：:]?\s*(\d+(?:\.\d+)?)\s*(?:KG|kg|公斤)/i);
      if (singleWeightMatch) {
        const singleWeight = Number.parseFloat(singleWeightMatch[1]);
        result.weight = singleWeight * result.pieces;
        console.log('✓ 步骤2.2: 单件重量解析, 单件重量 =', singleWeight, ', 总重量 =', result.weight);
      }
    }

    // 2.3 直接重量格式 (最后处理)
    if (!result.weight) {
      const directWeightMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:kgs?|KGS?|公斤|千克)/i);
      if (directWeightMatch) {
        result.weight = Number.parseFloat(directWeightMatch[1]);
        console.log('✓ 步骤2.3: 直接重量解析, weight =', result.weight);
      }
    }
  }

  // 默认货物名称
  result.name = '普货';

  return result;
}

const testResult = testNewParsingLogic(newFormatText);

console.log('');
console.log('=== 测试结果 ===');
console.log('货物名称:', testResult.name);
console.log('重量:', testResult.weight ? testResult.weight + 'kg' : '无');
console.log('件数:', testResult.pieces ? testResult.pieces + '件' : '无');
console.log('包装类型:', testResult.packageType || '无');

console.log('');
console.log('=== 验证 ===');
console.log('预期重量: 360kg');
console.log('实际重量:', testResult.weight ? testResult.weight + 'kg' : '无');
console.log('是否正确:', testResult.weight === 360 ? '✅ 修复成功!' : '❌ 仍有问题');

if (testResult.weight !== 360) {
  console.log('');
  console.log('🔍 问题分析:');

  // 检查各个解析步骤
  const singleWeightMatch = newFormatText.match(/单[个件](?:托盘|重量|重)?[：:]?\s*(\d+(?:\.\d+)?)\s*(?:KG|kg|公斤)/i);
  const directWeightMatch = newFormatText.match(/(\d+(?:\.\d+)?)\s*(?:kgs?|KGS?|公斤|千克)/i);

  console.log('单件重量匹配:', singleWeightMatch ? singleWeightMatch[0] : '无');
  console.log('直接重量匹配:', directWeightMatch ? directWeightMatch[0] : '无');

  if (singleWeightMatch && directWeightMatch) {
    console.log('❌ 两个正则都匹配了同一个"120KG"，需要更精确的正则表达式');
  }
}
