// 批量测试所有36个示例数据的识别准确性
console.log('=== 批量测试所有示例数据 ===');
console.log('测试时间:', new Date().toLocaleString());
console.log('');

// 所有示例数据集合
const allSampleData = {
  // 前6个基础格式示例
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

  boxSpec: "箱规：45*35*30cm，一件重是8.08kg 15箱",

  commodity: `Comm: 运动装备
数量：17箱
尺寸：每箱48 x 48 x 58 厘米
总重量：400 公斤`,

  // 其他格式示例
  pallet: `重量：23托 重量:9765 KGS
尺寸：1.2*1.0*1.54m
体积：42 CBM`,

  multiSize: `货在深圳   -TAS  4件/8.95方/1210kg
尺寸1336*706*2005*2件
2546*781*1300*2件
尺寸mm`,

  air: `DOH
3/908.3/5.66CBM
110X120X141cm
110X120X143cm
110X120X145CM
货在河南`,

  moreAirport: `LHR
2/456.7/3.2CBM
80X60X120cm
90X70X110cm
货在上海`,

  box: `JFK
木箱：1750*1050*1600MM, 480KG
木箱：1800*1470*1470MM, 250KG
2ptls/6.83cbm/730kg
货在佛山顺德`,

  electric: `LAX
音响设备 内置电池
120*80*60cm, 25KG
3件/1.44cbm/75kg
货在深圳`,

  battery: `FRA
移动电源 锂电池
50*30*20cm, 2KG
10件/0.3cbm/20kg
货在广州`,

  general: `LHR
纺织品
100*80*50cm, 15KG
5件/2.0cbm/75kg
货在义乌`,

  boxCount: "62*42*37cm，7箱，210kg",

  complex: "62*42*37cm，7箱，210kg   土耳其伊斯坦布尔  IST   空运帮忙报个价   根管锉之类的产品",

  singleItem: `159件，单件尺寸和重量是：53*26*33cm/6.5kg

总计:7.231cbm,1033.5kg

深圳或者广州出，到印度MAA
货物是汽车玩具，不带电`,

  chineseVolume: `空运到机场
香港到墨西哥MEX
16箱 135kg and 2.47方
电子产品（充电宝，充电头，数据线，镜子...）
带有品牌aekuy`,

  led: `710kg led发光手环（内置碱性干电池，有MSDS），41件，1.6个方，香港飞到捷克布拉格PRG机场
深圳交货，帮忙看下价格`,

  questionMark: `RLA510S?洗地机不带电池
Packing?size:?1300*600*1150mm
Packing?Weight:?110KG

RLA510?洗地机不带电池?
Packing?size:?1340*600*1150mm
Packing?Weight:130`,

  weightVolumePieces: `大家好，货物在江门，请看下深圳、广州那个好些？to?SYD
毛重大概500kg/7.01cbm/2?Wooden?Boxes:
?1?x?2520*1870*910?&?
1x?2500*1530*710?(mm)`,

  flexibleOrder: `测试不同顺序的数据格式：

格式1: 3件/105KG/0.3CBM
格式2: 2.5cbm/8件/200kg
格式3: 150KGS/5PCS/1.8方
格式4: 0.8方/120kg/4件
格式5: 6/250/2.1 (件数/重量/体积)`,

  palletDetail: `5个托盘总体积是6个方，重量是1036KG
228kg 1170-1020*1010mm 2托盘
194kg 1170 1020*1010mm 1托盘
159kg  1170 1020*700mm 1托盘
227kg 1360*1100*990mm 1托盘
普货  深圳BHM   预计下周货好`,

  delTriple: "DEL 751KG/42件/2.57CBM 货在广东",

  // 三元组格式 1-5
  triple1: "42件/751KG/2.57CBM",
  triple2: "2.57CBM/751KG/42件",
  triple3: "751KG/2.57CBM/42件",
  triple4: "42件/2.57CBM/751KG",
  triple5: "2.57CBM/42件/751KG",

  // CTNS和新格式
  ctns: `167 CTNS / 11.79 CBM / 634.60 KGS
53.8*32*41cm箱规`,

  ccu: "CCU 1028/1.63/35*35*35CM*38CTNS",

  khi: "KHI//3400KG//12.33CBM//145CTNS (1:275)  货在青岛",

  beg: "BEG   60ctn  618kg  2.41cbm  1:256  蓝牙耳机，带电，这个北京HU能接吗",

  pek: "PEK---VCP    120×80×127 厘米 1.22方 计费重753.6KG",

  simpleTriple: "120/3000KG/11.8CBM 到DUR 普货  1:250左右",

  bom: "BOM 460CTN/3270KG/34CBM/C.W5686KG/FOB NINGBO哪里有低价",

  gw: "BOM 460CTN/GW3270KG/34CBM/CW5686KG/FOB NINGBO",

  nw: "BOM 460CTN/NW2800KG/34CBM/CW5686KG/FOB NINGBO"
};

