// 简单测试产品名称
const testText = `WAW设备及配件
2500 kgs ; 14.71 cbm ; 6托`;

const firstLine = testText.split('\n')[0]?.trim();
console.log('第一行:', firstLine);

const cleanName = firstLine.replace(/[?？]/g, '').trim();
console.log('清理后:', cleanName);

const hasKeyword = cleanName.match(/产品|设备|配件|玩具|机$|器$|电池$|装备/i);
console.log('包含关键词:', hasKeyword);

if (hasKeyword) {
  console.log('✅ 应该提取:', cleanName);
} else {
  console.log('❌ 不包含关键词');
}
