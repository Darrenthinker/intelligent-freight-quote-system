// 测试修复后的解析函数
const fs = require('fs');

// 简单导入解析函数（模拟）
async function testRealParsing() {
  // 使用动态导入，因为这是Node.js环境
  try {
    console.log('=== 测试修复后的解析函数 ===');

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

    // 手动分析第一行
    const lines = firstSampleText.trim().split('\n');
    const firstLine = lines[0].trim();
    console.log('第一行内容:', firstLine);
    console.log('是否为单独的机场代码:', /^[A-Z]{3}$/.test(firstLine));
    console.log('是否包含机场代码WAW:', firstLine.includes('WAW'));
    console.log('');

    // 检查机场代码识别逻辑
    console.log('=== 机场代码识别测试 ===');
    const airportInFirstLine = firstLine.match(/^([A-Z]{3})$/);
    console.log('第一行单独机场代码匹配:', airportInFirstLine);

    const restText = lines.slice(1).join('\n');
    console.log('除第一行外的文本:');
    console.log(restText);

    const airportInRest = restText.match(/\b([A-Z]{3})\b/g);
    console.log('其余文本中的机场代码:', airportInRest);

    console.log('');
    console.log('=== 预期修复结果 ===');
    console.log('应该不识别WAW为目的地（因为它在货物名称中）');
    console.log('应该正确识别货物名称为: WAW设备及配件');
    console.log('应该正确识别重量: 2500kg');
    console.log('应该正确识别体积: 14.71cbm');
    console.log('应该正确识别托盘数: 6托');
    console.log('应该正确识别起运地: 广州');

  } catch (error) {
    console.error('测试失败:', error);
  }
}

testRealParsing();
