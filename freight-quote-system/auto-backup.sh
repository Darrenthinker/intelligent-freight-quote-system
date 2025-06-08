#!/bin/bash

# 智能货运报价系统 - 自动备份脚本
# 每次重大功能完成后调用此脚本进行备份

set -e  # 如果任何命令失败，立即退出

echo "🚀 开始自动备份..."

# 获取当前时间戳
TIMESTAMP=$(date '+%Y%m%d_%H%M%S')
BRANCH_NAME="main"

# 检查是否有未提交的更改
if ! git diff --quiet || ! git diff --staged --quiet; then
    echo "📝 发现未提交的更改，正在提交..."

    # 添加所有更改
    git add .

    # 生成提交信息
    COMMIT_MSG="🔄 自动备份 ${TIMESTAMP}"
    if [ ! -z "$1" ]; then
        COMMIT_MSG="$1"
    fi

    # 提交更改
    git commit -m "$COMMIT_MSG"
    echo "✅ 代码已提交"
else
    echo "✅ 没有需要提交的更改"
fi

# 推送到远程仓库
echo "📤 推送到GitHub..."
git push origin $BRANCH_NAME

# 创建备份标签（如果指定）
if [ ! -z "$2" ]; then
    TAG_NAME="$2"
    echo "🏷️  创建标签: $TAG_NAME"
    git tag -a "$TAG_NAME" -m "自动备份标签 - $TIMESTAMP"
    git push origin "$TAG_NAME"
fi

# 显示备份状态
echo "📊 备份状态:"
echo "   - 时间: $(date)"
echo "   - 分支: $BRANCH_NAME"
echo "   - 远程: $(git remote get-url origin)"
echo "   - 最新提交: $(git log -1 --oneline)"

echo "🎉 自动备份完成！"
