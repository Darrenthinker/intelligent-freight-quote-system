import re

# 读取文件
with open('src/lib/cargo-parser.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

print("分析当前文件中dimensions的使用情况:")
print(f"文件总行数: {len(lines)}")

# 查找包含dimensions的行
dimensions_lines = []
for i, line in enumerate(lines):
    if 'dimensions' in line.lower():
        dimensions_lines.append((i+1, line.strip()))

print(f"\n找到 {len(dimensions_lines)} 行包含'dimensions':")
for line_num, line in dimensions_lines:
    print(f"  第{line_num}行: {line}")

# 查找包含 length: 的行
length_lines = []
for i, line in enumerate(lines):
    if 'length:' in line:
        length_lines.append((i+1, line.strip()))

print(f"\n找到 {len(length_lines)} 行包含'length:':")
for line_num, line in length_lines:
    print(f"  第{line_num}行: {line}")

# 查找包含 result.dimensions = 的行
result_dimensions_lines = []
for i, line in enumerate(lines):
    if 'result.dimensions' in line and '=' in line:
        result_dimensions_lines.append((i+1, line.strip()))

print(f"\n找到 {len(result_dimensions_lines)} 行包含'result.dimensions =':")
for line_num, line in result_dimensions_lines:
    print(f"  第{line_num}行: {line}")

# 查找可能的dimension对象创建模式
dimension_patterns = [
    r'length:\s*[^,]+,\s*width:\s*[^,]+,\s*height:\s*[^,]+',
    r'\{\s*length:',
    r'parseFloat.*length',
    r'Number\.parseFloat'
]

for pattern in dimension_patterns:
    matches = []
    for i, line in enumerate(lines):
        if re.search(pattern, line):
            matches.append((i+1, line.strip()))
    
    if matches:
        print(f"\n模式 '{pattern}' 找到 {len(matches)} 个匹配:")
        for line_num, line in matches:
            print(f"  第{line_num}行: {line}")