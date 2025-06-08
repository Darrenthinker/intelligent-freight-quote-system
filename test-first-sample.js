// 测试第一个示例数据的解析
const fs = require('fs');
const path = require('path');

// 简单模拟浏览器环境的解析函数
function testParseCargoText(text) {
  console.log('=== 测试第一个示例数据 ===');
  console.log('输入文本:', text);
  console.log('');

  // 基本信息提取测试
  const lines = text.trim().split('\n');

  // 1. 货物名称识别
  const firstLine = lines[0];
  console.log('第一行（货物名称）:', firstLine);

  // 检查是否包含机场代码
  const airportMatch = firstLine.match(/^([A-Z]{3})\s/);
  if (airportMatch) {
    console.log('检测到机场代码:', airportMatch[1]);
  } else {
    console.log('未检测到机场代码，作为货物名称处理');
  }

  // 2. 重量识别
  const weightMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:kgs?|KGS?|公斤|千克)/i);
  if (weightMatch) {
    console.log('识别到重量:', weightMatch[1] + 'kg');
  } else {
    console.log('未识别到重量');
  }

  // 3. 体积识别
  const volumeMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:cbm|CBM|方|立方|m3)/i);
  if (volumeMatch) {
    console.log('识别到体积:', volumeMatch[1] + 'cbm');
  } else {
    console.log('未识别到体积');
  }

  // 4. 托盘数识别
  const palletMatch = text.match(/(\d+)\s*托/);
  if (palletMatch) {
    console.log('识别到托盘数:', palletMatch[1] + '托');
  } else {
    console.log('未识别到托盘数');
  }

  // 5. 起运地识别
  const originMatch = text.match(/货在(.+?)(?=\s|$)/);
  if (originMatch) {
    console.log('识别到起运地:', originMatch[1]);
  } else {
    console.log('未识别到起运地');
  }

  // 6. 尺寸识别
  const dimensionMatches = text.match(/(\d+(?:\.\d+)?)\s*[x*×]\s*(\d+(?:\.\d+)?)\s*[x*×]\s*(\d+(?:\.\d+)?)\s*cm/gi);
  if (dimensionMatches && dimensionMatches.length > 0) {
    console.log('识别到尺寸:', dimensionMatches.length + '个');
    dimensionMatches.forEach((dim, index) => {
      console.log(`  尺寸${index + 1}:`, dim);
    });
  } else {
    console.log('未识别到尺寸');
  }

  console.log('');
  console.log('=== 预期结果 ===');
  console.log('货物名称: WAW设备及配件 (或 设备及配件)');
  console.log('重量: 2500kg');
  console.log('体积: 14.71cbm');
  console.log('托盘数: 6托');
  console.log('起运地: 广州');
  console.log('尺寸数量: 5个');
  console.log('');
}

// 第一个示例数据
const firstSampleText = `WAW设备及配件
2500 kgs ; 14.71 cbm ; 6托
货在广州
120x100x65 cm
192x135x130 cm
192x135x104 cm
192x135x104 cm
192x135x104 cm
192x122x105 cm`;

testParseCargoText(firstSampleText);
