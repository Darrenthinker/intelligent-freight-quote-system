// 修复顺序问题的批量测试脚本
console.log('=== 修复版批量测试 ===');

// 只测试关键的前5个示例数据
const keyTestCases = {
  traditional: `WAW设备及配件
2500 kgs ; 14.71 cbm ; 6托
货在广州
120x100x65 cm
192x135x130 cm
192x135x104 cm
192x135x104 cm
192x135x104 cm
192x122x105 cm`,

  newFormat: `148*113*80/1
168*113*72.5/1
188.5*35.5*71/1
单个托盘120KG`,

  latest: "83*63*77CM, 135KG，一托",

  table: `HDL23938566-HDL23938566-收货(KG)235
实重kg 96.00 长cm 150 宽cm 46 高cm 59 件数 4 方数cbm 0.4071 计重 96.00`,

  boxSpec: "箱规：45*35*30cm，一件重是8.08kg 15箱"
};

// 预期结果
const expectedResults = {
  traditional: { weight: 2500, pieces: 6, name: 'WAW设备及配件' },
  newFormat: { weight: 360, pieces: 3, name: '普货' }, // 关键测试！
  latest: { weight: 135, pieces: 1, name: '普货' },
  table: { weight: 96, pieces: 4, name: '普货' },
  boxSpec: { weight: 8.08, name: '普货' }
};

// 修复顺序的解析函数
function fixedParseCargoText(text) {
  const result = {};

  // 步骤1: 基本格式解析（必须先执行，设置pieces）
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
  }

  // 步骤2: 件数和托盘识别
  const tablePiecesMatch = text.match(/件数\s+(\d+)/i);
  if (tablePiecesMatch) {
    result.pieces = Number.parseInt(tablePiecesMatch[1]);
  }

  const chineseNumbers = {'一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8, '九': 9, '十': 10};
  const palletMatch = text.match(/(一|二|三|四|五|六|七|八|九|十|\d+)\s*托/);
  if (palletMatch) {
    const palletText = palletMatch[1];
    result.pallets = chineseNumbers[palletText] || Number.parseInt(palletText);
    if (!result.pieces) {
      result.pieces = result.pallets;
    }
    result.packageType = 'pallets';
  }

  // 步骤3: 重量解析（正确的优先级顺序）
  const tableWeightMatch = text.match(/实重\s*kg\s+(\d+(?:\.\d+)?)/i);
  if (tableWeightMatch) {
    result.weight = Number.parseFloat(tableWeightMatch[1]);
  } else if (result.pieces) {
    // 单件重量计算（必须在pieces设置后）
    const singleWeightMatch = text.match(/单[个件](?:托盘|重量|重)?[：:]?\s*(\d+(?:\.\d+)?)\s*(?:KG|kg|公斤)/i);
    if (singleWeightMatch) {
      const singleWeight = Number.parseFloat(singleWeightMatch[1]);
      result.weight = singleWeight * result.pieces;
    }
  }

  // 如果还没有重量，使用直接重量
  if (!result.weight) {
    const directWeightMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:kgs?|KGS?|公斤|千克)/i);
    if (directWeightMatch) {
      result.weight = Number.parseFloat(directWeightMatch[1]);
    }
  }

  // 步骤4: 货物名称
  const lines = text.trim().split('\n').filter(line => line.trim());
  const firstLine = lines[0]?.trim();

  if (firstLine && !firstLine.match(/^[A-Z]{3}$/) && !firstLine.match(/^\d/)) {
    const nameMatch = text.match(/([A-Z0-9]+[\s]*[^，。；\n\s\d]{2,10}机?)(?:\s*不带电池|带电池)?/i);
    if (nameMatch) {
      const productName = nameMatch[1].trim();
      const excludePattern = /kg|cbm|cm|mm|箱|托|件|空运|海运|报价|帮忙|[A-Z]{3}/i;
      const includePattern = /产品|设备|配件|玩具|机$|器$|电池$/i;

      if (!excludePattern.test(productName) || includePattern.test(productName)) {
        result.name = productName;
      }
    }

    if (!result.name && firstLine.length <= 20) {
      result.name = firstLine;
    }
  }

  if (!result.name) {
    result.name = '普货';
  }

  return result;
}

// 执行测试
console.log('开始关键测试...\n');

let totalTests = 0;
let passedTests = 0;

Object.keys(keyTestCases).forEach((key, index) => {
  totalTests++;
  const testText = keyTestCases[key];
  const expected = expectedResults[key];

  console.log(`${index + 1}. 测试 "${key}":`);
  console.log(`输入: ${testText.substring(0, 30)}...`);

  const result = fixedParseCargoText(testText);

  let isValid = true;
  let issues = [];

  if (expected.weight && result.weight !== expected.weight) {
    issues.push(`重量不匹配: 期望${expected.weight}, 实际${result.weight}`);
    isValid = false;
  }

  if (expected.pieces && result.pieces !== expected.pieces) {
    issues.push(`件数不匹配: 期望${expected.pieces}, 实际${result.pieces}`);
    isValid = false;
  }

  if (expected.name && result.name !== expected.name) {
    issues.push(`名称不匹配: 期望"${expected.name}", 实际"${result.name}"`);
    isValid = false;
  }

  if (isValid) {
    console.log(`   ✅ 通过`);
    passedTests++;
  } else {
    console.log(`   ❌ 失败: ${issues.join(', ')}`);
  }

  console.log(`   结果: 名称="${result.name}", 重量=${result.weight || '无'}, 件数=${result.pieces || '无'}`);

  // 特别关注newFormat测试
  if (key === 'newFormat') {
    console.log(`   🔍 newFormat详细检查:`);
    console.log(`      基本格式解析是否正确: pieces=${result.pieces} (期望3)`);
    console.log(`      单件重量计算是否正确: weight=${result.weight} (期望360)`);
    if (result.weight === 360) {
      console.log(`      🎉 newFormat修复成功！`);
    }
  }

  console.log('');
});

console.log('='.repeat(60));
console.log('📊 关键测试汇总结果');
console.log('='.repeat(60));
console.log(`总测试数: ${totalTests}`);
console.log(`通过数: ${passedTests}`);
console.log(`失败数: ${totalTests - passedTests}`);
console.log(`通过率: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

if (passedTests === totalTests) {
  console.log('\n🎉 所有关键测试通过！修复成功！');
} else {
  console.log('\n❌ 仍有问题需要修复');
}
