import re

# 读取文件
with open('src/lib/cargo-parser.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 修复剩余的dimension对象
remaining_fixes = [
    # 修复newDimensions.push格式
    {
        'old': """          newDimensions.push({
            length: Number.parseFloat(sizeMatch[1]),
            width: Number.parseFloat(sizeMatch[2]),
            height: Number.parseFloat(sizeMatch[3]),
            quantity: 1 // 默认1件
          });""",
        'new': """          const length = Number.parseFloat(sizeMatch[1]);
          const width = Number.parseFloat(sizeMatch[2]);
          const height = Number.parseFloat(sizeMatch[3]);
          const unit = detectDimensionUnit(correctedText, length, width, height);
          newDimensions.push({
            length: length,
            width: width,
            height: height,
            quantity: 1, // 默认1件
            unit: unit
          });"""
    }
]

# 应用修复
for i, fix in enumerate(remaining_fixes):
    if fix['old'] in content:
        content = content.replace(fix['old'], fix['new'])
        print(f"✅ 应用了剩余修复 {i+1}")
    else:
        print(f"⚠️  剩余修复 {i+1} 没有找到匹配的文本")

# 写入文件
with open('src/lib/cargo-parser.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("🎉 剩余修复完成！")