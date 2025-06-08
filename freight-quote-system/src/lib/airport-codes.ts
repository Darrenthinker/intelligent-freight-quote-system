// 机场三字代码映射表
export interface AirportInfo {
  chinese: string;
  english: string;
  country: string;
}

export const airportCodes: { [key: string]: AirportInfo } = {
  // 中东地区
  'DOH': { chinese: '多哈', english: 'Doha', country: '卡塔尔' },
  'DXB': { chinese: '迪拜', english: 'Dubai', country: '阿联酋' },
  'AUH': { chinese: '阿布扎比', english: 'Abu Dhabi', country: '阿联酋' },
  'KWI': { chinese: '科威特', english: 'Kuwait', country: '科威特' },
  'BAH': { chinese: '巴林', english: 'Bahrain', country: '巴林' },
  'RUH': { chinese: '利雅得', english: 'Riyadh', country: '沙特阿拉伯' },
  'JED': { chinese: '吉达', english: 'Jeddah', country: '沙特阿拉伯' },
  'MCT': { chinese: '马斯喀特', english: 'Muscat', country: '阿曼' },
  'TLV': { chinese: '特拉维夫', english: 'Tel Aviv', country: '以色列' },
  'AMM': { chinese: '安曼', english: 'Amman', country: '约旦' },
  'BGW': { chinese: '巴格达', english: 'Baghdad', country: '伊拉克' },
  'IKA': { chinese: '德黑兰', english: 'Tehran', country: '伊朗' },

  // 欧洲地区
  'LHR': { chinese: '伦敦', english: 'London Heathrow', country: '英国' },
  'LGW': { chinese: '伦敦盖特威克', english: 'London Gatwick', country: '英国' },
  'STN': { chinese: '伦敦斯坦斯特德', english: 'London Stansted', country: '英国' },
  'CDG': { chinese: '巴黎', english: 'Paris Charles de Gaulle', country: '法国' },
  'ORY': { chinese: '巴黎奥利', english: 'Paris Orly', country: '法国' },
  'FRA': { chinese: '法兰克福', english: 'Frankfurt', country: '德国' },
  'MUC': { chinese: '慕尼黑', english: 'Munich', country: '德国' },
  'DUS': { chinese: '杜塞尔多夫', english: 'Dusseldorf', country: '德国' },
  'HAM': { chinese: '汉堡', english: 'Hamburg', country: '德国' },
  'AMS': { chinese: '阿姆斯特丹', english: 'Amsterdam', country: '荷兰' },
  'FCO': { chinese: '罗马', english: 'Rome Fiumicino', country: '意大利' },
  'MXP': { chinese: '米兰', english: 'Milan Malpensa', country: '意大利' },
  'MAD': { chinese: '马德里', english: 'Madrid', country: '西班牙' },
  'BCN': { chinese: '巴塞罗那', english: 'Barcelona', country: '西班牙' },
  'VIE': { chinese: '维也纳', english: 'Vienna', country: '奥地利' },
  'ZUR': { chinese: '苏黎世', english: 'Zurich', country: '瑞士' },
  'GVA': { chinese: '日内瓦', english: 'Geneva', country: '瑞士' },
  'CPH': { chinese: '哥本哈根', english: 'Copenhagen', country: '丹麦' },
  'ARN': { chinese: '斯德哥尔摩', english: 'Stockholm', country: '瑞典' },
  'OSL': { chinese: '奥斯陆', english: 'Oslo', country: '挪威' },
  'HEL': { chinese: '赫尔辛基', english: 'Helsinki', country: '芬兰' },
  'BRU': { chinese: '布鲁塞尔', english: 'Brussels', country: '比利时' },
  'WAW': { chinese: '华沙', english: 'Warsaw', country: '波兰' },
  'PRG': { chinese: '布拉格', english: 'Prague', country: '捷克' },
  'BUD': { chinese: '布达佩斯', english: 'Budapest', country: '匈牙利' },
  'ATH': { chinese: '雅典', english: 'Athens', country: '希腊' },
  'IST': { chinese: '伊斯坦布尔', english: 'Istanbul', country: '土耳其' },
  'SVO': { chinese: '莫斯科', english: 'Moscow Sheremetyevo', country: '俄罗斯' },
  'DME': { chinese: '莫斯科多莫杰多沃', english: 'Moscow Domodedovo', country: '俄罗斯' },

  // 北美地区
  'LAX': { chinese: '洛杉矶', english: 'Los Angeles', country: '美国' },
  'JFK': { chinese: '纽约肯尼迪', english: 'New York JFK', country: '美国' },
  'LGA': { chinese: '纽约拉瓜迪亚', english: 'New York LaGuardia', country: '美国' },
  'EWR': { chinese: '纽约纽瓦克', english: 'New York Newark', country: '美国' },
  'ORD': { chinese: '芝加哥', english: 'Chicago O\'Hare', country: '美国' },
  'MDW': { chinese: '芝加哥中途', english: 'Chicago Midway', country: '美国' },
  'DFW': { chinese: '达拉斯', english: 'Dallas Fort Worth', country: '美国' },
  'ATL': { chinese: '亚特兰大', english: 'Atlanta', country: '美国' },
  'MIA': { chinese: '迈阿密', english: 'Miami', country: '美国' },
  'SEA': { chinese: '西雅图', english: 'Seattle', country: '美国' },
  'SFO': { chinese: '旧金山', english: 'San Francisco', country: '美国' },
  'LAS': { chinese: '拉斯维加斯', english: 'Las Vegas', country: '美国' },
  'PHX': { chinese: '菲尼克斯', english: 'Phoenix', country: '美国' },
  'DEN': { chinese: '丹佛', english: 'Denver', country: '美国' },
  'BOS': { chinese: '波士顿', english: 'Boston', country: '美国' },
  'IAH': { chinese: '休斯顿', english: 'Houston Intercontinental', country: '美国' },
  'MSP': { chinese: '明尼阿波利斯', english: 'Minneapolis', country: '美国' },
  'DTW': { chinese: '底特律', english: 'Detroit', country: '美国' },
  'CLT': { chinese: '夏洛特', english: 'Charlotte', country: '美国' },
  'BHM': { chinese: '伯明翰', english: 'Birmingham', country: '美国' },
  'YVR': { chinese: '温哥华', english: 'Vancouver', country: '加拿大' },
  'YYZ': { chinese: '多伦多', english: 'Toronto', country: '加拿大' },
  'YUL': { chinese: '蒙特利尔', english: 'Montreal', country: '加拿大' },
  'YYC': { chinese: '卡尔加里', english: 'Calgary', country: '加拿大' },
  'MEX': { chinese: '墨西哥城', english: 'Mexico City', country: '墨西哥' },

  // 亚洲地区
  'NRT': { chinese: '东京成田', english: 'Tokyo Narita', country: '日本' },
  'HND': { chinese: '东京羽田', english: 'Tokyo Haneda', country: '日本' },
  'KIX': { chinese: '大阪关西', english: 'Osaka Kansai', country: '日本' },
  'NGO': { chinese: '名古屋', english: 'Nagoya', country: '日本' },
  'ICN': { chinese: '首尔仁川', english: 'Seoul Incheon', country: '韩国' },
  'GMP': { chinese: '首尔金浦', english: 'Seoul Gimpo', country: '韩国' },
  'PUS': { chinese: '釜山', english: 'Busan', country: '韩国' },
  'BKK': { chinese: '曼谷素万那普', english: 'Bangkok Suvarnabhumi', country: '泰国' },
  'DMK': { chinese: '曼谷廊曼', english: 'Bangkok Don Mueang', country: '泰国' },
  'SIN': { chinese: '新加坡', english: 'Singapore', country: '新加坡' },
  'KUL': { chinese: '吉隆坡', english: 'Kuala Lumpur', country: '马来西亚' },
  'CGK': { chinese: '雅加达', english: 'Jakarta', country: '印尼' },
  'MNL': { chinese: '马尼拉', english: 'Manila', country: '菲律宾' },
  'HKG': { chinese: '香港', english: 'Hong Kong', country: '香港' },
  'TPE': { chinese: '台北桃园', english: 'Taipei Taoyuan', country: '台湾' },
  'TSA': { chinese: '台北松山', english: 'Taipei Songshan', country: '台湾' },
  'KHH': { chinese: '高雄', english: 'Kaohsiung', country: '台湾' },
  'MFM': { chinese: '澳门', english: 'Macau', country: '澳门' },
  'BOM': { chinese: '孟买', english: 'Mumbai', country: '印度' },
  'DEL': { chinese: '新德里', english: 'New Delhi', country: '印度' },
  'BLR': { chinese: '班加罗尔', english: 'Bangalore', country: '印度' },
  'MAA': { chinese: '金奈', english: 'Chennai', country: '印度' },
  'HYD': { chinese: '海得拉巴', english: 'Hyderabad', country: '印度' },
  'CCU': { chinese: '加尔各答', english: 'Kolkata', country: '印度' },
  'CMB': { chinese: '科伦坡', english: 'Colombo', country: '斯里兰卡' },
  'DAC': { chinese: '达卡', english: 'Dhaka', country: '孟加拉国' },
  'KTM': { chinese: '加德满都', english: 'Kathmandu', country: '尼泊尔' },
  'KHI': { chinese: '卡拉奇', english: 'Karachi', country: '巴基斯坦' },
  'RGN': { chinese: '仰光', english: 'Yangon', country: '缅甸' },
  'VTE': { chinese: '万象', english: 'Vientiane', country: '老挝' },
  'PNH': { chinese: '金边', english: 'Phnom Penh', country: '柬埔寨' },
  'SGN': { chinese: '胡志明市', english: 'Ho Chi Minh City', country: '越南' },
  'HAN': { chinese: '河内', english: 'Hanoi', country: '越南' },

  // 中国大陆机场
  'PEK': { chinese: '北京首都', english: 'Beijing Capital', country: '中国' },
  'PKX': { chinese: '北京大兴', english: 'Beijing Daxing', country: '中国' },
  'PVG': { chinese: '上海浦东', english: 'Shanghai Pudong', country: '中国' },
  'SHA': { chinese: '上海虹桥', english: 'Shanghai Hongqiao', country: '中国' },
  'CAN': { chinese: '广州', english: 'Guangzhou', country: '中国' },
  'SZX': { chinese: '深圳', english: 'Shenzhen', country: '中国' },
  'CTU': { chinese: '成都', english: 'Chengdu', country: '中国' },
  'KMG': { chinese: '昆明', english: 'Kunming', country: '中国' },
  'XIY': { chinese: '西安', english: 'Xi\'an', country: '中国' },
  'WUH': { chinese: '武汉', english: 'Wuhan', country: '中国' },
  'CSX': { chinese: '长沙', english: 'Changsha', country: '中国' },
  'NKG': { chinese: '南京', english: 'Nanjing', country: '中国' },
  'HGH': { chinese: '杭州', english: 'Hangzhou', country: '中国' },
  'FOC': { chinese: '福州', english: 'Fuzhou', country: '中国' },
  'XMN': { chinese: '厦门', english: 'Xiamen', country: '中国' },
  'NNG': { chinese: '南宁', english: 'Nanning', country: '中国' },
  'HAK': { chinese: '海口', english: 'Haikou', country: '中国' },
  'SYX': { chinese: '三亚', english: 'Sanya', country: '中国' },
  'URC': { chinese: '乌鲁木齐', english: 'Urumqi', country: '中国' },
  'LHW': { chinese: '兰州', english: 'Lanzhou', country: '中国' },
  'INC': { chinese: '银川', english: 'Yinchuan', country: '中国' },
  'XNN': { chinese: '西宁', english: 'Xining', country: '中国' },
  'TSN': { chinese: '天津', english: 'Tianjin', country: '中国' },
  'SJW': { chinese: '石家庄', english: 'Shijiazhuang', country: '中国' },
  'TYN': { chinese: '太原', english: 'Taiyuan', country: '中国' },
  'HET': { chinese: '呼和浩特', english: 'Hohhot', country: '中国' },
  'SHE': { chinese: '沈阳', english: 'Shenyang', country: '中国' },
  'DLC': { chinese: '大连', english: 'Dalian', country: '中国' },
  'CGQ': { chinese: '长春', english: 'Changchun', country: '中国' },
  'HRB': { chinese: '哈尔滨', english: 'Harbin', country: '中国' },

  // 澳洲地区
  'SYD': { chinese: '悉尼', english: 'Sydney', country: '澳大利亚' },
  'MEL': { chinese: '墨尔本', english: 'Melbourne', country: '澳大利亚' },
  'BNE': { chinese: '布里斯班', english: 'Brisbane', country: '澳大利亚' },
  'PER': { chinese: '珀斯', english: 'Perth', country: '澳大利亚' },
  'ADL': { chinese: '阿德莱德', english: 'Adelaide', country: '澳大利亚' },
  'DRW': { chinese: '达尔文', english: 'Darwin', country: '澳大利亚' },
  'CNS': { chinese: '凯恩斯', english: 'Cairns', country: '澳大利亚' },
  'AKL': { chinese: '奥克兰', english: 'Auckland', country: '新西兰' },
  'CHC': { chinese: '基督城', english: 'Christchurch', country: '新西兰' },
  'WLG': { chinese: '惠灵顿', english: 'Wellington', country: '新西兰' },

  // 非洲地区
  'CAI': { chinese: '开罗', english: 'Cairo', country: '埃及' },
  'JNB': { chinese: '约翰内斯堡', english: 'Johannesburg', country: '南非' },
  'CPT': { chinese: '开普敦', english: 'Cape Town', country: '南非' },
  'DUR': { chinese: '德班', english: 'Durban', country: '南非' },
  'ADD': { chinese: '亚的斯亚贝巴', english: 'Addis Ababa', country: '埃塞俄比亚' },
  'LOS': { chinese: '拉各斯', english: 'Lagos', country: '尼日利亚' },
  'ABV': { chinese: '阿布贾', english: 'Abuja', country: '尼日利亚' },
  'ACC': { chinese: '阿克拉', english: 'Accra', country: '加纳' },
  'CAS': { chinese: '卡萨布兰卡', english: 'Casablanca', country: '摩洛哥' },
  'TUN': { chinese: '突尼斯', english: 'Tunis', country: '突尼斯' },
  'ALG': { chinese: '阿尔及尔', english: 'Algiers', country: '阿尔及利亚' },
  'NBO': { chinese: '内罗毕', english: 'Nairobi', country: '肯尼亚' },
  'DAR': { chinese: '达累斯萨拉姆', english: 'Dar es Salaam', country: '坦桑尼亚' },
  'KGL': { chinese: '基加利', english: 'Kigali', country: '卢旺达' },
  'EBB': { chinese: '恩德培', english: 'Entebbe', country: '乌干达' },

  // 南美地区
  'GRU': { chinese: '圣保罗', english: 'Sao Paulo Guarulhos', country: '巴西' },
  'GIG': { chinese: '里约热内卢', english: 'Rio de Janeiro', country: '巴西' },
  'BSB': { chinese: '巴西利亚', english: 'Brasilia', country: '巴西' },
  'FOR': { chinese: '福塔莱萨', english: 'Fortaleza', country: '巴西' },
  'VCP': { chinese: '坎皮纳斯', english: 'Campinas Viracopos', country: '巴西' },
  'CNF': { chinese: '贝洛奥里藏特', english: 'Belo Horizonte', country: '巴西' },
  'REC': { chinese: '累西腓', english: 'Recife', country: '巴西' },
  'SSA': { chinese: '萨尔瓦多', english: 'Salvador', country: '巴西' },
  'BOG': { chinese: '波哥大', english: 'Bogota', country: '哥伦比亚' },
  'LIM': { chinese: '利马', english: 'Lima', country: '秘鲁' },
  'SCL': { chinese: '圣地亚哥', english: 'Santiago', country: '智利' },
  'EZE': { chinese: '布宜诺斯艾利斯', english: 'Buenos Aires Ezeiza', country: '阿根廷' },
  'CCS': { chinese: '加拉加斯', english: 'Caracas', country: '委内瑞拉' },
  'UIO': { chinese: '基多', english: 'Quito', country: '厄瓜多尔' },
  'GYE': { chinese: '瓜亚基尔', english: 'Guayaquil', country: '厄瓜多尔' },
  'LPB': { chinese: '拉巴斯', english: 'La Paz', country: '玻利维亚' },
  'ASU': { chinese: '亚松森', english: 'Asuncion', country: '巴拉圭' },
  'MVD': { chinese: '蒙得维的亚', english: 'Montevideo', country: '乌拉圭' }
};

// 根据机场代码获取城市名称
export function getAirportCity(code: string): string | null {
  const upperCode = code.toUpperCase();
  const airport = airportCodes[upperCode];
  return airport ? airport.chinese : null;
}

// 根据机场代码获取完整信息
export function getAirportInfo(code: string): AirportInfo | null {
  const upperCode = code.toUpperCase();
  return airportCodes[upperCode] || null;
}

// 格式化机场显示 - 返回 "DOH,多哈,Doha" 格式
export function formatAirportDisplay(code: string): string {
  const upperCode = code.toUpperCase();
  const airport = airportCodes[upperCode];
  if (airport) {
    return `${upperCode},${airport.chinese},${airport.english}`;
  }
  return upperCode;
}
