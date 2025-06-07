import re

# 读取文件
with open('src/lib/cargo-parser.ts', 'r', encoding='utf-8') as f:
    content = f.read()

print("开始修复dimensions...")

# 首先修改Dimension接口
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

# 添加detectDimensionUnit函数
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

# 修复所有dimension对象，添加unit字段
fixes = [
    # 修复1: dimensions.push中的对象（第257行附近）
    {
        'old': """        dimensions.push({
          length: Number.parseFloat(sizeMatch[1]) / 10, // mm转cm
          width: Number.parseFloat(sizeMatch[2]) / 10,
          height: Number.parseFloat(sizeMatch[3]) / 10,
          quantity: 1 // 每个包装1件
        });""",
        'new': """        const length = Number.parseFloat(sizeMatch[1]) / 10; // mm转cm
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
    },
    
    # 修复2: result.dimensions = [{...}] 格式1（第465行附近）
    {
        'old': """            result.dimensions = [{
              length: length,
              width: width,
              height: height,
              quantity: 1
            }];""",
        'new': """            const unit = detectDimensionUnit(correctedText, length, width, height);
            result.dimensions = [{
              length: length,
              width: width,
              height: height,
              quantity: 1,
              unit: unit
            }];"""
    },
    
    # 修复3: newDimensions.push中的对象（第664行附近）  
    {
        'old': """        newDimensions.push({
          length: Number.parseFloat(sizeMatch[1]),
          width: Number.parseFloat(sizeMatch[2]),
          height: Number.parseFloat(sizeMatch[3]),
          quantity: Number.parseInt(sizeMatch[4]) || 1
        });""",
        'new': """        const length = Number.parseFloat(sizeMatch[1]);
        const width = Number.parseFloat(sizeMatch[2]);
        const height = Number.parseFloat(sizeMatch[3]);
        const quantity = Number.parseInt(sizeMatch[4]) || 1;
        const unit = detectDimensionUnit(correctedText, length, width, height);
        newDimensions.push({
          length: length,
          width: width,
          height: height,
          quantity: quantity,
          unit: unit
        });"""
    }
]

# 应用修复
for i, fix in enumerate(fixes):
    if fix['old'] in content:
        content = content.replace(fix['old'], fix['new'])
        print(f"✅ 应用了修复 {i+1}")
    else:
        print(f"⚠️  修复 {i+1} 没有找到匹配的文本")

# 写入文件
with open('src/lib/cargo-parser.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("🎉 所有modifications完成！")