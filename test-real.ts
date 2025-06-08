import { parseCargoText } from './src/lib/cargo-parser.ts';

const testData = `WAW设备及配件
2500 kgs ; 14.71 cbm ; 6托
货在广州
120x100x65 cm`;

console.log('🚀 使用实际parseCargoText函数测试');
console.log('测试数据:', testData);
console.log('');

const result = parseCargoText(testData);
console.log('解析结果:');
console.log('产品名称:', result.name);
console.log('重量:', result.weight, 'kg');
console.log('体积:', result.volume, 'cbm');
console.log('托盘数:', result.pallets, '托');
console.log('起运地:', result.origin);
console.log('目的地:', result.destination);

console.log('');
console.log('验证结果:');
console.log('产品名称正确:', result.name === 'WAW设备及配件');
console.log('重量正确:', result.weight === 2500);
console.log('体积正确:', result.volume === 14.71);
console.log('托盘数正确:', result.pallets === 6);
console.log('起运地正确:', result.origin === '广州');

// 详细输出结果对象
console.log('\n完整结果对象:');
console.log(JSON.stringify(result, null, 2));