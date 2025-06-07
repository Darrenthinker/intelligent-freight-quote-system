import re

# 读取文件
with open('src/lib/cargo-parser.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 查找并修复剩余的dimension对象
# 使用更通用的正则表达式来查找所有需要修复的地方
pattern = r'(\s+)(\w+\.)?dimensions\s*=\s*\[\{\s*length:\s*length,\s*width:\s*width,\s*height:\s*height,\s*quantity:\s*[^}]+\}\];'

def replace_function(match):
    indent = match.group(1)
    prefix = match.group(2) if match.group(2) else ''
    return f'{indent}const unit = detectDimensionUnit(correctedText, length, width, height);\n{indent}{prefix}dimensions = [{{\n{indent}  length: length,\n{indent}  width: width,\n{indent}  height: height,\n{indent}  quantity: {match.group(0).split("quantity:")[1].split("}")[0].strip()},\n{indent}  unit: unit\n{indent}}}];'

# 应用替换
new_content = re.sub(pattern, replace_function, content, flags=re.MULTILINE)

# 如果正则表达式没有匹配，手动处理特定情况
if new_content == content:
    print("正则表达式没有匹配，手动处理...")
    
    # 手动修复第572行附近
    fix1_old = """            // 设置尺寸信息
            result.dimensions = [{
              length: length,
              width: width,
              height: height,
              quantity: pieces
            }];"""
    
    fix1_new = """            // 设置尺寸信息
            const unit = detectDimensionUnit(correctedText, length, width, height);
            result.dimensions = [{
              length: length,
              width: width,
              height: height,
              quantity: pieces,
              unit: unit
            }];"""
    
    # 手动修复第595行附近
    fix2_old = """            // 设置尺寸信息
            result.dimensions = [{
              length: length,
              width: width,
              height: height,
              quantity: pieces
            }];"""
    
    fix2_new = """            // 设置尺寸信息
            const unit = detectDimensionUnit(correctedText, length, width, height);
            result.dimensions = [{
              length: length,
              width: width,
              height: height,
              quantity: pieces,
              unit: unit
            }];"""
    
    # 由于这两个修复相同，我们需要分别处理
    parts = new_content.split(fix1_old)
    if len(parts) > 1:
        print("找到并修复了第一个匹配")
        new_content = parts[0] + fix1_new + fix1_old.join(parts[1:])
        
        # 处理第二个匹配
        parts = new_content.split(fix1_old)
        if len(parts) > 1:
            print("找到并修复了第二个匹配")
            new_content = parts[0] + fix2_new + fix1_old.join(parts[1:])
    else:
        print("没有找到需要修复的模式")

# 写入文件
with open('src/lib/cargo-parser.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("🎉 最终修复完成！")