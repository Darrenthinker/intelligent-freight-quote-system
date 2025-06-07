# 智能货运报价系统

一键解析货物信息，自动计算重量，多方案对比选择

## 🎯 项目愿景

打造货代行业的智能报价系统，通过AI驱动的数据识别和智能算法，实现快速、精准的货运报价，提升行业效率。

## 🏗️ 系统架构

### 三大核心模块

1. **数据识别模块** - 智能解析各种格式的货物信息
2. **报价表管理模块** - 灵活管理航司价格和规则
3. **智能报价模块** - 自动匹配最优路线和价格

## 🚀 核心功能

### ✅ 已实现功能

- [x] 多格式文本数据解析
- [x] 智能重量、体积、件数计算
- [x] 全球机场代码识别 (150+)
- [x] 货物类型自动判断
- [x] 带电货物识别和警告
- [x] 多种尺寸单位支持 (米/厘米/毫米)
- [x] 托盘、箱子、散件包装识别
- [x] 实时解析预览

### 🔄 开发中功能

- [ ] OCR图片识别
- [ ] 批量Excel导入
- [ ] 航司价格表管理
- [ ] 多航司报价对比
- [ ] 每日汇总分析

### 📋 计划功能

- [ ] 全球1000+机场数据库
- [ ] 直航/转飞路线优化
- [ ] 价格趋势分析
- [ ] 自动化报价单生成
- [ ] 移动端适配

## 🛠️ 技术栈

- **前端**: Next.js 15 + TypeScript + Tailwind CSS
- **UI组件**: shadcn/ui
- **包管理**: Bun
- **部署**: Netlify
- **代码质量**: Biome (Linting & Formatting)

## 📦 快速开始

### 环境要求

- Node.js 18+
- Bun (推荐) 或 npm

### 安装和运行

```bash
# 克隆项目
git clone <repository-url>
cd freight-quote-system

# 安装依赖
bun install

# 启动开发服务器
bun run dev

# 构建生产版本
bun run build
```

### 开发命令

```bash
# 代码检查
bun run lint

# 代码格式化
bun run format

# 类型检查
bun run type-check
```

## 📊 数据格式支持

### 支持的输入格式

1. **传统格式**: `WAW设备及配件 2500 kgs ; 14.71 cbm ; 6托`
2. **三元组格式**: `42件/751KG/2.57CBM`
3. **机场代码格式**: `DOH 3/908.3/5.66CBM`
4. **尺寸明细格式**: `120x100x65 cm`
5. **托盘格式**: `重量：23托 重量:9765 KGS`
6. **批量格式**: `148*113*80/1`

### 智能识别能力

- 自动识别起运地和目的地
- 智能单位转换 (kg/g, cbm/m³, cm/mm/m)
- 货物密度计算和类型判断
- 带电货物自动检测
- 体积重量自动计算

## 🗂️ 项目结构

```
freight-quote-system/
├── src/
│   ├── app/                 # Next.js App Router
│   ├── components/          # React组件
│   │   ├── ui/             # 基础UI组件
│   │   ├── cargo-input.tsx # 货物信息输入
│   │   └── quote-results.tsx # 报价结果显示
│   └── lib/                # 核心库
│       ├── cargo-parser.ts # 货物数据解析
│       ├── airport-codes.ts # 机场代码数据库
│       └── freight-rates.ts # 运费计算
├── .same/                  # 项目管理
│   └── todos.md           # 开发任务跟踪
└── docs/                  # 项目文档
```

## 🔖 版本历史

### V94 - 当前版本 (2024-12-07)
- ✅ V57单位修复验证完成
- ✅ 米、厘米、毫米三种尺寸单位正确处理
- ✅ 特殊重量+托盘格式支持
- ✅ 增加专用验证按钮

### V93 - V57尺寸单位修复
- ✅ 修复calculateTotalVolume函数
- ✅ 添加特殊格式支持
- ✅ 完善dimensions单位字段

## 🤝 贡献指南

### 开发流程

1. 创建功能分支: `git checkout -b feature/新功能名称`
2. 开发和测试功能
3. 提交代码: `git commit -m "feat: 添加新功能"`
4. 推送分支: `git push origin feature/新功能名称`
5. 创建Pull Request

### 代码规范

- 使用TypeScript进行类型安全
- 遵循Biome代码格式规范
- 组件采用函数式写法
- 使用描述性的变量和函数名

## 📞 联系方式

- 项目维护者: Freight System Team
- 邮箱: developer@freightsystem.com

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

---

⚡ **智能货运报价系统 - 让报价更简单、更精准、更高效！**