// 预期结果定义
const expectedResults = {
  traditional: {
    name: 'WAW设备及配件',
    weight: 2500,
    volume: 14.71,
    pallets: 6,
    pieces: 6,
    origin: '广州',
    dimensionsCount: 6,
    packageType: 'pallets'
  },
  newFormat: {
    name: '普货',
    weight: 360, // 120kg * 3件
    pieces: 3,
    dimensionsCount: 3,
    packageType: 'pieces'
  },
  latest: {
    name: '普货',
    weight: 135,
    pallets: 1,
    pieces: 1,
    dimensionsCount: 1,
    packageType: 'pallets'
  },
  table: {
    name: '普货',
    weight: 96,
    volume: 0.4071,
    pieces: 4,
    dimensionsCount: 1,
    packageType: 'pieces'
  }
  // 可以继续添加更多预期结果...
};

// 简化的解析测试函数
function testParseCargoText(text) {
  const result = {};

  // 1. 货物名称识别
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

  // 2. 重量识别（与实际解析函数一致的优先级）
  const tableWeightMatch = text.match(/实重\s*kg\s+(\d+(?:\.\d+)?)/i);
  if (tableWeightMatch) {
    result.weight = Number.parseFloat(tableWeightMatch[1]);
  } else if (result.pieces) {
    // 优先处理单件重量
    const singleWeightMatch = text.match(/单[个件](?:托盘|重量|重)?[：:]?\s*(\d+(?:\.\d+)?)\s*(?:KG|kg|公斤)/i);
    if (singleWeightMatch) {
      const singleWeight = Number.parseFloat(singleWeightMatch[1]);
      result.weight = singleWeight * result.pieces;
    }
  }

  // 如果还没有重量，再尝试直接重量格式
  if (!result.weight) {
    const directWeightMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:kgs?|KGS?|公斤|千克)/i);
    if (directWeightMatch) {
      result.weight = Number.parseFloat(directWeightMatch[1]);
    }
  }

  // 3. 体积识别
  const tableVolumeMatch = text.match(/方数\s*cbm\s+(\d+(?:\.\d+)?)/i);
  if (tableVolumeMatch) {
    result.volume = Number.parseFloat(tableVolumeMatch[1]);
  } else {
    const volumeMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:cbm|CBM|方|立方|m3)/i);
    if (volumeMatch) {
      result.volume = Number.parseFloat(volumeMatch[1]);
    }
  }

  // 4. 件数识别
  const tablePiecesMatch = text.match(/件数\s+(\d+)/i);
  if (tablePiecesMatch) {
    result.pieces = Number.parseInt(tablePiecesMatch[1]);
  }

  // 5. 托盘识别
  const chineseNumbers = {
    '一': 1, '二': 2, '三': 3, '四': 4, '五': 5,
    '六': 6, '七': 7, '八': 8, '九': 9, '十': 10
  };

  const enhancedPalletMatch = text.match(/(一|二|三|四|五|六|七|八|九|十|\d+)\s*托/);
  if (enhancedPalletMatch) {
    const palletText = enhancedPalletMatch[1];
    result.pallets = chineseNumbers[palletText] || Number.parseInt(palletText);
    if (!result.pieces) {
      result.pieces = result.pallets;
    }
    result.packageType = 'pallets';
  }

  // 6. 基本格式尺寸识别
  const basicFormatMatches = text.match(/(\d+(?:\.\d+)?)\s*[*×x]\s*(\d+(?:\.\d+)?)\s*[*×x]\s*(\d+(?:\.\d+)?)\s*[\/]\s*(\d+)/gi);
  if (basicFormatMatches) {
    result.dimensionsCount = basicFormatMatches.length;
    let totalPieces = 0;
    basicFormatMatches.forEach(match => {
      const sizeMatch = match.match(/(\d+(?:\.\d+)?)\s*[*×x]\s*(\d+(?:\.\d+)?)\s*[*×x]\s*(\d+(?:\.\d+)?)\s*[\/]\s*(\d+)/i);
      if (sizeMatch) {
        totalPieces += Number.parseInt(sizeMatch[4]);
      }
    });
    if (totalPieces > 0 && !result.pieces) {
      result.pieces = totalPieces;
    }
    if (!result.packageType) {
      result.packageType = 'pieces';
    }
  }

  // 7. 标准尺寸识别
  if (!result.dimensionsCount) {
    const sizeOnlyMatches = text.match(/(\d+(?:\.\d+)?)\s*[*×xX]\s*(\d+(?:\.\d+)?)\s*[*×xX]\s*(\d+(?:\.\d+)?)\s*(?:cm|CM)/gi);
    if (sizeOnlyMatches) {
      result.dimensionsCount = sizeOnlyMatches.length;
    }
  }

  // 8. 分散尺寸识别
  if (!result.dimensionsCount) {
    const lengthMatch = text.match(/长\s*cm\s+(\d+(?:\.\d+)?)/i);
    const widthMatch = text.match(/宽\s*cm\s+(\d+(?:\.\d+)?)/i);
    const heightMatch = text.match(/高\s*cm\s+(\d+(?:\.\d+)?)/i);

    if (lengthMatch && widthMatch && heightMatch) {
      result.dimensionsCount = 1;
    }
  }

  // 9. 单件重量计算
  if (!result.weight && result.pieces) {
    const singleWeightMatch = text.match(/单[个件](?:托盘|重量|重)?[：:]?\s*(\d+(?:\.\d+)?)\s*(?:KG|kg|公斤)/i);
    if (singleWeightMatch) {
      const singleWeight = Number.parseFloat(singleWeightMatch[1]);
      result.weight = singleWeight * result.pieces;
    }
  }

  // 10. 机场代码识别
  const airportCodeMatch = text.match(/\b([A-Z]{3})\b/g);
  if (airportCodeMatch) {
    // 简化处理，只标记是否检测到
    result.hasAirportCode = true;
  }

  // 11. 起运地识别
  const originMatch = text.match(/货在(.+?)(?=\s|$)/);
  if (originMatch) {
    result.origin = originMatch[1].trim();
  }

  return result;
}

