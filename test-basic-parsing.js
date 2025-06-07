// 测试基本解析功能
console.log('=== 测试基本重量、体积、托盘识别 ===');

const text = `WAW设备及配件
2500 kgs ; 14.71 cbm ; 6托
货在广州
120x100x65 cm`;

console.log('输入文本:', text);
console.log('');

// 测试重量识别
const weightMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:kgs?|KGS?|公斤|千克)/i);
console.log('重量匹配:', weightMatch ? weightMatch[1] + 'kg' : 'null');

// 测试体积识别
const volumeMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:cbm|CBM|方|立方|m3)/i);
console.log('体积匹配:', volumeMatch ? volumeMatch[1] + 'cbm' : 'null');

// 测试托盘识别
const palletMatch = text.match(/(\d+)\s*托/);
console.log('托盘匹配:', palletMatch ? palletMatch[1] + '托' : 'null');

// 测试起运地识别
const originMatch = text.match(/货在(.+?)(?=\s|$)/);
console.log('起运地匹配:', originMatch ? originMatch[1] : 'null');

console.log('');
console.log('=== 预期结果 ===');
console.log('重量: 2500kg');
console.log('体积: 14.71cbm');
console.log('托盘: 6托');
console.log('起运地: 广州');

// 测试分号分隔的格式
console.log('');
console.log('=== 分号分隔格式测试 ===');
const semicolonLine = '2500 kgs ; 14.71 cbm ; 6托';
console.log('分号行:', semicolonLine);

const parts = semicolonLine.split(';').map(part => part.trim());
console.log('分割后:', parts);

parts.forEach((part, index) => {
  console.log(`部分${index + 1}:`, part);

  if (part.match(/kgs?|公斤/i)) {
    const w = part.match(/(\d+(?:\.\d+)?)/);
    console.log('  -> 重量:', w ? w[1] + 'kg' : 'null');
  }

  if (part.match(/cbm|方|立方/i)) {
    const v = part.match(/(\d+(?:\.\d+)?)/);
    console.log('  -> 体积:', v ? v[1] + 'cbm' : 'null');
  }

  if (part.match(/托/)) {
    const p = part.match(/(\d+)/);
    console.log('  -> 托盘:', p ? p[1] + '托' : 'null');
  }
});
