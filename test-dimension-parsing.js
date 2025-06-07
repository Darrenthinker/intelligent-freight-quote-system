// 测试尺寸解析准确性
console.log('=== 测试尺寸解析准确性 ===');

const firstSampleText = `WAW设备及配件
2500 kgs ; 14.71 cbm ; 6托
货在广州
120x100x65 cm
192x135x130 cm
192x135x104 cm
192x135x104 cm
192x135x104 cm
192x122x105 cm`;

console.log('输入文本:');
console.log(firstSampleText);
console.log('');

// 测试尺寸正则表达式
const dimensionRegex = /(\d+(?:\.\d+)?)\s*[*×xX]\s*(\d+(?:\.\d+)?)\s*[*×xX]\s*(\d+(?:\.\d+)?)\s*cm/gi;
const matches = firstSampleText.match(dimensionRegex);

console.log('尺寸正则表达式:', dimensionRegex.source);
console.log('匹配到的内容:', matches);
console.log('匹配数量:', matches ? matches.length : 0);

if (matches) {
  console.log('');
  console.log('=== 详细匹配结果 ===');
  matches.forEach((match, index) => {
    console.log(`${index + 1}. ${match}`);

    // 解析具体数值
    const detailMatch = match.match(/(\d+(?:\.\d+)?)\s*[*×xX]\s*(\d+(?:\.\d+)?)\s*[*×xX]\s*(\d+(?:\.\d+)?)\s*cm/i);
    if (detailMatch) {
      console.log(`   长度: ${detailMatch[1]}cm, 宽度: ${detailMatch[2]}cm, 高度: ${detailMatch[3]}cm`);
    }
  });
}

// 测试第一行是否会被误识别为尺寸
console.log('');
console.log('=== 第一行测试 ===');
const firstLine = 'WAW设备及配件';
const firstLineMatch = firstLine.match(dimensionRegex);
console.log('第一行内容:', firstLine);
console.log('第一行是否匹配尺寸正则:', firstLineMatch ? '是' : '否');

console.log('');
console.log('=== 预期结果 ===');
console.log('应该匹配5个尺寸，不包括第一行的货物名称');
console.log('实际匹配数量:', matches ? matches.length : 0);
console.log('是否正确:', (matches && matches.length === 5) ? '✅ 是' : '❌ 否');
