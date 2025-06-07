// 测试条件判断逻辑
console.log('=== 测试条件判断 ===');

// 模拟不同的 result.dimensions 状态
const testCases = [
  { dimensions: undefined, desc: 'undefined' },
  { dimensions: [], desc: '空数组' },
  { dimensions: [{}], desc: '有内容的数组' }
];

testCases.forEach(testCase => {
  const result = { dimensions: testCase.dimensions };
  const condition = (!result.dimensions || result.dimensions.length === 0);
  console.log(`${testCase.desc}: ${condition}`);
});

console.log('\n=== 模拟完整流程 ===');

// 模拟完整的解析流程
function simulateParsingFlow(text) {
  console.log(`测试文本: "${text}"`);

  // 1. 初始化
  const result = {};
  const dimensions = []; // Packing size dimensions

  // 2. Packing size 解析（模拟空结果）
  console.log('Packing dimensions.length:', dimensions.length);

  // 3. 设置 dimensions
  if (dimensions.length > 0) {
    result.dimensions = dimensions;
    console.log('设置了 result.dimensions');
  } else {
    console.log('没有设置 result.dimensions，保持 undefined');
  }

  // 4. 检查基本格式解析条件
  const condition = (!result.dimensions || result.dimensions.length === 0);
  console.log('基本格式解析条件:', condition);
  console.log('result.dimensions:', result.dimensions);

  if (condition) {
    // 5. 基本格式解析
    const basicFormatMatches = text.match(/(\d+(?:\.\d+)?)\s*[*×x]\s*(\d+(?:\.\d+)?)\s*[*×x]\s*(\d+(?:\.\d+)?)\s*[\/]\s*(\d+)/gi);
    console.log('基本格式匹配:', basicFormatMatches);

    if (basicFormatMatches) {
      console.log('✅ 应该执行基本格式解析');
      result.dimensions = []; // 模拟设置
      result.pieces = basicFormatMatches.length;
    } else {
      console.log('❌ 没有基本格式匹配');
    }
  } else {
    console.log('❌ 跳过基本格式解析');
  }

  console.log('最终结果:', result);
  console.log('---');
}

// 测试不同的输入
simulateParsingFlow('148*113*80/1');
simulateParsingFlow('80X60X120cm');
simulateParsingFlow('2/456.7/3.2CBM');
