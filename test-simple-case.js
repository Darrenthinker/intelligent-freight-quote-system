// 简单测试各个组件的解析

import { parseCargoText } from './src/lib/cargo-parser.ts';

console.log('🧪 测试米单位样例的各部分解析:');

// 测试分解
const testData1 = `重量：23托 重量:9765 KGS
尺寸：1.2*1.0*1.54m
体积：42 CBM`;

console.log('原始数据:', testData1);

const result = parseCargoText(testData1);
console.log('\n解析结果:');
console.log('- 重量:', result.weight);
console.log('- 托盘数:', result.pallets);
console.log('- 件数:', result.pieces);
console.log('- 体积:', result.volume);
console.log('- 尺寸明细:', result.dimensions);
console.log('- 包装类型:', result.packageType);

// 测试简化版本
console.log('\n='.repeat(40));
console.log('🧪 测试简化版本:');

const simpleTest = `23托 9765 KG 1.2*1.0*1.54m`;
const simpleResult = parseCargoText(simpleTest);
console.log('简化数据:', simpleTest);
console.log('简化解析结果:');
console.log('- 重量:', simpleResult.weight);
console.log('- 托盘数:', simpleResult.pallets);
console.log('- 尺寸明细:', simpleResult.dimensions);

// 测试更简化版本
console.log('\n='.repeat(40));
console.log('🧪 测试更简化版本:');

const verySimpleTest = `23托/9765KG/42CBM`;
const verySimpleResult = parseCargoText(verySimpleTest);
console.log('更简化数据:', verySimpleTest);
console.log('更简化解析结果:');
console.log('- 重量:', verySimpleResult.weight);
console.log('- 托盘数:', verySimpleResult.pallets);
console.log('- 体积:', verySimpleResult.volume);
console.log('- 件数:', verySimpleResult.pieces);
console.log('- 包装类型:', verySimpleResult.packageType);
