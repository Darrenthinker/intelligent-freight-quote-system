// 自动化测试和修复系统
import { parseCargoText, calculateCargoMetrics, type CargoInfo, type CalculationResult } from './cargo-parser';

// 测试数据样本
export const TEST_DATA_SAMPLES = [
  {
    id: 1,
    name: "传统格式数据",
    input: `WAW设备及配件
2500 kgs ; 14.71 cbm ; 6托
货在广州
120x100x65 cm
192x135x130 cm
192x135x104 cm
192x135x104 cm
192x135x104 cm
192x122x105 cm`,
    expected: {
      name: "WAW设备及配件",
      weight: 2500,
      volume: 14.71,
      pallets: 6,
      pieces: 6,
      packageType: "pallets",
      origin: "广州",
      dimensionsCount: 6
    }
  },
  {
    id: 2,
    name: "批量格式数据",
    input: `148*113*80/1
168*113*72.5/1
188.5*35.5*71/1
单个托盘120KG`,
    expected: {
      weight: 360, // 120 * 3 = 360
      pieces: 3,
      packageType: "pallets",
      dimensionsCount: 3
    }
  },
  {
    id: 3,
    name: "单托格式数据",
    input: `83*63*77CM, 135KG，一托`,
    expected: {
      weight: 135,
      pieces: 1,
      packageType: "pallets",
      dimensionsCount: 1
    }
  },
  {
    id: 4,
    name: "箱规格式数据",
    input: `箱规：45*35*30cm，一件重是8.08kg 15箱`,
    expected: {
      weight: 121.2, // 8.08 * 15 = 121.2
      pieces: 15,
      packageType: "boxes",
      dimensionsCount: 1
    }
  },
  {
    id: 5,
    name: "托盘格式数据(米单位)",
    input: `重量：23托 重量:9765 KGS
尺寸：1.2*1.0*1.54m
体积：42 CBM`,
    expected: {
      weight: 9765,
      volume: 42,
      pallets: 23,
      pieces: 23,
      packageType: "pallets",
      dimensionsCount: 1,
      unit: "m"
    }
  },
  {
    id: 6,
    name: "多尺寸格式数据(毫米单位)",
    input: `货在深圳   -TAS  4件/8.95方/1210kg
尺寸1336*706*2005*2件
2546*781*1300*2件
尺寸mm`,
    expected: {
      weight: 1210,
      volume: 8.95,
      pieces: 4,
      packageType: "pieces",
      origin: "深圳",
      dimensionsCount: 2,
      unit: "mm"
    }
  },
  {
    id: 7,
    name: "空运格式数据",
    input: `DOH
3/908.3/5.66CBM
110X120X141cm
110X120X143cm
110X120X145CM
货在河南`,
    expected: {
      destinationCode: "DOH",
      destination: "DOH,多哈,Doha",
      weight: 908.3,
      volume: 5.66,
      pieces: 3,
      origin: "河南",
      dimensionsCount: 3
    }
  },
  {
    id: 8,
    name: "带电货物数据",
    input: `LAX
音响设备 内置电池
120*80*60cm, 25KG
3件/1.44cbm/75kg
货在深圳`,
    expected: {
      name: "音响设备 内置电池",
      destinationCode: "LAX",
      weight: 75,
      volume: 1.44,
      pieces: 3,
      origin: "深圳",
      isElectric: true
    }
  },
  {
    id: 9,
    name: "三元组格式数据",
    input: `DEL 751KG/42件/2.57CBM 货在广东`,
    expected: {
      destinationCode: "DEL",
      weight: 751,
      pieces: 42,
      volume: 2.57,
      origin: "广东"
    }
  },
  {
    id: 10,
    name: "CTNS格式数据",
    input: `167 CTNS / 11.79 CBM / 634.60 KGS
53.8*32*41cm箱规`,
    expected: {
      pieces: 167,
      volume: 11.79,
      weight: 634.60,
      packageType: "boxes",
      dimensionsCount: 1
    }
  }
];

// 测试结果接口
export interface TestResult {
  testId: number;
  testName: string;
  passed: boolean;
  errors: string[];
  parsed: Partial<CargoInfo>;
  calculated: CalculationResult | null;
  recommendations: string[];
}

