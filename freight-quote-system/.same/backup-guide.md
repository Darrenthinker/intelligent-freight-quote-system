# 自动备份使用指南

## 🚀 快速备份命令

### 基础备份
```bash
./auto-backup.sh
```

### 带自定义信息的备份
```bash
./auto-backup.sh "✅ 数据识别模块优化完成"
```

### 带标签的备份
```bash
./auto-backup.sh "🎯 V128稳定版本" "v1.28.0"
```

## 📋 备份时机建议

### 🔒 必须备份的时机
- 重要功能完成后
- 界面重大调整后
- 核心算法修改后
- 数据库结构变更后
- 版本发布前

### ⚡ 自动备份触发
- 每天晚上8点自动备份
- 重大功能开发前先备份
- 遇到问题需要回滚前备份

## 🛡️ 回滚方法

### 回滚到最近版本
```bash
git reset --hard HEAD~1
```

### 回滚到指定标签
```bash
git checkout v1.27.0
```

### 查看所有备份版本
```bash
git tag -l
git log --oneline -10
```

## 📊 备份状态查看

### 检查远程同步状态
```bash
git status
git remote -v
```

### 查看最近备份
```bash
git log --oneline -5
```

## 🔧 备份脚本功能

- ✅ 自动检测未提交变更
- ✅ 自动提交所有修改
- ✅ 自动推送到GitHub
- ✅ 可选标签创建
- ✅ 备份状态报告
- ✅ 错误自动停止

## 📱 使用示例

```bash
# 日常备份
./auto-backup.sh "修复数据识别bug"

# 版本发布备份
./auto-backup.sh "V129版本发布" "v1.29.0"

# 紧急备份
./auto-backup.sh "紧急修复生产问题"
```
