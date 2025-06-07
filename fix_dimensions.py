import re

# 读取文件
with open('src/lib/cargo-parser.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 修改Dimension接口
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

# 添加单位识别函数
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

# 写入文件
with open('src/lib/cargo-parser.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("修改完成：添加了unit字段和智能单位识别函数")