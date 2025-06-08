{/* 解析结果展示 */}
      {(parsedCargo.name || parsedCargo.dimensions) && (
        <Card>
          <CardHeader>
            <CardTitle>解析结果</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* 基础货物信息 - 重新设计为简洁表格布局 */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
                {/* 第一行：货物名称 + 件数 */}
                <div className="flex">
                  <span className="text-gray-600 w-20">货物名称</span>
                  <span className="text-gray-900 font-medium">
                    {parsedCargo.name || '未识别'}
                  </span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-16">件数</span>
                  <span className="text-gray-900 font-medium">
                    {parsedCargo.pieces || '-'} 件
                  </span>
                </div>

                {/* 第二行：重量 + 体积 */}
                <div className="flex">
                  <span className="text-gray-600 w-20">重量</span>
                  <span className="text-gray-900 font-medium">
                    {parsedCargo.weight || '-'} kg
                  </span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-16">体积</span>
                  <span className="text-gray-900 font-medium">
                    {parsedCargo.volume || '-'} cbm
                  </span>
                </div>

                {/* 第三行：货物所在地 + 目的地 */}
                <div className="flex">
                  <span className="text-gray-600 w-20">货物所在地</span>
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

              {/* 尺寸明细 - 显示计算过程 */}
              {parsedCargo.dimensions && parsedCargo.dimensions.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="mb-3">
                    <span className="text-gray-600 text-sm">尺寸明细</span>
                  </div>
                  <div className="space-y-3">
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
                        <div key={index} className="bg-gray-50 rounded p-3 text-sm border">
                          <div className="font-medium text-gray-900 mb-2">
                            尺寸：{dim.length} × {dim.width} × {dim.height} {unit} ({dim.quantity} 件)
                          </div>
                          <div className="text-gray-600 text-xs leading-relaxed">
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
            </div>
          </CardContent>
        </Card>
      )}
