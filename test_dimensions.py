import re

# 读取文件
with open('src/lib/cargo-parser.ts', 'r', encoding='utf-8') as f:
    content = f.read()

print("验证所有dimension对象是否都有unit字段...")

# 查找所有dimension对象定义
patterns = [
    # 查找 {length: ..., width: ..., height: ..., quantity: ...} 模式
    r'\{\s*length:\s*[^,]+,\s*width:\s*[^,]+,\s*height:\s*[^,]+,\s*quantity:\s*[^,}]+(?:,\s*unit:\s*[^}]+)?\}',
    # 查找dimensions接口定义
    r'interface Dimension \{[^}]+\}',
]

for i, pattern in enumerate(patterns):
    matches = re.finditer(pattern, content, re.MULTILINE | re.DOTALL)
    
    for match in matches:
        start = match.start()
        line_num = content[:start].count('\n') + 1
        match_text = match.group(0)
        
        if i == 0:  # dimension对象
            if 'unit:' in match_text:
                print(f"✅ 第{line_num}行: dimension对象包含unit字段")
            else:
                print(f"❌ 第{line_num}行: dimension对象缺少unit字段")
                print(f"   内容: {match_text}")
        elif i == 1:  # 接口定义
            if 'unit:' in match_text:
                print(f"✅ 第{line_num}行: Dimension接口包含unit字段")
            else:
                print(f"❌ 第{line_num}行: Dimension接口缺少unit字段")

# 检查detectDimensionUnit函数是否存在
if 'detectDimensionUnit' in content:
    print("✅ detectDimensionUnit函数已存在")
else:
    print("❌ detectDimensionUnit函数缺失")

# 查找所有可能被遗漏的dimension对象创建
lines = content.split('\n')
for i, line in enumerate(lines):
    if 'length:' in line and 'width:' in line and 'height:' in line and 'unit:' not in line:
        if 'function detectDimensionUnit' not in line:  # 排除函数定义
            print(f"⚠️  第{i+1}行可能遗漏了unit字段: {line.strip()}")

print("\n验证完成！")