import re

# 读取文件
with open('src/lib/cargo-parser.ts', 'r', encoding='utf-8') as f:
    content = f.read()

print("开始完整修复...")

# 1. 修改Dimension接口
old_interface = """export interface Dimension {
  length: number; // cm
  width: number; // cm
  height: number; // cm
  quantity: number;
}"""

new_interface = """export interface Dimension {
  length: number; // cm
  width: number; // cm
  height: number; // cm
  quantity: number;
  unit: 'm' | 'cm' | 'mm'; // 单位：米、厘米、毫米
}"""

content = content.replace(old_interface, new_interface)
print("✅ 修改了Dimension接口")

# 2. 添加detectDimensionUnit函数
detect_function = """
// 智能单位识别函数
function detectDimensionUnit(text: string, length: number, width: number, height: number): 'm' | 'cm' | 'mm' {
  const normalizedText = text.toLowerCase();
  
  // 1. 明确的单位标识符
  if (normalizedText.includes('mm') || normalizedText.includes('毫米')) {
    return 'mm';
  }
  
  // 检查是否包含"m"但不包含"cm"（避免误判cm为m）
  if (normalizedText.includes('m') && !normalizedText.includes('cm') && !normalizedText.includes('mm')) {
    return 'm';
  }
  
  if (normalizedText.includes('cm') || normalizedText.includes('厘米')) {
    return 'cm';
  }
  
  // 2. 基于数值大小的智能判断
  const maxDimension = Math.max(length, width, height);
  
  // 如果最大尺寸超过1000，很可能是毫米
  if (maxDimension > 1000) {
    return 'mm';
  }
  
  // 如果最大尺寸小于10，很可能是米
  if (maxDimension < 10) {
    return 'm';
  }
  
  // 10-1000之间默认为厘米
  return 'cm';
}
"""

# 在normalizeText函数后添加detectDimensionUnit函数
insertion_point = content.find("}\n// 保持向后兼容")
if insertion_point != -1:
    content = content[:insertion_point] + "}" + detect_function + "\n// 保持向后兼容" + content[insertion_point+25:]
    print("✅ 添加了detectDimensionUnit函数")

# 3. 系统地修复所有dimension对象创建
fixes = [
    # 修复1: 包装格式中的dimensions.push
    {
        'pattern': r'(dimensions\.push\(\{\s*length: Number\.parseFloat\(sizeMatch\[1\]\) / 10, // mm转cm\s*width: Number\.parseFloat\(sizeMatch\[2\]\) / 10,\s*height: Number\.parseFloat\(sizeMatch\[3\]\) / 10,\s*quantity: 1) // 每个包装1件\s*\}\);',
        'replacement': r'const length = Number.parseFloat(sizeMatch[1]) / 10; // mm转cm\n        const width = Number.parseFloat(sizeMatch[2]) / 10;\n        const height = Number.parseFloat(sizeMatch[3]) / 10;\n        const unit = detectDimensionUnit(currentLine, length, width, height);\n        dimensions.push({\n          length: length,\n          width: width,\n          height: height,\n          quantity: 1, // 每个包装1件\n          unit: unit\n        });'
    },
    
    # 修复2: result.dimensions直接赋值的情况
    {
        'pattern': r'(result\.dimensions = \[\{\s*length: length,\s*width: width,\s*height: height,\s*quantity: [^}]+)\s*\}\];',
        'replacement': r'const unit = detectDimensionUnit(correctedText, length, width, height);\n            \1,\n              unit: unit\n            }];'
    },
    
    # 修复3: newDimensions.push的情况
    {
        'pattern': r'(newDimensions\.push\(\{\s*length: Number\.parseFloat\(sizeMatch\[1\]\),\s*width: Number\.parseFloat\(sizeMatch\[2\]\),\s*height: Number\.parseFloat\(sizeMatch\[3\]\),\s*quantity: [^}]+)\s*\}\);',
        'replacement': r'const length = Number.parseFloat(sizeMatch[1]);\n          const width = Number.parseFloat(sizeMatch[2]);\n          const height = Number.parseFloat(sizeMatch[3]);\n          const quantity = Number.parseInt(sizeMatch[4]) || 1;\n          const unit = detectDimensionUnit(correctedText, length, width, height);\n          newDimensions.push({\n            length: length,\n            width: width,\n            height: height,\n            quantity: quantity,\n            unit: unit\n          });'
    }
]

# 手动处理具体的修复，因为正则表达式对于多行匹配可能不够精确
# 修复1: dimensions.push
old1 = """        dimensions.push({
          length: Number.parseFloat(sizeMatch[1]) / 10, // mm转cm
          width: Number.parseFloat(sizeMatch[2]) / 10,
          height: Number.parseFloat(sizeMatch[3]) / 10,
          quantity: 1 // 每个包装1件
        });"""

new1 = """        const length = Number.parseFloat(sizeMatch[1]) / 10; // mm转cm
        const width = Number.parseFloat(sizeMatch[2]) / 10;
        const height = Number.parseFloat(sizeMatch[3]) / 10;
        const unit = detectDimensionUnit(currentLine, length, width, height);
        dimensions.push({
          length: length,
          width: width,
          height: height,
          quantity: 1, // 每个包装1件
          unit: unit
        });"""

content = content.replace(old1, new1)
print("✅ 修复了dimensions.push")

# 修复2和3: result.dimensions直接赋值
patterns_to_fix = [
    (r'(\s+)result\.dimensions = \[\{\s*length: length,\s*width: width,\s*height: height,\s*quantity: ([^}]+)\s*\}\];',
     r'\1const unit = detectDimensionUnit(correctedText, length, width, height);\n\1result.dimensions = [{\n\1  length: length,\n\1  width: width,\n\1  height: height,\n\1  quantity: \2,\n\1  unit: unit\n\1}];'),
    
    (r'(\s+)newDimensions\.push\(\{\s*length: Number\.parseFloat\(sizeMatch\[1\]\),\s*width: Number\.parseFloat\(sizeMatch\[2\]\),\s*height: Number\.parseFloat\(sizeMatch\[3\]\),\s*quantity: ([^}]+)\s*\}\);',
     r'\1const length = Number.parseFloat(sizeMatch[1]);\n\1const width = Number.parseFloat(sizeMatch[2]);\n\1const height = Number.parseFloat(sizeMatch[3]);\n\1const quantity = \2;\n\1const unit = detectDimensionUnit(correctedText, length, width, height);\n\1newDimensions.push({\n\1  length: length,\n\1  width: width,\n\1  height: height,\n\1  quantity: quantity,\n\1  unit: unit\n\1});')
]

for pattern, replacement in patterns_to_fix:
    content = re.sub(pattern, replacement, content, flags=re.MULTILINE)
    print(f"✅ 应用了模式修复")

# 写入文件
with open('src/lib/cargo-parser.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("🎉 完整修复完成！")

# 验证结果
print("\n验证修复结果:")
import subprocess
result = subprocess.run(['grep', '-n', 'const unit'], input=content, text=True, capture_output=True)
print("const unit声明:")
print(result.stdout)

# 检查是否有语法错误
print("\n检查dimensions对象:")
result2 = subprocess.run(['grep', '-A 5', '-B 2', 'length:.*width:.*height:'], input=content, text=True, capture_output=True)
if result2.returncode == 0:
    print("找到dimension对象定义")
else:
    print("没有找到明显的dimension对象定义问题")