// 批量测试函数
export function runBatchTest(): TestResult[] {
  const results: TestResult[] = [];

  for (const testCase of TEST_DATA_SAMPLES) {
    console.log(`🧪 测试 ${testCase.id}: ${testCase.name}`);

    try {
      const parsed = parseCargoText(testCase.input);
      const calculated = calculateCargoMetrics(parsed, 'air');

      const testResult: TestResult = {
        testId: testCase.id,
        testName: testCase.name,
        passed: true,
        errors: [],
        parsed: parsed,
        calculated: calculated,
        recommendations: []
      };

      // 验证期望结果
      const errors = validateExpectedResults(parsed, calculated, testCase.expected);
      testResult.errors = errors;
      testResult.passed = errors.length === 0;

      // 生成修复建议
      if (!testResult.passed) {
        testResult.recommendations = generateRepairRecommendations(testCase, parsed, calculated);
      }

      results.push(testResult);

      console.log(`${testResult.passed ? '✅' : '❌'} 测试${testCase.id}${testResult.passed ? '通过' : '失败'}`);
      if (!testResult.passed) {
        console.log(`错误: ${errors.join(', ')}`);
      }

    } catch (error) {
      console.error(`❌ 测试${testCase.id}异常:`, error);
      results.push({
        testId: testCase.id,
        testName: testCase.name,
        passed: false,
        errors: [`解析异常: ${error}`],
        parsed: {},
        calculated: null,
        recommendations: ['检查parseCargoText函数的异常处理']
      });
    }
  }

  return results;
}

// 验证期望结果
function validateExpectedResults(
  parsed: Partial<CargoInfo>,
  calculated: CalculationResult,
  expected: any
): string[] {
  const errors: string[] = [];

  // 检查货物名称
  if (expected.name && parsed.name !== expected.name) {
    errors.push(`货物名称不匹配: 期望"${expected.name}", 实际"${parsed.name}"`);
  }

  // 检查重量
  if (expected.weight && Math.abs((parsed.weight || 0) - expected.weight) > 0.1) {
    errors.push(`重量不匹配: 期望${expected.weight}kg, 实际${parsed.weight}kg`);
  }

  // 检查体积
  if (expected.volume && Math.abs((parsed.volume || 0) - expected.volume) > 0.1) {
    errors.push(`体积不匹配: 期望${expected.volume}cbm, 实际${parsed.volume}cbm`);
  }

  // 检查件数
  if (expected.pieces && parsed.pieces !== expected.pieces) {
    errors.push(`件数不匹配: 期望${expected.pieces}件, 实际${parsed.pieces}件`);
  }

  // 检查托盘数
  if (expected.pallets && parsed.pallets !== expected.pallets) {
    errors.push(`托盘数不匹配: 期望${expected.pallets}托, 实际${parsed.pallets}托`);
  }

  // 检查包装类型
  if (expected.packageType && parsed.packageType !== expected.packageType) {
    errors.push(`包装类型不匹配: 期望"${expected.packageType}", 实际"${parsed.packageType}"`);
  }

  // 检查起运地
  if (expected.origin && parsed.origin !== expected.origin) {
    errors.push(`起运地不匹配: 期望"${expected.origin}", 实际"${parsed.origin}"`);
  }

  // 检查目的地代码
  if (expected.destinationCode && parsed.destinationCode !== expected.destinationCode) {
    errors.push(`目的地代码不匹配: 期望"${expected.destinationCode}", 实际"${parsed.destinationCode}"`);
  }

  // 检查目的地
  if (expected.destination && parsed.destination !== expected.destination) {
    errors.push(`目的地不匹配: 期望"${expected.destination}", 实际"${parsed.destination}"`);
  }

  // 检查尺寸数量
  if (expected.dimensionsCount) {
    const actualCount = parsed.dimensions?.length || 0;
    if (actualCount !== expected.dimensionsCount) {
      errors.push(`尺寸数量不匹配: 期望${expected.dimensionsCount}个, 实际${actualCount}个`);
    }
  }

  // 检查单位
  if (expected.unit && parsed.dimensions && parsed.dimensions.length > 0) {
    const actualUnit = parsed.dimensions[0].unit;
    if (actualUnit !== expected.unit) {
      errors.push(`尺寸单位不匹配: 期望"${expected.unit}", 实际"${actualUnit}"`);
    }
  }

  // 检查带电货物
  if (expected.isElectric !== undefined) {
    const isElectric = parsed.name?.includes('电池') || parsed.name?.includes('内置电池');
    if (isElectric !== expected.isElectric) {
      errors.push(`带电货物识别不匹配: 期望${expected.isElectric}, 实际${isElectric}`);
    }
  }

  return errors;
}

