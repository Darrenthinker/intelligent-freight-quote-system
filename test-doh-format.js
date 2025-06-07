// DOH格式解析测试
console.log('=== DOH格式解析测试 ===\n');

// 测试数据：用户提供的DOH格式
const testInput = `DOH
3/908.3/5.66CBM
110X120X141cm
110X120X143cm
110X120X145CM
货在河南`;

console.log('测试输入：');
console.log(testInput);
console.log('\n期望结果：');
console.log('- 件数: 3件');
console.log('- 重量: 908.3kg');
console.log('- 体积: 5.66cbm');
console.log('- 3种不同尺寸');
console.log('- 起运地: 河南');

// 模拟DOH格式解析逻辑
function testDOHFormatParsing(text) {
  const result = {};

  // 1. 三元组格式2解析："3/908.3/5.66CBM"
  const tripleFormat2 = text.match(/(\d+)\s*\/\s*(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)\s*CBM/i);
  if (tripleFormat2) {
    result.pieces = parseInt(tripleFormat2[1]);
    result.weight = parseFloat(tripleFormat2[2]);
    result.volume = parseFloat(tripleFormat2[3]);
    result.packageType = 'pieces';
    console.log(`✓ 三元组格式2: ${result.pieces}件/${result.weight}kg/${result.volume}cbm`);
  } else {
    console.log('❌ 三元组格式2未匹配');
  }

  // 2. 尺寸解析："110X120X141cm"
  const sizeMatches = text.match(/(\d+)\s*[x×X*]\s*(\d+)\s*[x×X*]\s*(\d+)\s*cm/gi);
  if (sizeMatches) {
    console.log('✓ 尺寸匹配:', sizeMatches);

    const dimensions = [];
    for (const sizeMatch of sizeMatches) {
      const match = sizeMatch.match(/(\d+)\s*[x×X*]\s*(\d+)\s*[x×X*]\s*(\d+)\s*cm/i);
      if (match) {
        const dim = {
          length: parseInt(match[1]),
          width: parseInt(match[2]),
          height: parseInt(match[3]),
          quantity: 1 // 每个尺寸默认1件
        };
        dimensions.push(dim);
        console.log(`  ✓ 尺寸: ${dim.length}×${dim.width}×${dim.height}cm`);
      }
    }

    result.dimensions = dimensions;
    console.log(`📏 总尺寸种类: ${dimensions.length}种`);
  } else {
    console.log('❌ 尺寸格式未匹配');
  }

  // 3. 起运地解析："货在河南"
  const originMatch = text.match(/货在(.+?)(?=\s|$|，|。)/);
  if (originMatch) {
    result.origin = originMatch[1].trim();
    console.log(`✓ 起运地: ${result.origin}`);
  } else {
    console.log('❌ 起运地未匹配');
  }

  // 4. 机场代码："DOH"
  const lines = text.trim().split('\n').filter(line => line.trim());
  if (lines.length > 0) {
    const firstLine = lines[0].trim();
    if (firstLine.match(/^[A-Z]{3}$/)) {
      result.destinationCode = firstLine;
      console.log(`✓ 机场代码: ${result.destinationCode}`);
    }
  }

  // 5. 货物名称
  if (!result.name) {
    result.name = '普货';
    console.log(`📝 默认货物名称: ${result.name}`);
  }

  return result;
}

// 执行测试
const testResult = testDOHFormatParsing(testInput);

console.log('\n📊 测试结果：');
console.log(testResult);

// 验证期望
const checks = [
  { name: '件数检查', expected: 3, actual: testResult.pieces, pass: testResult.pieces === 3 },
  { name: '重量检查', expected: 908.3, actual: testResult.weight, pass: testResult.weight === 908.3 },
  { name: '体积检查', expected: 5.66, actual: testResult.volume, pass: testResult.volume === 5.66 },
  { name: '尺寸数量', expected: 3, actual: testResult.dimensions?.length, pass: testResult.dimensions?.length === 3 },
  { name: '起运地检查', expected: '河南', actual: testResult.origin, pass: testResult.origin === '河南' },
  { name: '机场代码', expected: 'DOH', actual: testResult.destinationCode, pass: testResult.destinationCode === 'DOH' }
];

console.log('\n🎯 验证结果：');
let passCount = 0;
checks.forEach(check => {
  const status = check.pass ? '✅' : '❌';
  console.log(`${status} ${check.name}: 期望 ${check.expected}, 实际 ${check.actual}`);
  if (check.pass) passCount++;
});

console.log(`\n📈 测试通过率: ${passCount}/${checks.length} (${Math.round(passCount/checks.length*100)}%)`);

if (passCount === checks.length) {
  console.log('\n🎉 DOH格式解析逻辑验证成功！');
  console.log('✅ 新格式支持应该有效');
} else {
  console.log('\n⚠️  解析逻辑存在问题，需要进一步调试');
}
