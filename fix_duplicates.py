import re

# 读取文件
with open('src/lib/cargo-parser.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 删除重复的 const unit 声明
# 保留第一个，删除连续的重复声明
lines = content.split('\n')
new_lines = []
last_was_const_unit = False

for line in lines:
    is_const_unit = 'const unit = detectDimensionUnit' in line
    
    if is_const_unit and last_was_const_unit:
        # 跳过重复的const unit声明
        continue
    else:
        new_lines.append(line)
    
    last_was_const_unit = is_const_unit

# 重新组合内容
new_content = '\n'.join(new_lines)

# 写入文件
with open('src/lib/cargo-parser.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("✅ 删除了重复的const unit声明")

# 验证修复结果
with open('src/lib/cargo-parser.ts', 'r', encoding='utf-8') as f:
    content = f.read()

import subprocess
result = subprocess.run(['grep', '-n', 'const unit'], input=content, text=True, capture_output=True)
print("修复后的const unit声明:")
print(result.stdout)