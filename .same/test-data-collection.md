# 批量测试数据集

## 🧪 测试数据样本集合

### 1. 传统格式数据
```
WAW设备及配件
2500 kgs ; 14.71 cbm ; 6托
货在广州
120x100x65 cm
192x135x130 cm
192x135x104 cm
192x135x104 cm
192x135x104 cm
192x122x105 cm
```

### 2. 批量格式数据
```
148*113*80/1
168*113*72.5/1
188.5*35.5*71/1
单个托盘120KG
```

### 3. 单托格式数据
```
83*63*77CM, 135KG，一托
```

### 4. 表格格式数据
```
HDL23938566-HDL23938566-收货(KG)235
实重kg 96.00 长cm 150 宽cm 46 高cm 59 件数 4 方数cbm 0.4071 计重 96.00
```

### 5. 箱规格式数据
```
箱规：45*35*30cm，一件重是8.08kg 15箱
```

### 6. 商品格式数据
```
Comm: 运动装备
数量：17箱
尺寸：每箱48 x 48 x 58 厘米
总重量：400 公斤
```

### 7. 托盘格式数据
```
重量：23托 重量:9765 KGS
尺寸：1.2*1.0*1.54m
体积：42 CBM
```

### 8. 多尺寸格式数据
```
货在深圳   -TAS  4件/8.95方/1210kg
尺寸1336*706*2005*2件
2546*781*1300*2件
尺寸mm
```

### 9. 空运格式数据
```
DOH
3/908.3/5.66CBM
110X120X141cm
110X120X143cm
110X120X145CM
货在河南
```

### 10. 木箱格式数据
```
JFK
木箱：1750*1050*1600MM, 480KG
木箱：1800*1470*1470MM, 250KG
2ptls/6.83cbm/730kg
货在佛山顺德
```

### 11. 带电货物数据
```
LAX
音响设备 内置电池
120*80*60cm, 25KG
3件/1.44cbm/75kg
货在深圳
```

### 12. 电池类货物数据
```
FRA
移动电源 锂电池
50*30*20cm, 2KG
10件/0.3cbm/20kg
货在广州
```

### 13. LED产品数据
```
710kg led发光手环（内置碱性干电池，有MSDS），41件，1.6个方，香港飞到捷克布拉格PRG机场
深圳交货，帮忙看下价格
```

### 14. 三元组格式数据
```
DEL 751KG/42件/2.57CBM 货在广东
```

### 15. CTNS格式数据
```
167 CTNS / 11.79 CBM / 634.60 KGS
53.8*32*41cm箱规
```

### 16. CCU格式数据
```
CCU 1028/1.63/35*35*35CM*38CTNS
```

### 17. KHI双斜杠格式数据
```
KHI//3400KG//12.33CBM//145CTNS (1:275)  货在青岛
```

### 18. BEG格式数据
```
BEG   60ctn  618kg  2.41cbm  1:256  蓝牙耳机，带电，这个北京HU能接吗
```

### 19. PEK格式数据
```
PEK---VCP    120×80×127 厘米 1.22方 计费重753.6KG
```

### 20. 简化三元组格式数据
```
120/3000KG/11.8CBM 到DUR 普货  1:250左右
```

## 🎯 期望结果定义

### 每个测试样本的期望输出：
1. **货物名称** - 正确提取产品名称
2. **重量(kg)** - 准确识别总重量
3. **体积(cbm)** - 正确计算或提取体积
4. **件数** - 准确识别件数/箱数/托数
5. **包装类型** - pallets/boxes/pieces
6. **尺寸明细** - 完整的尺寸列表，正确单位
7. **起运地** - 货物所在城市
8. **目的地** - 目的城市和机场代码
9. **特殊属性** - 带电货物标识

## 🔧 自动测试验证项目

### 1. 数据完整性检查
- 关键字段是否为空
- 数值是否合理（重量>0，体积>0）
- 尺寸单位是否正确

### 2. 计算准确性检查
- 尺寸计算体积是否匹配
- 单件重量×件数是否等于总重量
- 密度是否在合理范围

### 3. 格式标准化检查
- 机场代码是否标准化
- 城市名称是否统一
- 数值精度是否一致

### 4. 逻辑一致性检查
- 包装类型与件数描述是否一致
- 起运地与目的地是否合理
- 货物类型与重量密度是否匹配
