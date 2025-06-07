import re

# 读取文件
with open('src/lib/cargo-parser.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 查找所有创建dimension对象的模式
patterns = [
    # 模式1: 直接设置 result.dimensions = [{...}]
    r'(result\.dimensions = \[\{[^}]+)(length: [^,]+,\s*width: [^,]+,\s*height: [^,]+,\s*quantity: [^}]+)(\}\];)',
    # 模式2: 在数组中推送 dimensions.push({...}) 或 newDimensions.push({...})
    r'(\w+\.push\(\{[^}]*)(length: [^,]+,\s*width: [^,]+,\s*height: [^,]+,\s*quantity: [^}]+)(\}\);)',
    # 模式3: 创建单个dimension对象
    r'(\{[^}]*)(length: [^,]+,\s*width: [^,]+,\s*height: [^,]+,\s*quantity: [^}]+)(\})',
]

# 查找所有匹配的地方
matches = []
for pattern in patterns:
    for match in re.finditer(pattern, content, re.MULTILINE | re.DOTALL):
        start = match.start()
        end = match.end()
        line_num = content[:start].count('\n') + 1
        matches.append((start, end, line_num, match.group(0)))

print(f"找到 {len(matches)} 个需要修复的dimension对象:")
for start, end, line_num, match_text in matches:
    print(f"  第{line_num}行: {match_text.strip()}")

# 如果没有找到匹配，尝试更简单的搜索
if not matches:
    print("使用简单搜索...")
    lines = content.split('\n')
    for i, line in enumerate(lines):
        if 'length:' in line and 'width:' in line and 'height:' in line:
            print(f"  第{i+1}行: {line.strip()}")
        elif 'length:' in line:
            print(f"  包含length的第{i+1}行: {line.strip()}")