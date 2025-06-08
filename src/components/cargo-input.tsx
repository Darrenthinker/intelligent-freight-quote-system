'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { parseCargoText, calculateCargoMetrics, getCargoTypeByDensity, type CargoInfo, type CalculationResult } from "@/lib/cargo-parser";
import { generateQuotes, type Quote } from "@/lib/freight-rates";

interface CargoInputProps {
  onQuotesGenerated: (quotes: Quote[]) => void;
}

export function CargoInput({ onQuotesGenerated }: CargoInputProps) {
  const [cargoText, setCargoText] = useState('');
  const [origin, setOrigin] = useState('等待确认');
  const [destination, setDestination] = useState('');

  const [parsedCargo, setParsedCargo] = useState<Partial<CargoInfo>>({});
  const [calculations, setCalculations] = useState<CalculationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 所有示例数据 - 恢复完整列表用于逐个测试和修复
  const sampleData = {
    traditional: `WAW设备及配件
2500 kgs ; 14.71 cbm ; 6托
货在广州
120x100x65 cm`,

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
货在河南`,

    moreAirport: `LHR
2/456.7/3.2CBM
80X60X120cm
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

    triple1: "42件/751KG/2.57CBM",
    triple2: "2.57CBM/751KG/42件",
    triple3: "751KG/2.57CBM/42件",
    triple4: "42件/2.57CBM/751KG",
    triple5: "2.57CBM/42件/751KG",

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

  // 自动解析货物信息
  useEffect(() => {
    if (cargoText.trim()) {
      console.log('🔥 开始解析货物信息:', cargoText);

      const parsed = parseCargoText(cargoText);
      console.log('🔥 解析结果:', parsed);

      setParsedCargo(parsed);

      // 自动设置起运地和目的地
      if (parsed.origin) {
        setOrigin(parsed.origin);
      }
      if (parsed.destination) {
        setDestination(parsed.destination);
      }

      // 计算结果 - 使用空运计算方式
      const calculations = calculateCargoMetrics(parsed, 'air');
      console.log('🔥 计算结果:', calculations);
      setCalculations(calculations);
    } else {
      setParsedCargo({});
      setCalculations(null);
      setOrigin('等待确认');
    }
  }, [cargoText]);

  // 示例数据加载函数
  const loadSampleData = (key: keyof typeof sampleData, dest = '') => {
    setCargoText(sampleData[key]);
    if (dest) setDestination(dest);
  };

  // 生成报价
  const handleGenerateQuote = async () => {
    if (!destination.trim() || !calculations) {
      alert('请填写目的地信息');
      return;
    }

    setIsLoading(true);
    try {
      // 固定使用空运模式
      const modeCalc = calculateCargoMetrics(parsedCargo, 'air');
      const quotes = generateQuotes(
        origin,
        destination,
        modeCalc.chargeableWeight,
        modeCalc.totalVolume,
        'air'
      );

      onQuotesGenerated(quotes);
    } catch (error) {
      console.error('生成报价失败:', error);
      alert('生成报价失败，请检查输入信息');
    } finally {
      setIsLoading(false);
    }
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
              <div className="grid grid-cols-8 gap-1">
                <Button variant="outline" size="sm" onClick={() => loadSampleData('traditional', '洛杉矶')}>传统格式示例</Button>
                <Button variant="outline" size="sm" onClick={() => loadSampleData('newFormat', '洛杉矶')}>批量格式示例</Button>
                <Button variant="outline" size="sm" onClick={() => loadSampleData('latest', '洛杉矶')}>单托格式示例</Button>
                <Button variant="outline" size="sm" onClick={() => loadSampleData('table', '洛杉矶')}>表格格式示例</Button>
                <Button variant="outline" size="sm" onClick={() => loadSampleData('boxSpec', '洛杉矶')}>箱规格式示例</Button>
                <Button variant="outline" size="sm" onClick={() => loadSampleData('commodity', '洛杉矶')}>商品格式示例</Button>
                <Button variant="outline" size="sm" onClick={() => loadSampleData('pallet', '洛杉矶')}>托盘格式示例</Button>
                <Button variant="outline" size="sm" onClick={() => loadSampleData('multiSize', '洛杉矶')}>多尺寸格式示例</Button>
                <Button variant="outline" size="sm" onClick={() => loadSampleData('air')}>空运格式示例</Button>
                <Button variant="outline" size="sm" onClick={() => loadSampleData('moreAirport')}>更多机场代码示例</Button>
                <Button variant="outline" size="sm" onClick={() => loadSampleData('box')}>木箱格式示例</Button>
                <Button variant="outline" size="sm" onClick={() => loadSampleData('electric')}>带电货物示例</Button>
                <Button variant="outline" size="sm" onClick={() => loadSampleData('battery')}>电池类示例</Button>
                <Button variant="outline" size="sm" onClick={() => loadSampleData('general')}>普通货物示例</Button>
                <Button variant="outline" size="sm" onClick={() => loadSampleData('boxCount')}>箱数格式示例</Button>
                <Button variant="outline" size="sm" onClick={() => loadSampleData('complex')}>复杂格式示例</Button>
                <Button variant="outline" size="sm" onClick={() => loadSampleData('singleItem')}>单件规格示例</Button>
                <Button variant="outline" size="sm" onClick={() => loadSampleData('chineseVolume')}>中文体积示例</Button>
                <Button variant="outline" size="sm" onClick={() => loadSampleData('led')}>LED产品示例</Button>
                <Button variant="outline" size="sm" onClick={() => loadSampleData('questionMark')}>问号字符修复示例</Button>
                <Button variant="outline" size="sm" onClick={() => loadSampleData('weightVolumePieces')}>重量/体积/件数格式</Button>
                <Button variant="outline" size="sm" onClick={() => loadSampleData('flexibleOrder')}>智能顺序识别</Button>
                <Button variant="outline" size="sm" onClick={() => loadSampleData('palletDetail')}>托盘详细格式示例</Button>
                <Button variant="outline" size="sm" onClick={() => loadSampleData('delTriple')}>DEL三元组示例</Button>
                <Button variant="outline" size="sm" onClick={() => loadSampleData('triple1')}>三元组格式1</Button>
                <Button variant="outline" size="sm" onClick={() => loadSampleData('triple2')}>三元组格式2</Button>
                <Button variant="outline" size="sm" onClick={() => loadSampleData('triple3')}>三元组格式3</Button>
                <Button variant="outline" size="sm" onClick={() => loadSampleData('triple4')}>三元组格式4</Button>
                <Button variant="outline" size="sm" onClick={() => loadSampleData('triple5')}>三元组格式5</Button>
                <Button variant="outline" size="sm" onClick={() => loadSampleData('ctns')}>CTNS格式+箱规示例</Button>
                <Button variant="outline" size="sm" onClick={() => loadSampleData('ccu')}>CCU新格式示例</Button>
                <Button variant="outline" size="sm" onClick={() => loadSampleData('khi')}>KHI双斜杠格式示例</Button>
                <Button variant="outline" size="sm" onClick={() => loadSampleData('beg')}>BEG新格式示例</Button>
                <Button variant="outline" size="sm" onClick={() => loadSampleData('pek')}>PEK新格式示例</Button>
                <Button variant="outline" size="sm" onClick={() => loadSampleData('simpleTriple')}>简化三元组格式示例</Button>
                <Button variant="outline" size="sm" onClick={() => loadSampleData('bom')}>BOM新格式示例</Button>
                <Button variant="outline" size="sm" onClick={() => loadSampleData('gw')}>GW格式示例</Button>
                <Button variant="outline" size="sm" onClick={() => loadSampleData('nw')}>NW格式示例</Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="transport-mode">运输方式</Label>
              <div className="flex h-10 w-full rounded-md border border-input bg-blue-50 px-3 py-2 text-sm ring-offset-background text-blue-700 font-medium">
                <span className="mr-2">🛫</span>
                国际空运
              </div>
            </div>
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
          </div>
        </CardContent>
      </Card>

      {/* 货物解析展示 - 紧凑的两行显示 */}
      {(parsedCargo.name || parsedCargo.dimensions) && (
        <Card>
          <CardHeader>
            <CardTitle>货物解析</CardTitle>
          </CardHeader>
          <CardContent>
            {/* 紧凑的两行显示 */}
            <div className="space-y-2 text-sm">
              {/* 第一行：名称、件数、重量、体积 */}
              <div className="grid grid-cols-4 gap-4">
                <div className="flex">
                  <span className="text-gray-600 w-12">名称</span>
                  <span className="text-gray-900 font-medium">
                    {parsedCargo.name || '未识别'}
                  </span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-12">件数</span>
                  <span className="text-gray-900 font-medium">
                    {parsedCargo.pieces || '-'} 件
                  </span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-12">重量</span>
                  <span className="text-gray-900 font-medium">
                    {parsedCargo.weight || '-'} kg
                  </span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-12">体积</span>
                  <span className="text-gray-900 font-medium">
                    {parsedCargo.volume || '-'} cbm
                  </span>
                </div>
              </div>

              {/* 第二行：起运地、目的地 */}
              <div className="grid grid-cols-2 gap-8">
                <div className="flex">
                  <span className="text-gray-600 w-16">起运地</span>
                  <span className="text-gray-900 font-medium">
                    {parsedCargo.origin || origin || '等待确认'}
                  </span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-16">目的地</span>
                  <span className="text-gray-900 font-medium">
                    {parsedCargo.destination || parsedCargo.destinationCode || destination || '等待确认'}
                  </span>
                </div>
              </div>
            </div>

            {/* 尺寸明细 - 显示计算过程 */}
            {parsedCargo.dimensions && parsedCargo.dimensions.length > 0 && (
              <div className="mt-4 pt-3 border-t border-gray-200">
                <div className="mb-2">
                  <span className="text-gray-600 text-sm font-medium">尺寸明细</span>
                </div>
                <div className="space-y-2">
                  {parsedCargo.dimensions.map((dim, index) => {
                    // 根据单位正确计算体积
                    let volumeInCubicMeters: number;
                    let calculationFormula: string;
                    const unit = dim.unit || 'cm';

                    if (unit === 'm') {
                      volumeInCubicMeters = dim.length * dim.width * dim.height;
                      calculationFormula = `${dim.length} × ${dim.width} × ${dim.height} = ${volumeInCubicMeters.toFixed(3)} m³`;
                    } else if (unit === 'cm') {
                      const volumeInCubicCm = dim.length * dim.width * dim.height;
                      volumeInCubicMeters = volumeInCubicCm / 1000000;
                      calculationFormula = `${dim.length} × ${dim.width} × ${dim.height} = ${volumeInCubicCm.toLocaleString()} cm³ ÷ 1,000,000 = ${volumeInCubicMeters.toFixed(6)} m³`;
                    } else {
                      const volumeInCubicMm = dim.length * dim.width * dim.height;
                      volumeInCubicMeters = volumeInCubicMm / 1000000000;
                      calculationFormula = `${dim.length} × ${dim.width} × ${dim.height} = ${volumeInCubicMm.toLocaleString()} mm³ ÷ 1,000,000,000 = ${volumeInCubicMeters.toFixed(9)} m³`;
                    }

                    const totalVolume = volumeInCubicMeters * dim.quantity;

                    return (
                      <div key={index} className="bg-gray-50 rounded p-2 text-xs border">
                        <div className="font-medium text-gray-900 mb-1">
                          尺寸：{dim.length} × {dim.width} × {dim.height} {unit} ({dim.quantity} 件)
                        </div>
                        <div className="text-gray-600 leading-relaxed">
                          计算过程：{calculationFormula}
                          {dim.quantity > 1 && (
                            <div className="mt-1">
                              总体积：{volumeInCubicMeters.toFixed(6)} m³ × {dim.quantity}件 = {totalVolume.toFixed(3)} CBM
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* 计算结果展示 - 一行6个卡片 */}
      {calculations && (
        <Card>
          <CardHeader>
            <CardTitle>计算结果</CardTitle>
            <CardDescription>
              基于货物信息自动计算的重量、体积和计费重量
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-6 gap-4">
              {/* 货物件数 */}
              <div className="p-3 bg-purple-50 rounded-lg text-center">
                <Label className="text-sm text-muted-foreground block mb-1">货物件数</Label>
                <p className="text-xl font-bold text-purple-600">
                  {calculations.totalPieces}{parsedCargo.packingType === 'pallet' ? '托盘' : '件'}
                </p>
              </div>

              {/* 实际重量 */}
              <div className="p-3 bg-blue-50 rounded-lg text-center">
                <Label className="text-sm text-muted-foreground block mb-1">实际重量</Label>
                <p className="text-xl font-bold text-blue-600">
                  {calculations.totalWeight} KG
                </p>
              </div>

              {/* 总体积 */}
              <div className="p-3 bg-green-50 rounded-lg text-center">
                <Label className="text-sm text-muted-foreground block mb-1">总体积</Label>
                <p className="text-xl font-bold text-green-600">
                  {calculations.totalVolume} CBM
                </p>
              </div>

              {/* 体积重 - 空运按1CBM=167kg计算 */}
              <div className="p-3 bg-orange-50 rounded-lg text-center">
                <Label className="text-sm text-muted-foreground block mb-1">体积重</Label>
                <p className="text-xl font-bold text-orange-600">
                  {Math.round(Number.parseFloat(calculations.totalVolume) * 167)} KG
                </p>
              </div>

              {/* 计费重量 - 取实际重量和体积重的最大值 */}
              <div className="p-3 bg-red-50 rounded-lg text-center">
                <Label className="text-sm text-muted-foreground block mb-1">计费重量</Label>
                <p className="text-xl font-bold text-red-600">
                  {Math.max(calculations.totalWeight, Math.round(Number.parseFloat(calculations.totalVolume) * 167))} KG
                </p>
              </div>

              {/* 货物比重 */}
              <div className="p-3 bg-blue-50 rounded-lg text-center">
                <Label className="text-sm text-muted-foreground block mb-1">货物比重</Label>
                <p className="text-lg font-bold text-blue-600">
                  {calculations.density > 0 ? `1:${calculations.density.toFixed(1)} kg/cbm` : '计算中...'}
                </p>
              </div>
            </div>

            {/* 货物类型说明 */}
            {calculations.density > 0 && (() => {
              const cargoType = getCargoTypeByDensity(calculations.density);
              return (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg border-l-4 border-l-blue-500">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">货物类型分析：</span>
                    {cargoType.type}，密度 {calculations.density} kg/cbm
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {cargoType.description}
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
