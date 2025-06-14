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
              <div className="grid grid-cols-12 gap-1">
                <Button variant="outline" size="sm" onClick={() => loadSampleData('traditional')}>传统格式</Button>
                <Button variant="outline" size="sm" onClick={() => loadSampleData('newFormat')}>批量格式</Button>
                <Button variant="outline" size="sm" onClick={() => loadSampleData('latest')}>单托格式</Button>
                <Button variant="outline" size="sm" onClick={() => loadSampleData('table')}>表格格式</Button>
                <Button variant="outline" size="sm" onClick={() => loadSampleData('boxSpec')}>箱规格式</Button>
                <Button variant="outline" size="sm" onClick={() => loadSampleData('commodity')}>商品格式</Button>
                <Button variant="outline" size="sm" onClick={() => loadSampleData('pallet')}>托盘格式</Button>
                <Button variant="outline" size="sm" onClick={() => loadSampleData('multiSize')}>多尺寸格式</Button>
                <Button variant="outline" size="sm" onClick={() => loadSampleData('air')}>空运格式</Button>
                <Button variant="outline" size="sm" onClick={() => loadSampleData('box')}>木箱格式</Button>
                <Button variant="outline" size="sm" onClick={() => loadSampleData('electric')}>带电货物</Button>
                <Button variant="outline" size="sm" onClick={() => loadSampleData('battery')}>电池类</Button>
                <Button variant="outline" size="sm" onClick={() => loadSampleData('general')}>普通货物</Button>
                <Button variant="outline" size="sm" onClick={() => loadSampleData('boxCount')}>箱数格式</Button>
                <Button variant="outline" size="sm" onClick={() => loadSampleData('complex')}>复杂格式</Button>
                <Button variant="outline" size="sm" onClick={() => loadSampleData('singleItem')}>单件规格</Button>
                <Button variant="outline" size="sm" onClick={() => loadSampleData('chineseVolume')}>中文体积</Button>
                <Button variant="outline" size="sm" onClick={() => loadSampleData('led')}>LED产品</Button>
                <Button variant="outline" size="sm" onClick={() => loadSampleData('delTriple')}>DEL三元组</Button>
                <Button variant="outline" size="sm" onClick={() => loadSampleData('triple1')}>三元组格式1</Button>
                <Button variant="outline" size="sm" onClick={() => loadSampleData('triple2')}>三元组格式2</Button>
                <Button variant="outline" size="sm" onClick={() => loadSampleData('triple3')}>三元组格式3</Button>
                <Button variant="outline" size="sm" onClick={() => loadSampleData('triple4')}>三元组格式4</Button>
                <Button variant="outline" size="sm" onClick={() => loadSampleData('triple5')}>三元组格式5</Button>
                <Button variant="outline" size="sm" onClick={() => loadSampleData('ctns')}>CTNS格式</Button>
                <Button variant="outline" size="sm" onClick={() => loadSampleData('ccu')}>CCU格式</Button>
                <Button variant="outline" size="sm" onClick={() => loadSampleData('khi')}>KHI格式</Button>
                <Button variant="outline" size="sm" onClick={() => loadSampleData('beg')}>BEG格式</Button>
                <Button variant="outline" size="sm" onClick={() => loadSampleData('pek')}>PEK格式</Button>
                <Button variant="outline" size="sm" onClick={() => loadSampleData('bom')}>BOM格式</Button>
                <Button variant="outline" size="sm" onClick={() => loadSampleData('gw')}>GW格式</Button>
                <Button variant="outline" size="sm" onClick={() => loadSampleData('nw')}>NW格式</Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="transport-mode">运输方式</Label>
              <div className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900">
                国际空运
              </div>
            </div>
            <div>
              <Label htmlFor="origin">起运地</Label>
              <Input
                id="origin"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="等待确认"
              />
            </div>
            <div>
              <Label htmlFor="destination">目的地</Label>
              <Input
                id="destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="等待确认"
              />
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                {parsedCargo.name && (
                  <div>
                    <Label className="text-muted-foreground">货物名称</Label>
                    <p className="font-medium">{parsedCargo.name}</p>
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
                {parsedCargo.pieces && (
                  <div>
                    <Label className="text-muted-foreground">件数</Label>
                    <p className="font-medium">{parsedCargo.pieces} 件</p>
                  </div>
                )}
              </div>

              {/* 尺寸明细 */}
              {parsedCargo.dimensions && parsedCargo.dimensions.length > 0 && (
                <div>
                  <Label className="text-muted-foreground">尺寸明细</Label>
                  <div className="mt-2 space-y-2">
                    {parsedCargo.dimensions.map((dim, index) => {
                      // 🔥 修复：根据单位正确计算体积
                      let volumeInCubicMeters: number;
                      const unit = dim.unit || 'cm'; // 默认厘米

                      if (unit === 'm') {
                        // 米 → 立方米：直接相乘
                        volumeInCubicMeters = dim.length * dim.width * dim.height;
                      } else if (unit === 'cm') {
                        // 厘米 → 立方米：除以 1,000,000
                        volumeInCubicMeters = (dim.length * dim.width * dim.height) / 1000000;
                      } else {
                        // 毫米 → 立方米：除以 1,000,000,000
                        volumeInCubicMeters = (dim.length * dim.width * dim.height) / 1000000000;
                      }

                      const totalVolume = volumeInCubicMeters * dim.quantity;

                      return (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                          <span>{dim.length} × {dim.width} × {dim.height} {unit}</span>
                          <span className="text-muted-foreground">{dim.quantity} 件</span>
                          <span className="font-medium">
                            {totalVolume.toFixed(3)} cbm
                          </span>
                        </div>
                      );
                    })}
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
            <CardTitle>计算结果</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
              <div className="p-3 bg-purple-50 rounded-lg">
                <Label className="text-sm text-muted-foreground">件数</Label>
                <p className="text-lg font-semibold text-purple-600">
                  {calculations.totalPieces} 件
                </p>
              </div>
            </div>

            {/* 货物类型说明 */}
            {calculations.density > 0 && (() => {
              const cargoType = getCargoTypeByDensity(calculations.density);
              return (
                <div className="mt-4 p-3 border-l-4 border-l-gray-300 bg-gray-50 rounded-r-lg">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">货物密度：</span>
                    {calculations.density} kg/cbm ({cargoType.type})
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