// 生成修复建议
function generateRepairRecommendations(
  testCase: any,
  parsed: Partial<CargoInfo>,
  calculated: CalculationResult | null
): string[] {
  const recommendations: string[] = [];

  // 基于测试ID生成特定建议
  switch (testCase.id) {
    case 1: // 传统格式
      if (!parsed.name || parsed.name !== testCase.expected.name) {
        recommendations.push('增强第一行产品名称提取逻辑');
      }
      if ((parsed.dimensions?.length || 0) < 6) {
        recommendations.push('修复传统格式多行尺寸解析');
      }
      break;

    case 2: // 批量格式
      if (!parsed.weight || parsed.weight !== testCase.expected.weight) {
        recommendations.push('修复"单个托盘XXkg"重量计算逻辑');
      }
      break;

    case 4: // 箱规格式
      if (!parsed.weight || Math.abs(parsed.weight - testCase.expected.weight) > 0.1) {
        recommendations.push('修复箱规格式的重量计算：一件重×箱数');
      }
      break;

    case 5: // 米单位
      if (!parsed.dimensions || parsed.dimensions[0]?.unit !== 'm') {
        recommendations.push('修复米单位(m)的识别和显示');
      }
      break;

    case 6: // 毫米单位
      if (!parsed.dimensions || parsed.dimensions[0]?.unit !== 'mm') {
        recommendations.push('修复毫米单位(mm)的识别和体积计算');
      }
      break;

    case 7: // 空运格式
      if (!parsed.destinationCode) {
        recommendations.push('修复机场代码识别逻辑');
      }
      break;

    case 8: // 带电货物
      if (!parsed.name?.includes('内置电池')) {
        recommendations.push('增强带电货物名称提取和标识');
      }
      break;

    case 9: // 三元组格式
      if (!parsed.destinationCode || !parsed.weight || !parsed.pieces || !parsed.volume) {
        recommendations.push('修复三元组格式解析逻辑');
      }
      break;

    case 10: // CTNS格式
      if (parsed.packageType !== 'boxes') {
        recommendations.push('修复CTNS格式包装类型识别');
      }
      break;
  }

  // 通用建议
  if (!parsed.weight || parsed.weight <= 0) {
    recommendations.push('增强重量提取逻辑');
  }

  if (!parsed.volume || parsed.volume <= 0) {
    recommendations.push('增强体积提取和计算逻辑');
  }

  if (!parsed.pieces || parsed.pieces <= 0) {
    recommendations.push('增强件数识别逻辑');
  }

  return recommendations;
}

// 自动修复建议执行
export function generateAutoRepairCode(results: TestResult[]): string {
  const failedTests = results.filter(r => !r.passed);

  if (failedTests.length === 0) {
    return "// 🎉 所有测试都通过了！无需修复。";
  }

  let repairCode = `// 🔧 自动生成的修复代码\n\n`;

  const uniqueRecommendations = [...new Set(
    failedTests.flatMap(t => t.recommendations)
  )];

  for (const recommendation of uniqueRecommendations) {
    repairCode += `// TODO: ${recommendation}\n`;
  }

  repairCode += `\n// 基于测试结果的具体修复:\n`;

  for (const test of failedTests) {
    repairCode += `\n// 修复测试${test.testId}: ${test.testName}\n`;
    for (const error of test.errors) {
      repairCode += `// - ${error}\n`;
    }
  }

  return repairCode;
}

// 输出测试报告
export function generateTestReport(results: TestResult[]): string {
  const totalTests = results.length;
  const passedTests = results.filter(r => r.passed).length;
  const failedTests = totalTests - passedTests;
  const successRate = ((passedTests / totalTests) * 100).toFixed(1);

  let report = `
# 🧪 数据识别自动测试报告

## 📊 测试概要
- 总测试数: ${totalTests}
- 通过测试: ${passedTests}
- 失败测试: ${failedTests}
- 成功率: ${successRate}%

## 📋 详细结果
`;

  for (const result of results) {
    const status = result.passed ? '✅ PASS' : '❌ FAIL';
    report += `\n### 测试${result.testId}: ${result.testName} ${status}\n`;

    if (!result.passed) {
      report += `**错误:**\n`;
      for (const error of result.errors) {
        report += `- ${error}\n`;
      }

      if (result.recommendations.length > 0) {
        report += `**修复建议:**\n`;
        for (const rec of result.recommendations) {
          report += `- ${rec}\n`;
        }
      }
    }
  }

  return report;
}