// 执行批量测试
console.log('开始批量测试...\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = [];

Object.keys(allSampleData).forEach((key, index) => {
  totalTests++;
  const sampleText = allSampleData[key];
  const expected = expectedResults[key];

  console.log(`${index + 1}. 测试 "${key}" 格式:`);
  console.log(`输入: ${sampleText.substring(0, 50)}${sampleText.length > 50 ? '...' : ''}`);

  try {
    const result = testParseCargoText(sampleText);

    // 基本验证
    let isValid = true;
    let issues = [];

    if (!result.name) {
      issues.push('货物名称未识别');
      isValid = false;
    }

    if (expected) {
      if (expected.name && result.name !== expected.name) {
        issues.push(`货物名称不匹配: 期望"${expected.name}", 实际"${result.name}"`);
        isValid = false;
      }
      if (expected.weight && result.weight !== expected.weight) {
        issues.push(`重量不匹配: 期望${expected.weight}, 实际${result.weight}`);
        isValid = false;
      }
      if (expected.volume && result.volume !== expected.volume) {
        issues.push(`体积不匹配: 期望${expected.volume}, 实际${result.volume}`);
        isValid = false;
      }
      if (expected.pieces && result.pieces !== expected.pieces) {
        issues.push(`件数不匹配: 期望${expected.pieces}, 实际${result.pieces}`);
        isValid = false;
      }
    }

    if (isValid) {
      console.log(`   ✅ 通过`);
      passedTests++;
    } else {
      console.log(`   ❌ 失败: ${issues.join(', ')}`);
      failedTests.push({
        key,
        issues,
        result
      });
    }

    console.log(`   解析结果: 名称="${result.name}", 重量=${result.weight || '无'}, 体积=${result.volume || '无'}, 件数=${result.pieces || '无'}`);

  } catch (error) {
    console.log(`   🚨 解析异常: ${error.message}`);
    failedTests.push({
      key,
      issues: [`解析异常: ${error.message}`],
      result: null
    });
  }

  console.log('');
});

// 输出汇总结果
console.log('='.repeat(60));
console.log('📊 批量测试汇总结果');
console.log('='.repeat(60));
console.log(`总测试数: ${totalTests}`);
console.log(`通过数: ${passedTests}`);
console.log(`失败数: ${failedTests.length}`);
console.log(`通过率: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

if (failedTests.length > 0) {
  console.log('\n❌ 失败的测试案例:');
  failedTests.forEach((test, index) => {
    console.log(`${index + 1}. ${test.key}: ${test.issues.join(', ')}`);
  });
}

console.log('\n✨ 测试完成!');
