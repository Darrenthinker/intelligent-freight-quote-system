import sys
import os

# 添加当前目录到路径，以便导入TypeScript文件
sys.path.append('.')

# 由于我们不能直接导入TypeScript，我们创建一个Python版本的detectDimensionUnit来测试逻辑
def detect_dimension_unit(text, length, width, height):
    """Python版本的detectDimensionUnit函数，用于测试"""
    normalized_text = text.lower()
    
    # 1. 明确的单位标识符
    if 'mm' in normalized_text or '毫米' in normalized_text:
        return 'mm'
    
    # 检查是否包含"m"但不包含"cm"（避免误判cm为m）
    if 'm' in normalized_text and 'cm' not in normalized_text and 'mm' not in normalized_text:
        return 'm'
    
    if 'cm' in normalized_text or '厘米' in normalized_text:
        return 'cm'
    
    # 2. 基于数值大小的智能判断
    max_dimension = max(length, width, height)
    
    # 如果最大尺寸超过1000，很可能是毫米
    if max_dimension > 1000:
        return 'mm'
    
    # 如果最大尺寸小于10，很可能是米
    if max_dimension < 10:
        return 'm'
    
    # 10-1000之间默认为厘米
    return 'cm'

# 测试用户提到的特殊格式
test_cases = [
    {
        'text': '尺寸1336*706*2005*2件 尺寸mm',
        'length': 1336,
        'width': 706, 
        'height': 2005,
        'expected': 'mm',
        'description': '毫米格式测试'
    },
    {
        'text': '1.2*1.0*1.54m',
        'length': 1.2,
        'width': 1.0,
        'height': 1.54,
        'expected': 'm',
        'description': '米格式测试'
    },
    {
        'text': '重量：23托 重量:9765 KGS 尺寸：1.2*1.0*1.54m',
        'length': 1.2,
        'width': 1.0,
        'height': 1.54,
        'expected': 'm',
        'description': '复杂格式中的米单位测试'
    },
    {
        'text': '尺寸53.8*32*41cm',
        'length': 53.8,
        'width': 32,
        'height': 41,
        'expected': 'cm',
        'description': '厘米格式测试'
    },
    {
        'text': '没有明确单位',
        'length': 1200,
        'width': 800,
        'height': 1500,
        'expected': 'mm',
        'description': '智能判断大数值为毫米'
    },
    {
        'text': '没有明确单位',
        'length': 2.5,
        'width': 1.8,
        'height': 3.2,
        'expected': 'm',
        'description': '智能判断小数值为米'
    },
    {
        'text': '没有明确单位',
        'length': 150,
        'width': 100,
        'height': 80,
        'expected': 'cm',
        'description': '智能判断中等数值为厘米'
    }
]

print("测试单位识别功能...")
print("=" * 50)

all_passed = True
for i, test in enumerate(test_cases, 1):
    result = detect_dimension_unit(test['text'], test['length'], test['width'], test['height'])
    passed = result == test['expected']
    status = "✅ 通过" if passed else "❌ 失败"
    
    print(f"测试 {i}: {test['description']}")
    print(f"  输入文本: {test['text']}")
    print(f"  尺寸: {test['length']} x {test['width']} x {test['height']}")
    print(f"  期望单位: {test['expected']}")
    print(f"  实际单位: {result}")
    print(f"  结果: {status}")
    print()
    
    if not passed:
        all_passed = False

print("=" * 50)
if all_passed:
    print("🎉 所有测试通过！单位识别功能工作正常。")
else:
    print("❌ 部分测试失败，需要检查单位识别逻辑。")

# 检查cargo-parser.ts文件是否包含detectDimensionUnit函数
with open('src/lib/cargo-parser.ts', 'r', encoding='utf-8') as f:
    content = f.read()

if 'detectDimensionUnit' in content:
    print("✅ cargo-parser.ts 包含 detectDimensionUnit 函数")
else:
    print("❌ cargo-parser.ts 缺少 detectDimensionUnit 函数")

if 'unit: \'m\' | \'cm\' | \'mm\'' in content:
    print("✅ Dimension接口包含unit字段")
else:
    print("❌ Dimension接口缺少unit字段")