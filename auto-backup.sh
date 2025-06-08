#!/bin/bash

# 自动备份脚本 - 每2个版本自动备份
# 用法: ./auto-backup.sh "版本描述"

if [ $# -eq 0 ]; then
    echo "用法: ./auto-backup.sh \"版本描述\""
    exit 1
fi

VERSION_DESC="$1"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# 检查是否是git仓库
if [ ! -d ".git" ]; then
    echo "初始化Git仓库..."
    git init
fi

# 添加所有文件
git add .

# 获取当前提交数量
COMMIT_COUNT=$(git rev-list --count HEAD 2>/dev/null || echo "0")

# 计算版本号
VERSION_NUM=$((COMMIT_COUNT + 1))

# 提交当前版本
git commit -m "V${VERSION_NUM} - ${VERSION_DESC} [${TIMESTAMP}]"

# 每2个版本创建一个tag
if [ $((VERSION_NUM % 2)) -eq 0 ]; then
    TAG_NAME="backup-v${VERSION_NUM}"
    git tag -a "$TAG_NAME" -m "自动备份: V${VERSION_NUM} - ${VERSION_DESC}"
    echo "✅ 创建备份标签: $TAG_NAME"
fi

echo "✅ 版本 V${VERSION_NUM} 已保存"
echo "✅ 提交哈希: $(git rev-parse --short HEAD)"

# 显示最近的5个提交
echo ""
echo "📋 最近的提交记录:"
git log --oneline -5
