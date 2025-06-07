'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { parseCargoText, calculateCargoMetrics, getCargoTypeByDensity, parseAndCalculateCargoInfo, isElectricCargo, type CargoInfo, type CalculationResult } from "@/lib/cargo-parser";
import { generateQuotes, type Quote } from "@/lib/freight-rates";

interface CargoInputProps {
  onQuotesGenerated: (quotes: Quote[]) => void;
}

export function CargoInput({ onQuotesGenerated }: CargoInputProps) {
  const [cargoText, setCargoText] = useState('');
  const [origin, setOrigin] = useState('等待确认'); // 修改：默认为"等待确认"而不是"广州"
  const [destination, setDestination] = useState('');
  const [transportMode, setTransportMode] = useState<'sea' | 'air' | 'both'>('both');
  const [parsedCargo, setParsedCargo] = useState<Partial<CargoInfo>>({});
  const [calculations, setCalculations] = useState<CalculationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 示例货物信息
  const sampleCargoText = `WAW设备及配件
2500 kgs ; 14.71 cbm ; 6托
货在广州
120x100x65 cm
192x135x130 cm
192x135x104 cm
192x135x104 cm
192x135x104 cm
192x122x105 cm`;

  // 新格式示例数据
  const newFormatSampleText = `148*113*80/1
168*113*72.5/1
188.5*35.5*71/1
单个托盘120KG`;

  // 最新格式示例数据
  const latestFormatSampleText = "83*63*77CM, 135KG，一托";

  // 表格格式示例数据
  const tableFormatSampleText = `HDL23938566-HDL23938566-收货(KG)235
实重kg 96.00 长cm 150 宽cm 46 高cm 59 件数 4 方数cbm 0.4071 计重 96.00`;

  // 箱规格式示例数据
  const boxFormatSampleText = "箱规：45*35*30cm，一件重是8.08kg 15箱";

  // 商品格式示例数据
  const commFormatSampleText = `Comm: 运动装备
数量：17箱
尺寸：每箱48 x 48 x 58 厘米
总重量：400 公斤`;

  // 托盘格式示例数据
  const palletFormatSampleText = `重量：23托 重量:9765 KGS
尺寸：1.2*1.0*1.54m
体积：42 CBM`;

  // 多尺寸格式示例数据
  const multiSizeFormatSampleText = `货在深圳   -TAS  4件/8.95方/1210kg
尺寸1336*706*2005*2件
2546*781*1300*2件
尺寸mm`;

  // 空运格式示例数据
  const airFormatSampleText = `DOH
3/908.3/5.66CBM
110X120X141cm
110X120X143cm
110X120X145CM
货在河南`;

  // 自动解析货物信息
  useEffect(() => {
    if (cargoText.trim()) {
      // 🔥 修复：智能判断运输方式，默认空运计算
      let defaultMode: 'air' | 'sea' = 'air'; // 默认空运

      // 只有在明确提到"海运"、"船运"等海运关键词时才使用海运
      const seaKeywords = ['海运', '船运', '海上', '船期', '开船', '船公司', '集装箱', 'LCL', 'FCL'];
      const isSeaShipping = seaKeywords.some(keyword => cargoText.includes(keyword));

      if (isSeaShipping) {
        defaultMode = 'sea';
      }

      // 使用统一的解析和计算函数
      const { cargoInfo: parsed, calculations: calc } = parseAndCalculateCargoInfo(cargoText, defaultMode);
      setParsedCargo(parsed);

      // 🔥 修复：每次输入新数据时都重新设置货物所在地，没有识别到时显示"等待确认"
      if (parsed.origin) {
        setOrigin(parsed.origin);
      } else {
        // 如果没有识别到起运地，设置为"等待确认"
        setOrigin('等待确认');
      }

      // 如果识别到目的地，自动设置；如果没有识别到，只在当前值为空时保持空白
      if (parsed.destination) {
        setDestination(parsed.destination);
      } else if (!destination || destination === '洛杉矶' || destination.includes('(')) {
        // 如果没有识别到目的地，且当前值是示例数据或机场代码格式，则清空
        setDestination('');
      }

      // 自动计算相关数值 - 使用智能判断的运输方式
      const calculations = calculateCargoMetrics(parsed, defaultMode);
      setCalculations(calculations);

      // 如果有机场代码，强制设置为空运
      if (parsed.destinationCode) {
        setTransportMode('air');
        setCalculations(calculateCargoMetrics(parsed, 'air'));
      } else {
        // 根据智能判断设置运输方式
        setTransportMode(defaultMode);
      }
    } else {
      setParsedCargo({});
      setCalculations(null);
      // 🔥 清空输入时也要重置货物所在地
      setOrigin('等待确认'); // 修改：默认为"等待确认"而不是"广州"
    }
  }, [cargoText, destination]); // 添加destination依赖

  // 使用示例数据
  const loadSampleData = () => {
    setCargoText(sampleCargoText);
    setDestination('洛杉矶');
  };

  // 使用新格式示例数据
  const loadNewFormatSample = () => {
    console.log('🎯 批量格式示例按钮被点击!', newFormatSampleText);

    // 立即测试解析功能
    try {
      const testResult = parseCargoText(newFormatSampleText);
      console.log('🧪 立即解析测试结果:', testResult);
    } catch (error) {
      console.error('🚨 解析函数调用失败:', error);
    }

    setCargoText(newFormatSampleText);
    setDestination('洛杉矶');
  };

  // 使用最新格式示例数据
  const loadLatestFormatSample = () => {
    setCargoText(latestFormatSampleText);
    setDestination('洛杉矶');
  };

  // 使用表格格式示例数据
  const loadTableFormatSample = () => {
    setCargoText(tableFormatSampleText);
    setDestination('洛杉矶');
  };

  // 使用箱规格式示例数据
  const loadBoxFormatSample = () => {
    setCargoText(boxFormatSampleText);
    setDestination('洛杉矶');
  };

  // 使用商品格式示例数据
  const loadCommFormatSample = () => {
    setCargoText(commFormatSampleText);
    setDestination('洛杉矶');
  };

  // 使用托盘格式示例数据
  const loadPalletFormatSample = () => {
    setCargoText(palletFormatSampleText);
    setDestination('洛杉矶');
  };

  // 使用多尺寸格式示例数据
  const loadMultiSizeFormatSample = () => {
    setCargoText(multiSizeFormatSampleText);
    setDestination('洛杉矶');
  };

  // 使用空运格式示例数据
  const loadAirFormatSample = () => {
    setCargoText(airFormatSampleText);
    // 目的地会自动设置为多哈
  };

  // 更多机场代码示例
  const moreAirportSampleText = `LHR
2/456.7/3.2CBM
80X60X120cm
90X70X110cm
货在上海`;

  const loadMoreAirportSample = () => {
    setCargoText(moreAirportSampleText);
    // 目的地会自动设置为伦敦
  };

  // 木箱格式示例数据
  const boxSampleText = `JFK
木箱：1750*1050*1600MM, 480KG
木箱：1800*1470*1470MM, 250KG
2ptls/6.83cbm/730kg
货在佛山顺德`;

  const loadBoxSample = () => {
    setCargoText(boxSampleText);
    // 目的地会自动设置为纽约JFK
  };

  // 带电货物示例数据
  const electricSampleText = `LAX
音响设备 内置电池
120*80*60cm, 25KG
3件/1.44cbm/75kg
货在深圳`;

  const loadElectricSample = () => {
    setCargoText(electricSampleText);
    // 目的地会自动设置为洛杉矶
  };

  // 电池类货物示例
  const batterySampleText = `FRA
移动电源 锂电池
50*30*20cm, 2KG
10件/0.3cbm/20kg
货在广州`;

  const loadBatterySample = () => {
    setCargoText(batterySampleText);
    // 目的地会自动设置为法兰克福
  };

  // 普通货物示例
  const generalCargoSampleText = `LHR
纺织品
100*80*50cm, 15KG
5件/2.0cbm/75kg
货在义乌`;

  const loadGeneralCargoSample = () => {
    setCargoText(generalCargoSampleText);
    // 目的地会自动设置为伦敦
  };

  // 箱数格式示例
  const boxCountSampleText = "62*42*37cm，7箱，210kg";

  const loadBoxCountSample = () => {
    setCargoText(boxCountSampleText);
  };

  // 复杂格式示例 - 包含产品名称和机场代码
  const complexFormatSampleText = "62*42*37cm，7箱，210kg   土耳其伊斯坦布尔  IST   空运帮忙报个价   根管锉之类的产品";

  const loadComplexFormatSample = () => {
    setCargoText(complexFormatSampleText);
  };

  // 单件规格示例 - 包含单件尺寸重量和总计
  const singleItemSpecSampleText = `159件，单件尺寸和重量是：53*26*33cm/6.5kg

总计:7.231cbm,1033.5kg

深圳或者广州出，到印度MAA
货物是汽车玩具，不带电`;

  const loadSingleItemSpecSample = () => {
    setCargoText(singleItemSpecSampleText);
  };

  // 中文体积格式示例
  const chineseVolumeSampleText = `空运到机场
香港到墨西哥MEX
16箱 135kg and 2.47方
电子产品（充电宝，充电头，数据线，镜子...）
带有品牌aekuy`;

  const loadChineseVolumeSample = () => {
    setCargoText(chineseVolumeSampleText);
  };

  // LED产品示例
  const ledProductSampleText = `710kg led发光手环（内置碱性干电池，有MSDS），41件，1.6个方，香港飞到捷克布拉格PRG机场
深圳交货，帮忙看下价格`;

  const loadLedProductSample = () => {
    setCargoText(ledProductSampleText);
  };

  // 带问号字符的示例数据 - 模拟企业微信复制粘贴产生的问号
  const questionMarkSampleText = `RLA510S?洗地机不带电池
Packing?size:?1300*600*1150mm
Packing?Weight:?110KG

RLA510?洗地机不带电池?
Packing?size:?1340*600*1150mm
Packing?Weight:130`;

  const loadQuestionMarkSample = () => {
    setCargoText(questionMarkSampleText);
  };

  // 新的重量/体积/件数格式示例
  const weightVolumePiecesSampleText = `大家好，货物在江门，请看下深圳、广州那个好些？to?SYD
毛重大概500kg/7.01cbm/2?Wooden?Boxes:
?1?x?2520*1870*910?&?
1x?2500*1530*710?(mm)`;

  const loadWeightVolumePiecesSample = () => {
    setCargoText(weightVolumePiecesSampleText);
  };

  // 不同顺序的三元组格式示例
  const flexibleOrderSampleText = `测试不同顺序的数据格式：

格式1: 3件/105KG/0.3CBM
格式2: 2.5cbm/8件/200kg
格式3: 150KGS/5PCS/1.8方
格式4: 0.8方/120kg/4件
格式5: 6/250/2.1 (件数/重量/体积)`;

  const loadFlexibleOrderSample = () => {
    setCargoText(flexibleOrderSampleText);
  };

  // 托盘详细格式示例数据
  const palletDetailSampleText = `5个托盘总体积是6个方，重量是1036KG
228kg 1170-1020*1010mm 2托盘
194kg 1170 1020*1010mm 1托盘
159kg  1170 1020*700mm 1托盘
227kg 1360*1100*990mm 1托盘
普货  深圳BHM   预计下周货好`;

  const loadPalletDetailSample = () => {
    setCargoText(palletDetailSampleText);
    setOrigin('深圳');
  };

  // DEL三元组格式示例数据
  const delTripleSampleText = "DEL 751KG/42件/2.57CBM 货在广东";

  const loadDelTripleSample = () => {
    setCargoText(delTripleSampleText);
  };

  // 更多三元组格式示例
  const tripleFormat1Text = "42件/751KG/2.57CBM"; // 件数/重量/体积
  const tripleFormat2Text = "2.57CBM/751KG/42件"; // 体积/重量/件数
  const tripleFormat3Text = "751KG/2.57CBM/42件"; // 重量/体积/件数
  const tripleFormat4Text = "42件/2.57CBM/751KG"; // 件数/体积/重量
  const tripleFormat5Text = "2.57CBM/42件/751KG"; // 体积/件数/重量

  const loadTripleFormat1 = () => setCargoText(tripleFormat1Text);
  const loadTripleFormat2 = () => setCargoText(tripleFormat2Text);
  const loadTripleFormat3 = () => setCargoText(tripleFormat3Text);
  const loadTripleFormat4 = () => setCargoText(tripleFormat4Text);
  const loadTripleFormat5 = () => setCargoText(tripleFormat5Text);

  // CTNS格式示例数据
  const ctnsFormatSampleText = `167 CTNS / 11.79 CBM / 634.60 KGS
53.8*32*41cm箱规`;

  const loadCtnsFormatSample = () => {
    setCargoText(ctnsFormatSampleText);
  };

  // CCU新格式示例数据
  const ccuFormatSampleText = "CCU 1028/1.63/35*35*35CM*38CTNS";

  const loadCcuFormatSample = () => {
    setCargoText(ccuFormatSampleText);
  };

  // KHI双斜杠格式示例数据
  const khiFormatSampleText = "KHI//3400KG//12.33CBM//145CTNS (1:275)  货在青岛";

  const loadKhiFormatSample = () => {
    setCargoText(khiFormatSampleText);
  };

  // BEG新格式示例数据
  const begFormatSampleText = "BEG   60ctn  618kg  2.41cbm  1:256  蓝牙耳机，带电，这个北京HU能接吗";

  const loadBegFormatSample = () => {
    setCargoText(begFormatSampleText);
  };

  // PEK新格式示例数据
  const pekFormatSampleText = "PEK---VCP    120×80×127 厘米 1.22方 计费重753.6KG";

  const loadPekFormatSample = () => {
    setCargoText(pekFormatSampleText);
  };

  // 简化三元组格式示例数据
  const simpleTripleFormatSampleText = "120/3000KG/11.8CBM 到DUR 普货  1:250左右";

  const loadSimpleTripleFormatSample = () => {
    setCargoText(simpleTripleFormatSampleText);
  };

  // BOM新格式示例数据
  const bomFormatSampleText = "BOM 460CTN/3270KG/34CBM/C.W5686KG/FOB NINGBO哪里有低价";

  const loadBomFormatSample = () => {
    setCargoText(bomFormatSampleText);
  };

  // GW格式示例数据
  const gwFormatSampleText = "BOM 460CTN/GW3270KG/34CBM/CW5686KG/FOB NINGBO";

  const loadGwFormatSample = () => {
    setCargoText(gwFormatSampleText);
  };

  // NW格式示例数据
  const nwFormatSampleText = "BOM 460CTN/NW2800KG/34CBM/CW5686KG/FOB NINGBO";

  const loadNwFormatSample = () => {
    setCargoText(nwFormatSampleText);
  };

  // 生成报价
  const handleGenerateQuote = async () => {
    if (!destination.trim() || !calculations) {
      alert('请填写目的地信息');
      return;
    }

    setIsLoading(true);

    try {
      // 生成不同运输方式的报价
      const modes = transportMode === 'both' ? ['sea', 'air'] as const : [transportMode as 'sea' | 'air'];
      const allQuotes: Quote[] = [];

      for (const mode of modes) {
        const modeCalc = calculateCargoMetrics(parsedCargo, mode);
        const quotes = generateQuotes(
          origin,
          destination,
          modeCalc.chargeableWeight,
          modeCalc.totalVolume,
          mode
        );
        allQuotes.push(...quotes);
      }

      onQuotesGenerated(allQuotes);
    } catch (error) {
      console.error('生成报价失败:', error);
      alert('生成报价失败，请检查输入信息');
    } finally {
      setIsLoading(false);
    }
  };

  // 🔥 V57修复验证：米单位测试数据
  const v57MeterTestSampleText = `重量：23托 重量:9765 KGS
尺寸：1.2*1.0*1.54m
体积：42 CBM`;

  const loadV57MeterTestSample = () => {
    setCargoText(v57MeterTestSampleText);
    setDestination(''); // 清空目的地，专注测试解析
  };

  // 🔥 V57修复验证：毫米单位测试数据
  const v57MillimeterTestSampleText = `货在深圳   -TAS  4件/8.95方/1210kg
尺寸1336*706*2005*2件
2546*781*1300*2件
尺寸mm`;

  const loadV57MillimeterTestSample = () => {
    setCargoText(v57MillimeterTestSampleText);
    setDestination(''); // 清空目的地，专注测试解析
  };

  return (
    <div className="space-y-6">
      {/* 货物信息输入 */}
      <Card>
        <CardHeader>
          <CardTitle>货物信息输入</CardTitle>
          <CardDescription>
            请输入货物详细信息，系统将自动解析并计算相关数值
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="cargo-text">货物信息</Label>
            <Textarea
              id="cargo-text"
              placeholder="请输入货物名称、重量、体积、尺寸等信息..."
              value={cargoText}
              onChange={(e) => setCargoText(e.target.value)}
              rows={8}
              className="mt-2"
            />
            <div className="mt-2">
              <div className="space-y-3">
                {/* 🎯 基础格式示例 - 第一行 */}
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={loadSampleData}>
                    传统格式示例
                  </Button>
                  <Button variant="outline" size="sm" onClick={loadNewFormatSample}>
                    批量格式示例
                  </Button>
                  <Button variant="outline" size="sm" onClick={loadLatestFormatSample}>
                    单托格式示例
                  </Button>
                  <Button variant="outline" size="sm" onClick={loadTableFormatSample}>
                    表格格式示例
                  </Button>
                  <Button variant="outline" size="sm" onClick={loadBoxFormatSample}>
                    箱规格式示例
                  </Button>
                  <Button variant="outline" size="sm" onClick={loadCommFormatSample}>
                    商品格式示例
                  </Button>
                </div>

                {/* 🚀 高级格式示例 - 第二行 */}
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={loadPalletFormatSample}>
                    托盘格式示例
                  </Button>
                  <Button variant="outline" size="sm" onClick={loadMultiSizeFormatSample}>
                    多尺寸格式示例
                  </Button>
                  <Button variant="outline" size="sm" onClick={loadAirFormatSample}>
                    空运格式示例
                  </Button>
                  <Button variant="outline" size="sm" onClick={loadMoreAirportSample}>
                    更多机场代码示例
                  </Button>
                  <Button variant="outline" size="sm" onClick={loadBoxSample}>
                    木箱格式示例
                  </Button>
                  <Button variant="outline" size="sm" onClick={loadPalletDetailSample} className="border-red-400 text-red-700 hover:bg-red-50">
                    托盘详细格式示例
                  </Button>
                </div>

                {/* 🔋 特殊货物示例 - 第三行 */}
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={loadElectricSample} className="border-orange-300 text-orange-600 hover:bg-orange-50">
                    带电货物示例
                  </Button>
                  <Button variant="outline" size="sm" onClick={loadBatterySample} className="border-red-300 text-red-600 hover:bg-red-50">
                    电池类示例
                  </Button>
                  <Button variant="outline" size="sm" onClick={loadGeneralCargoSample}>
                    普通货物示例
                  </Button>
                  <Button variant="outline" size="sm" onClick={loadLedProductSample} className="border-yellow-300 text-yellow-600 hover:bg-yellow-50">
                    LED产品示例
                  </Button>
                  <Button variant="outline" size="sm" onClick={loadBoxCountSample} className="border-blue-300 text-blue-600 hover:bg-blue-50">
                    箱数格式示例
                  </Button>
                  <Button variant="outline" size="sm" onClick={loadComplexFormatSample} className="border-purple-300 text-purple-600 hover:bg-purple-50">
                    复杂格式示例
                  </Button>
                </div>

                {/* 📊 智能解析示例 - 第四行 */}
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={loadSingleItemSpecSample} className="border-indigo-300 text-indigo-600 hover:bg-indigo-50">
                    单件规格示例
                  </Button>
                  <Button variant="outline" size="sm" onClick={loadChineseVolumeSample} className="border-green-300 text-green-600 hover:bg-green-50">
                    中文体积示例
                  </Button>
                  <Button variant="outline" size="sm" onClick={loadQuestionMarkSample} className="border-gray-400 text-gray-700 hover:bg-gray-50">
                    问号字符修复示例
                  </Button>
                  <Button variant="outline" size="sm" onClick={loadWeightVolumePiecesSample} className="border-teal-400 text-teal-700 hover:bg-teal-50">
                    重量/体积/件数格式
                  </Button>
                  <Button variant="outline" size="sm" onClick={loadFlexibleOrderSample} className="border-cyan-400 text-cyan-700 hover:bg-cyan-50">
                    智能顺序识别
                  </Button>
                  <Button variant="outline" size="sm" onClick={loadDelTripleSample} className="border-pink-400 text-pink-700 hover:bg-pink-50">
                    DEL三元组示例
                  </Button>
                </div>

                {/* 🔢 三元组格式示例 - 第五行 */}
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={loadTripleFormat1} className="border-blue-400 text-blue-700 hover:bg-blue-50">
                    三元组格式1
                  </Button>
                  <Button variant="outline" size="sm" onClick={loadTripleFormat2} className="border-red-400 text-red-700 hover:bg-red-50">
                    三元组格式2
                  </Button>
                  <Button variant="outline" size="sm" onClick={loadTripleFormat3} className="border-green-400 text-green-700 hover:bg-green-50">
                    三元组格式3
                  </Button>
                  <Button variant="outline" size="sm" onClick={loadTripleFormat4} className="border-yellow-400 text-yellow-700 hover:bg-yellow-50">
                    三元组格式4
                  </Button>
                  <Button variant="outline" size="sm" onClick={loadTripleFormat5} className="border-purple-400 text-purple-700 hover:bg-purple-50">
                    三元组格式5
                  </Button>
                  <Button variant="outline" size="sm" onClick={loadCtnsFormatSample} className="border-orange-400 text-orange-700 hover:bg-orange-50">
                    CTNS格式+箱规示例
                  </Button>
                </div>

                {/* 🌐 国际格式示例 - 第六行 */}
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={loadCcuFormatSample} className="border-indigo-400 text-indigo-700 hover:bg-indigo-50">
                    CCU新格式示例
                  </Button>
                  <Button variant="outline" size="sm" onClick={loadKhiFormatSample} className="border-purple-400 text-purple-700 hover:bg-purple-50">
                    KHI双斜杠格式示例
                  </Button>
                  <Button variant="outline" size="sm" onClick={loadBegFormatSample} className="border-blue-400 text-blue-700 hover:bg-blue-50">
                    BEG新格式示例
                  </Button>
                  <Button variant="outline" size="sm" onClick={loadPekFormatSample} className="border-red-400 text-red-700 hover:bg-red-50">
                    PEK新格式示例
                  </Button>
                  <Button variant="outline" size="sm" onClick={loadSimpleTripleFormatSample} className="border-green-400 text-green-700 hover:bg-green-50">
                    简化三元组格式示例
                  </Button>
                  <Button variant="outline" size="sm" onClick={loadBomFormatSample} className="border-blue-400 text-blue-700 hover:bg-blue-50">
                    BOM新格式示例
                  </Button>
                </div>

                {/* ⚖️ 重量类型示例 - 第七行 */}
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={loadGwFormatSample} className="border-blue-400 text-blue-700 hover:bg-blue-50">
                    GW格式示例
                  </Button>
                  <Button variant="outline" size="sm" onClick={loadNwFormatSample} className="border-blue-400 text-blue-700 hover:bg-blue-50">
                    NW格式示例
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="origin">货物所在地</Label>
              <Input
                id="origin"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="例: 广州"
              />
            </div>
            <div>
              <Label htmlFor="destination">目的地</Label>
              <Input
                id="destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="例: 洛杉矶"
              />
            </div>
            <div>
              <Label htmlFor="transport-mode">运输方式</Label>
              <select
                id="transport-mode"
                value={transportMode}
                onChange={(e) => setTransportMode(e.target.value as 'sea' | 'air' | 'both')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="both">海运+空运</option>
                <option value="sea">仅海运</option>
                <option value="air">仅空运</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 解析结果展示 */}
      {(parsedCargo.name || parsedCargo.dimensions) && (
        <Card>
          <CardHeader>
            <CardTitle>解析结果</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* 基本信息 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                {parsedCargo.name && (
                  <div>
                    <Label className="text-muted-foreground">货物名称</Label>
                    <p className={`font-medium ${isElectricCargo(parsedCargo) ? 'text-red-600' : ''}`}>
                      {parsedCargo.name}
                    </p>
                  </div>
                )}
                {parsedCargo.weight && (
                  <div>
                    <Label className="text-muted-foreground">重量</Label>
                    <p className="font-medium">{parsedCargo.weight} kg</p>
                  </div>
                )}
                {parsedCargo.volume && (
                  <div>
                    <Label className="text-muted-foreground">体积</Label>
                    <p className="font-medium">{parsedCargo.volume} cbm</p>
                  </div>
                )}
                {parsedCargo.pallets && (
                  <div>
                    <Label className="text-muted-foreground">托盘数</Label>
                    <p className="font-medium">{parsedCargo.pallets} 托</p>
                  </div>
                )}
                {parsedCargo.pieces && (
                  <div>
                    <Label className="text-muted-foreground">货物件数</Label>
                    <p className="font-medium">
                      {parsedCargo.pieces} {parsedCargo.packageType === 'pallets' ? '托盘' :
                                             parsedCargo.packageType === 'boxes' ? '箱' : '件'}
                    </p>
                  </div>
                )}
                {parsedCargo.destination && (
                  <div>
                    <Label className="text-muted-foreground">目的地</Label>
                    <p className="font-medium">{parsedCargo.destination}</p>
                  </div>
                )}
                {parsedCargo.origin && (
                  <div>
                    <Label className="text-muted-foreground">货物所在地</Label>
                    <p className="font-medium">{parsedCargo.origin}</p>
                  </div>
                )}
              </div>

              {/* 尺寸明细 */}
              {parsedCargo.dimensions && parsedCargo.dimensions.length > 0 && (
                <div>
                  <Label className="text-muted-foreground">尺寸明细</Label>
                  <div className="mt-2 space-y-2">
                    {parsedCargo.dimensions.map((dim, index) => (
                      <div key={`${dim.length}-${dim.width}-${dim.height}-${index}`} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                        <span>{dim.length} × {dim.width} × {dim.height} {dim.unit || 'cm'}</span>
                        <span className="text-muted-foreground">
                          {dim.quantity} {parsedCargo.packageType === 'pallets' ? '托盘' :
                                          parsedCargo.packageType === 'boxes' ? '箱' : '件'}
                        </span>
                        <span className="font-medium">
                          {(() => {
                            let volume: number;
                            switch (dim.unit) {
                              case 'm': // 米
                                volume = dim.length * dim.width * dim.height; // 已经是立方米
                                break;
                              case 'mm': // 毫米
                                volume = (dim.length * dim.width * dim.height) / 1000000000; // 除以10^9转换为立方米
                                break;
                              default: // 厘米或其他单位
                                volume = (dim.length * dim.width * dim.height) / 1000000; // 除以10^6转换为立方米
                                break;
                            }
                            return (volume * dim.quantity).toFixed(3);
                          })()} cbm
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 计算结果展示 */}
      {calculations && (
        <Card>
          <CardHeader>
            <CardTitle>自动计算结果</CardTitle>
            <CardDescription>
              基于货物信息自动计算的重量、体积和计费重量
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div className="p-3 bg-purple-50 rounded-lg">
                <Label className="text-sm text-muted-foreground">货物件数</Label>
                <p className="text-lg font-semibold text-purple-600">
                  {calculations.totalPieces} {parsedCargo.packageType === 'pallets' ? '托盘' :
                                               parsedCargo.packageType === 'boxes' ? '箱' : '件'}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Label className="text-sm text-muted-foreground">实际重量</Label>
                <p className="text-lg font-semibold text-blue-600">
                  {calculations.totalWeight} kg
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <Label className="text-sm text-muted-foreground">总体积</Label>
                <p className="text-lg font-semibold text-green-600">
                  {calculations.totalVolume} cbm
                </p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <Label className="text-sm text-muted-foreground">体积重</Label>
                <p className="text-lg font-semibold text-orange-600">
                  {calculations.volumeWeight} kg
                </p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <Label className="text-sm text-muted-foreground">计费重量</Label>
                <p className="text-lg font-semibold text-red-600">
                  {calculations.chargeableWeight} kg
                </p>
              </div>
              {(() => {
                const cargoType = getCargoTypeByDensity(calculations.density);
                // 比例格式 1:XXX (1立方米对应XXX公斤)
                const ratio = calculations.density.toFixed(1);
                return (
                  <div className={`p-3 ${cargoType.bgClass} rounded-lg`}>
                    <Label className="text-sm text-muted-foreground">货物比重 kg/cbm</Label>
                    <p className={`text-lg font-semibold ${cargoType.colorClass}`}>
                      1:{ratio}
                    </p>
                    <p className={`text-xs ${cargoType.colorClass} font-medium`}>
                      {cargoType.type}
                    </p>
                  </div>
                );
              })()}
            </div>

            {/* 货物类型说明 */}
            {calculations.density > 0 && (() => {
              const cargoType = getCargoTypeByDensity(calculations.density);
              return (
                <div className="mt-4 p-3 border-l-4 border-l-gray-300 bg-gray-50 rounded-r-lg">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">货物类型判断：</span>
                    {cargoType.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    比重越高，货物越重；比重越低，货物越轻泡。不同类型货物的运费计算方式可能有所不同。
                  </p>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      )}

      {/* 生成报价按钮 */}
      <div className="flex justify-center">
        <Button
          onClick={handleGenerateQuote}
          disabled={!destination.trim() || !calculations || isLoading}
          size="lg"
          className="px-8"
        >
          {isLoading ? '生成报价中...' : '生成报价'}
        </Button>
      </div>
    </div>
  );
}
