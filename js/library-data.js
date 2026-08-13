/**
 * 知识库模块：种子数据 + icon 库
 * 数据完全自包含在 localStorage 命名空间 sr_library_*
 */

const LIB_Icon = {
  book:      '<svg class="icon" viewBox="0 0 20 20"><path d="M4 3h5a1.5 1.5 0 011.5 1.5v13a1 1 0 00-1-1H4z"/><path d="M16 3h-5a1.5 1.5 0 00-1.5 1.5v13a1 1 0 011-1H16z"/></svg>',
  paper:     '<svg class="icon" viewBox="0 0 20 20"><rect x="4" y="3" width="12" height="14" rx="1"/><path d="M7 7h6M7 10h6M7 13h4"/></svg>',
  mindmap:   '<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="4" r="2"/><circle cx="5" cy="18" r="1.6"/><circle cx="12" cy="20" r="1.6"/><circle cx="19" cy="18" r="1.6"/><path d="M12 6v3M12 9l-7 9M12 9v11M12 9l7 9"/></svg>',
  guide:     '<svg class="icon" viewBox="0 0 24 24"><path d="M4 5l8-2 8 2v14l-8 3-8-3z"/><path d="M4 5l8 2 8-2M12 7v14"/></svg>',
  essence:   '<svg class="icon" viewBox="0 0 24 24"><path d="M5 4l2 7h10l2-7M7 11v9l3-2 2 2 2-2 3 2v-9"/></svg>',
  resonance: '<svg class="icon" viewBox="0 0 24 24"><path d="M12 21s-7-4.5-7-11a4 4 0 017-2.6A4 4 0 0119 10c0 6.5-7 11-7 11z"/></svg>',
  ai:        '<svg class="icon" viewBox="0 0 24 24"><path d="M12 3l2 4 4 .6-3 3 .7 4.4L12 13l-3.7 2 .7-4.4-3-3L10 7z"/></svg>',
  mic:       '<svg class="icon" viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v3"/></svg>',
  edit:      '<svg class="icon" viewBox="0 0 20 20"><path d="M4 16h3l9-9-3-3-9 9z"/><path d="M12 5l3 3"/></svg>',
  trash:     '<svg class="icon" viewBox="0 0 20 20"><path d="M4 6h12M7 6V4h6v2M6 6l1 11h6l1-11"/></svg>',
  check:     '<svg class="icon" viewBox="0 0 20 20"><path d="M4 10l4 4 8-9"/></svg>',
  upload:    '<svg class="icon" viewBox="0 0 20 20"><path d="M10 13V3M5 8l5-5 5 5M3 17h14"/></svg>',
  plus:      '<svg class="icon" viewBox="0 0 16 16"><path d="M8 3v10M3 8h10"/></svg>',
  coverPlaceholder: '<svg class="icon" viewBox="0 0 60 80" stroke="rgba(255,255,255,0.85)"><path d="M10 8h6.5a2 2 0 012 2V72a1 1 0 00-1-1H10z"/><path d="M50 8h-6.5a2 2 0 00-2 2V72a1 1 0 011-1H50z"/></svg>',
  link:      '<svg class="icon" viewBox="0 0 16 16"><path d="M7 9.5L9 7.5M6 6l1-1a3 3 0 014.2 0l1.3 1.3a3 3 0 010 4.2l-1 1M10 10l-1 1a3 3 0 01-4.2 0L3.5 9.7a3 3 0 010-4.2l1-1"/></svg>',
  bookmark:  '<svg class="icon" viewBox="0 0 16 16"><path d="M4 2h8v12l-4-2.5L4 14z"/></svg>',
  domHumanity:   '<svg class="icon" viewBox="0 0 16 16"><path d="M8 2a3 3 0 00-3 3 3 3 0 001 2.2 4 4 0 00-2 3.4c0 1.5.8 2.6 2 3v1.4h4V13.6c1.2-.4 2-1.5 2-3a4 4 0 00-2-3.4A3 3 0 0011 5a3 3 0 00-3-3z"/></svg>',
  domEconomy:    '<svg class="icon" viewBox="0 0 16 16"><path d="M2 13h12M3 11l3-4 3 3 4-6"/></svg>',
  domScience:    '<svg class="icon" viewBox="0 0 16 16"><path d="M6 2h4M7 2v4l-3 7a1.5 1.5 0 001.4 2h5.2a1.5 1.5 0 001.4-2L9 6V2M5 9h6"/></svg>',
  domHistory:    '<svg class="icon" viewBox="0 0 16 16"><path d="M3 13V5h10v8M5 5V3h6v2M5 13v-2M11 13v-2"/></svg>',
  domData:       '<svg class="icon" viewBox="0 0 16 16"><path d="M3 13h10M4 13V9M7 13V5M10 13V7M13 13V3"/></svg>',
  domPhilosophy: '<svg class="icon" viewBox="0 0 16 16"><path d="M6 2a3 3 0 00-3 3 3 3 0 001.5 2.5V9a2 2 0 002 2h3a2 2 0 002-2V7.5A3 3 0 0011 2a3 3 0 00-2.5 1.3A3 3 0 006 2zM7 11h2v3H7z"/></svg>',
  star:       '<svg class="icon" viewBox="0 0 16 16"><path d="M8 2l1.8 4 4.2.5-3.2 2.9.9 4.2L8 11.4 4.3 13.6l.9-4.2L2 6.5l4.2-.5z"/></svg>',
  spark:      '<svg class="icon" viewBox="0 0 16 16"><path d="M8 2v4M8 10v4M2 8h4M10 8h4M4 4l2.5 2.5M9.5 9.5L12 12M12 4l-2.5 2.5M6.5 9.5L4 12"/></svg>',
  question:   '<svg class="icon" viewBox="0 0 16 16"><path d="M5.5 6a2.5 2.5 0 015 0c0 1.5-2.5 2-2.5 4M8 13.5v.5"/></svg>',
  target:     '<svg class="icon" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6"/><circle cx="8" cy="8" r="3"/><circle cx="8" cy="8" r="0.8"/></svg>',
  bulb:       '<svg class="icon" viewBox="0 0 16 16"><path d="M5 13h6M6 11h4M5.5 11a3 3 0 01-1-5.7A3 3 0 018 3a3 3 0 013.5 2.3 3 3 0 01-1 5.7"/></svg>',
  chat:       '<svg class="icon" viewBox="0 0 16 16"><path d="M3 4h10v6H7l-3 3v-3H3z"/></svg>',
  folder:     '<svg class="icon" viewBox="0 0 16 16"><path d="M2 4h4l1.5 1.5H14V13H2z"/></svg>',
  beaker:     '<svg class="icon" viewBox="0 0 16 16"><path d="M5 2h6M6 2v4l-3 6a1.5 1.5 0 001.4 2h5.2a1.5 1.5 0 001.4-2L8 6V2"/></svg>',
};

const LIB_DOMAINS = [
  { id: 'humanity',   name: '人性与心理学', color: 'coral',   icon: LIB_Icon.domHumanity },
  { id: 'economy',    name: '经济与商业',   color: 'amber',   icon: LIB_Icon.domEconomy },
  { id: 'science',    name: '科学与技术',   color: 'emerald', icon: LIB_Icon.domScience },
  { id: 'history',    name: '历史与文明',   color: 'blue',    icon: LIB_Icon.domHistory },
  { id: 'data',       name: '数据与世界',   color: 'olive',   icon: LIB_Icon.domData },
  { id: 'philosophy', name: '哲学与思维',   color: 'rose',    icon: LIB_Icon.domPhilosophy }
];
const LIB_DIFF_MAP = {
  easy: { label: '入门', cls: 'tag-diff-easy' },
  medium: { label: '进阶', cls: 'tag-diff-medium' },
  hard: { label: '精深', cls: 'tag-diff-hard' }
};
const LIB_STATUS_MAP = { want: '想读', reading: '在读', done: '已读', none: '未读' };
const LIB_STATUS_CLS = { want: 'tag-status-want', reading: 'tag-status-reading', done: 'tag-status-done' };

const LIB_SEED_BOOKS = [
  { id: 'b10', domain: 'economy', title: '小狗钱钱', author: '博多·舍费尔', difficulty: 'easy',
    cover: null,
    mindmap: { root: '小狗钱钱', children: [
      { label: '金钱观重塑', children: [
        { label: '写下 10 个想变富有的理由' },
        { label: '梦想相册与梦想储蓄罐' },
        { label: '72 小时法则：决定立即做' }
      ]},
      { label: '赚钱之道', children: [
        { label: '为别人解决一个问题' },
        { label: '集中精力于你知道的、能做的、拥有的' },
        { label: '每天写成功日记' }
      ]},
      { label: '资金分配原则', children: [
        { label: '50% 养"鹅"（储蓄投资）' },
        { label: '40% 梦想基金' },
        { label: '10% 日常消费' }
      ]},
      { label: '投资入门', children: [
        { label: '基金定投 · 长期持有' },
        { label: '不追涨杀跌 · 让时间复利' }
      ]}
    ]},
    guide: {
      why: '掌握经济运行规律与商业底层逻辑，构建理性的投资与决策框架——一本写给孩子的理财入门，同样适合作为成年人重塑金钱观的第一本书。',
      questions: [
        '"梦想相册"的心理学原理是什么？为什么可视化愿望有效？',
        '钱钱的资金分配原则（50/40/10）为什么适合初学者？你会如何调整？',
        '"把精力集中在你知道的和你拥有的"——为什么做自己擅长的事更容易赚钱？',
        '什么是"会下金蛋的鹅"？你的"鹅"养得怎么样了？',
        '为什么这本书虽是写给孩子的理财书，成年人读了同样受益？',
        '书中哪些理财观念在当下的中国仍然适用，哪些需要调整？'
      ],
      core: ['金钱观重塑', '赚钱之道', '资金分配原则', '投资入门'],
      difficulty: '入门',
      difficultyDesc: '通俗易懂，适合初次接触理财的读者'
    }
  },
  { id: 'b2', domain: 'humanity', title: '影响力', author: '罗伯特·西奥迪尼', difficulty: 'easy',
    cover: null,
    mindmap: { root: '影响力', children: [
      { label: '互惠原则', children: [
        { label: '先给后要的小恩惠' },
        { label: '拒绝—退回策略' },
        { label: '超出预期的礼物' }
      ]},
      { label: '承诺一致', children: [
        { label: '书面承诺的力量' },
        { label: '由小到大的一致性' }
      ]},
      { label: '社会认同', children: [
        { label: '不确定时看他人' },
        { label: '相似性效应' }
      ]},
      { label: '稀缺', children: [
        { label: '物以稀为贵' },
        { label: '时间限制制造紧迫感' }
      ]}
    ]},
    guide: {
      why: '识别生活中无处不在的说服术——既避免被推销员、广告、媒体操纵，也学会以合乎道德的方式影响他人。理解"为什么我会点头"的潜意识机制，是当代成年人必学的元认知。',
      questions: [
        '六大影响力原则分别触发什么心理机制？为什么能在潜意识层面生效？',
        '稀缺感为何能让人冲动消费？限时优惠中"损失厌恶"如何被利用？',
        '"先给后要"为什么能在商业、社交、亲密关系中反复奏效？背后有怎样的进化基础？',
        '商家常用哪种"权威"暗示让你买单？头衔、白大褂、专家推荐各有什么陷阱？',
        '当你不确定时，社会认同如何让你做出原本不会做的选择？',
        '怎样在不被操纵的前提下，把这些原则用于正当的影响力建设？'
      ],
      core: ['六大影响力原则', '自动反应模式', '对比原理', '进化心理基础'],
      difficulty: '入门',
      difficultyDesc: '通俗易懂，案例丰富，无需心理学基础'
    }
  },
  { id: 'b1', domain: 'philosophy', title: '思考，快与慢', author: '丹尼尔·卡尼曼', difficulty: 'hard',
    cover: null,
    mindmap: { root: '思考，快与慢', children: [
      { label: '系统 1 · 快思考', children: [
        { label: '直觉与启发式' },
        { label: '认知偏差池' },
        { label: '联想与模式识别' }
      ]},
      { label: '系统 2 · 慢思考', children: [
        { label: '理性与专注' },
        { label: '自我损耗' },
        { label: '惰性思维：不愿启动' }
      ]},
      { label: '两个自我', children: [
        { label: '经验自我（当下感受）' },
        { label: '记忆自我（事后叙事）' },
        { label: '峰终定律' }
      ]},
      { label: '决策心理学', children: [
        { label: '前景理论' },
        { label: '锚定效应' },
        { label: '框架效应' }
      ]}
    ]},
    guide: {
      why: '理解人类决策的非理性本质，看清自己思维中的系统偏差，培养独立判断的能力。诺奖得主卡尼曼以学术级的严谨，把日常生活中"为什么我会这样选"讲清楚——这是理性人必读。',
      questions: [
        '直觉在什么情况下会系统性地出错？什么样的环境对直觉友好，什么对直觉有害？',
        '如何用"慢思考"修正"快思考"的偏差？什么时候该主动启动系统 2？',
        '前景理论如何解释"损失厌恶"？为什么人亏损时更冒险，盈利时反而保守？',
        '"峰终定律"如何重新定义我们对幸福的记忆？',
        '"锚定效应"如何操控我们的决策？我们怎样摆脱它？',
        '为什么"经验自我"和"记忆自我"对幸福的判断经常不一致？'
      ],
      core: ['双系统理论', '启发式与偏差', '前景理论', '峰终定律', '锚定效应'],
      difficulty: '精深',
      difficultyDesc: '需一定心理学基础，建议慢读消化'
    }
  },
  { id: 'b3', domain: 'history', title: '人类简史', author: '尤瓦尔·赫拉利', difficulty: 'medium',
    cover: null,
    mindmap: { root: '人类简史', children: [
      { label: '认知革命', children: [
        { label: '7 万年前的语言突变' },
        { label: '虚构故事的力量' },
        { label: '"想象的共同体"' }
      ]},
      { label: '农业革命', children: [
        { label: '"小麦驯化人类"' },
        { label: '是进步还是陷阱？' },
        { label: '聚落、分工与私有制' }
      ]},
      { label: '科学革命', children: [
        { label: '承认无知' },
        { label: '科学-帝国-资本的合谋' },
        { label: '信贷与信任' }
      ]},
      { label: '智人的未来', children: [
        { label: '幸福是否在进步' },
        { label: '"神性"：从智人到智神' },
        { label: 'AI 与生物工程' }
      ]}
    ]},
    guide: {
      why: '从一个更长的尺度理解人类文明的演进逻辑与虚构的力量——看清那些"理所当然"的制度（国家、金钱、公司、人权）如何被构建，又如何塑造了今天的你我。',
      questions: [
        '为什么说"讲故事"是智人统治地球的关键？虚构能力如何改变了人类协作？',
        '农业革命是进步还是陷阱？从个体幸福的角度看，我们的祖先比狩猎采集者更快乐吗？',
        '为什么现代科学能在欧洲率先突破？"承认无知"为什么是革命性的？',
        '"想象的共同体"如何在民族国家、跨国公司中运作？',
        '智人的终极未来是"神性"还是"AI 取代"？赫拉利担忧的是什么？',
        '现代人比古人更幸福吗？我们被什么绑住了？'
      ],
      core: ['认知革命', '想象的共同体', '农业革命的悖论', '科学革命', '幸福的悖论'],
      difficulty: '进阶',
      difficultyDesc: '通俗写作，但信息密度高，需耐心消化部分观点'
    }
  },
  { id: 'b4', domain: 'economy', title: '经济学原理', author: 'N·格里高利·曼昆', difficulty: 'easy',
    cover: null,
    mindmap: { root: '经济学原理', children: [
      { label: '微观经济学', children: [
        { label: '供给与需求' },
        { label: '弹性' },
        { label: '消费者行为' },
        { label: '市场福利' }
      ]},
      { label: '宏观经济学', children: [
        { label: 'GDP 与国民收入' },
        { label: '货币与物价' },
        { label: '失业与通胀' }
      ]},
      { label: '市场失灵', children: [
        { label: '外部性' },
        { label: '公共物品' },
        { label: '信息不对称' }
      ]},
      { label: '思维方式', children: [
        { label: '机会成本' },
        { label: '比较优势' },
        { label: '激励与权衡' }
      ]}
    ]},
    guide: {
      why: '建立经济学底层思维框架，理解资源配置与激励——看新闻、做决策、理解国家政策必备的"经济学眼镜"。曼昆以十大原理贯穿全书，文字清晰，案例丰富。',
      questions: [
        '十大经济学原理中哪条最反直觉？你过去哪些决策违背了它？',
        '价格如何调节供需平衡？当油价上涨时，市场怎么反应？',
        '"机会成本"如何重塑你对时间、金钱、关系的选择？',
        '"比较优势"为什么让贸易双赢？个人和国家的逻辑一样吗？',
        '为什么有外部性的市场会失灵？环境污染与公共物品如何治理？'
      ],
      core: ['十大经济学原理', '供需模型', '机会成本', '比较优势', '外部性'],
      difficulty: '入门',
      difficultyDesc: '数学要求低，案例丰富，可作为经济学入门砖'
    }
  },
  { id: 'b5', domain: 'history', title: '枪炮、病菌与钢铁', author: '贾雷德·戴蒙德', difficulty: 'hard',
    cover: null,
    mindmap: { root: '枪炮、病菌与钢铁', children: [
      { label: '地理决定论', children: [
        { label: '大陆轴线走向' },
        { label: '可驯化物种分布' },
        { label: '东西方的不对称' }
      ]},
      { label: '农业起源', children: [
        { label: '新月沃地' },
        { label: '粮食与人口' },
        { label: '定居、文字与国家' }
      ]},
      { label: '技术扩散', children: [
        { label: '邻近族群传播' },
        { label: '人口密度与创新' }
      ]},
      { label: '病菌与征服', children: [
        { label: '旧大陆病菌优势' },
        { label: '哥伦布大交换' },
        { label: '天花与美洲文明' }
      ]}
    ]},
    guide: {
      why: '追问文明发展不平衡的终极原因，跳出种族主义解释，理解地理与生态如何塑造历史。从一个问题展开："为什么是欧洲征服美洲，而不是反过来？"',
      questions: [
        '为什么欧亚大陆率先发展出文明？大陆轴线的走向决定了什么？',
        '可驯化的动植物分布如何影响各大陆的农业起源？',
        '病菌为何成为欧洲人的"秘密武器"？人口稠密与免疫力的关系？',
        '为什么中国没能走向工业革命？李约瑟之问的地理视角？',
        '"地理决定论"是否忽视了人的能动性？如何看待技术与制度？'
      ],
      core: ['地理决定论', '农业起源', '大陆轴线', '病菌传播', '哥伦布大交换'],
      difficulty: '精深',
      difficultyDesc: '信息密集，需要一定历史与地理基础'
    }
  },
  { id: 'b6', domain: 'economy', title: '置身事内', author: '兰小欢', difficulty: 'medium',
    cover: null,
    mindmap: { root: '置身事内', children: [
      { label: '地方政府的权力', children: [
        { label: '财政分权' },
        { label: '招商引资' },
        { label: '城投平台' }
      ]},
      { label: '土地财政', children: [
        { label: '招拍挂制度' },
        { label: '土地金融化' },
        { label: '房价机制' }
      ]},
      { label: '宏观现象', children: [
        { label: '城市化路径' },
        { label: '债务风险' },
        { label: '中美贸易' }
      ]},
      { label: '改革与展望', children: [
        { label: '户籍制度' },
        { label: '共同富裕' },
        { label: '经济转型' }
      ]}
    ]},
    guide: {
      why: '理解中国经济运行的底层逻辑与政府行为的激励——为什么房价这么高？地方政府为什么"卷"？债务从哪里来？这本书是理解当代中国最重要的非学术入门书。',
      questions: [
        '"土地财政"如何塑造了中国的城市化与高房价？',
        '地方官员的"晋升锦标赛"带来了什么利弊？',
        '招商引资的逻辑是什么？为什么"开发区"模式被广泛复制？',
        '地方债务的风险在哪里？中央与地方的博弈如何演变？',
        '中美贸易冲突的深层逻辑是什么？这本书给出怎样的视角？'
      ],
      core: ['土地财政', '地方竞争', '城投债', '城市化', '招商引资'],
      difficulty: '进阶',
      difficultyDesc: '需要一定经济学常识，关注时政事半功倍'
    }
  },
  { id: 'b7', domain: 'science', title: '代码大全', author: '史蒂夫·麦康奈尔', difficulty: 'medium',
    cover: null,
    mindmap: { root: '代码大全', children: [
      { label: '前期准备', children: [
        { label: '问题定义' },
        { label: '需求分析' },
        { label: '架构设计' }
      ]},
      { label: '高质量代码', children: [
        { label: '子程序设计' },
        { label: '防御式编程' },
        { label: '可读性' }
      ]},
      { label: '变量与语句', children: [
        { label: '命名规范' },
        { label: '使用频率' },
        { label: '组织直线代码' }
      ]},
      { label: '质量保障', children: [
        { label: '单元测试' },
        { label: '重构' },
        { label: '代码审查' }
      ]}
    ]},
    guide: {
      why: '建立软件工程的系统方法论，写出高质量、可维护的代码。数百个具体可落地的"应该这样写"的建议——工程师人手一本的案头书。',
      questions: [
        '前期准备的哪一步最被低估？"需求模糊"带来哪些代价？',
        '如何设计可维护的子程序？一个好的子程序长什么样？',
        '"防御式编程"如何平衡可靠与简洁？',
        '重构与测试如何配合？测试金字塔怎么用？',
        '代码审查的常见反模式？如何让评审真正有效？'
      ],
      core: ['软件构建', '防御式编程', '子程序设计', '重构', '代码审查'],
      difficulty: '进阶',
      difficultyDesc: '需要基本编程经验，案例以工程实践为主'
    }
  },
  { id: 'b8', domain: 'data', title: '统计学的世界', author: '戴维·穆尔', difficulty: 'easy',
    cover: null,
    mindmap: { root: '统计学的世界', children: [
      { label: '数据描述', children: [
        { label: '分布与均值' },
        { label: '中位数与众数' },
        { label: '标准差' }
      ]},
      { label: '抽样与实验', children: [
        { label: '抽样偏差' },
        { label: '实验设计' },
        { label: '盲法' }
      ]},
      { label: '概率初步', children: [
        { label: '独立事件' },
        { label: '条件概率' },
        { label: '贝叶斯直觉' }
      ]},
      { label: '统计推断', children: [
        { label: '相关与因果' },
        { label: '假设检验' },
        { label: 'p 值的误用' }
      ]}
    ]},
    guide: {
      why: '培养统计直觉，学会用数据说话、不被数据欺骗。在 AI 时代，统计思维是判断一个结论是否可信的"过滤器"。',
      questions: [
        '相关与因果有什么区别？日常新闻里哪些是"伪相关"？',
        '抽样偏差如何误导结论？民调为什么会翻车？',
        '"p 值"到底是什么意思？哪些常见误用会导致错误结论？',
        '贝叶斯思维为什么重要？我们日常判断如何用条件概率？',
        '"幸存者偏差"是什么？它如何影响你对成功的看法？'
      ],
      core: ['数据分布', '抽样', '相关与因果', '假设检验', '贝叶斯直觉'],
      difficulty: '入门',
      difficultyDesc: '数学要求极低，注重直觉与案例'
    }
  },
  { id: 'b9', domain: 'philosophy', title: '苏菲的世界', author: '乔斯坦·贾德', difficulty: 'easy',
    cover: null,
    mindmap: { root: '苏菲的世界', children: [
      { label: '古希腊哲学', children: [
        { label: '苏格拉底' },
        { label: '柏拉图' },
        { label: '亚里士多德' }
      ]},
      { label: '中世纪与文艺复兴', children: [
        { label: '上帝与理性' },
        { label: '人文主义兴起' }
      ]},
      { label: '近代哲学', children: [
        { label: '笛卡尔（我思故我在）' },
        { label: '洛克（白板说）' },
        { label: '康德（先天综合判断）' }
      ]},
      { label: '现代哲学', children: [
        { label: '黑格尔（辩证法）' },
        { label: '存在主义' },
        { label: '萨特与加缪' }
      ]}
    ]},
    guide: {
      why: '以小说的方式通览西方哲学史，把"哲学"从殿堂拉到你的沙发。从"你是谁？世界从何而来？"开始，建立哲学思考的入口。',
      questions: [
        '从苏格拉底到加缪，哲学家们最关心的问题是什么？',
        '为什么"我思故我在"是哲学的转折点？',
        '理性主义与经验主义的争论对今天的我们意味着什么？',
        '存在主义的"荒谬"是什么？它如何变成一种行动力？',
        '如果你只能记住一句哲学家的名言，你会选哪句？'
      ],
      core: ['哲学史脉络', '存在主义', '理性主义', '经验主义', '怀疑论'],
      difficulty: '入门',
      difficultyDesc: '零基础可读，故事性强'
    }
  }
];

const LIB_SEED_PAPERS = [
  { id: 'p1',  title: 'Attention Is All You Need',                       authors: 'Vaswani et al.',                journal: 'NeurIPS',                   year: 2017, domain: 'science',    url: 'https://arxiv.org/abs/1706.03762', difficulty: 'hard',   citeCount: 138000, tags: ['经典', '高引用'], read: false },
  { id: 'p2',  title: 'A Survey of Large Language Models',              authors: 'Zhao et al.',                   journal: 'arXiv',                     year: 2023, domain: 'science',    url: 'https://arxiv.org/abs/2303.18223', difficulty: 'easy',   citeCount: 4500,   tags: ['最新', '高引用'], read: false },
  { id: 'p3',  title: 'The Market for "Lemons": Quality Uncertainty',   authors: 'George A. Akerlof',             journal: 'QJE',                       year: 1970, domain: 'economy',    url: 'https://www.jstor.org/stable/1879431', difficulty: 'medium', citeCount: 38000,  tags: ['经典', '高引用'], read: false },
  { id: 'p4',  title: 'Prospect Theory: An Analysis of Decision under Risk', authors: 'Kahneman & Tversky',       journal: 'Econometrica',               year: 1979, domain: 'humanity',   url: 'https://www.jstor.org/stable/1914185', difficulty: 'hard',   citeCount: 72000,  tags: ['经典', '高引用'], read: false },
  { id: 'p5',  title: 'The Attention Economy and the Net',              authors: 'Michael H. Goldhaber',          journal: 'First Monday',              year: 1997, domain: 'economy',    url: 'https://firstmonday.org/article/view/519', difficulty: 'easy',   citeCount: 2800,   tags: ['经典'], read: false },
  { id: 'p6',  title: 'Deep Residual Learning for Image Recognition',   authors: 'He et al.',                     journal: 'CVPR',                      year: 2016, domain: 'science',    url: 'https://arxiv.org/abs/1512.03385', difficulty: 'medium', citeCount: 210000, tags: ['经典', '高引用'], read: false },
  { id: 'p7',  title: 'The Tragedy of the Commons',                     authors: 'Garrett Hardin',                journal: 'Science',                   year: 1968, domain: 'data',       url: 'https://www.science.org/doi/10.1126/science.162.3859.1243', difficulty: 'easy',   citeCount: 46000,  tags: ['经典', '高引用'], read: false },
  { id: 'p8',  title: 'Capital in the Twenty-First Century',            authors: 'Thomas Piketty',                journal: 'Harvard University Press',  year: 2014, domain: 'economy',    url: 'https://www.hup.harvard.edu/books/9780674430006', difficulty: 'medium', citeCount: 24000,  tags: ['高引用'], read: false },
  { id: 'p9',  title: 'The Structure of Scientific Revolutions',        authors: 'Thomas S. Kuhn',                journal: 'University of Chicago Press', year: 1962, domain: 'philosophy', url: 'https://press.uchicago.edu/', difficulty: 'medium', citeCount: 110000, tags: ['经典', '高引用'], read: false },
  { id: 'p10', title: 'The Rise and Fall of American Growth',           authors: 'Robert J. Gordon',              journal: 'Princeton University Press',year: 2016, domain: 'history',    url: 'https://press.princeton.edu/', difficulty: 'hard',   citeCount: 6000,   tags: ['最新'], read: false },
  { id: 'p11', title: 'Word2Vec: Efficient Estimation of Word Representations', authors: 'Mikolov et al.',         journal: 'ICLR Workshop',             year: 2013, domain: 'data',       url: 'https://arxiv.org/abs/1301.3781', difficulty: 'easy',   citeCount: 48000,  tags: ['经典', '高引用'], read: false },
  { id: 'p12', title: 'The Phenomenology of Spirit (导读)',              authors: 'G. W. F. Hegel',                journal: '原著导读',                   year: 1807, domain: 'philosophy', url: 'https://plato.stanford.edu/entries/hegel/', difficulty: 'hard',   citeCount: 9000,   tags: ['经典'], read: false },
  { id: 'p13', title: 'Thinking, Fast and Slow (摘要论文)',              authors: 'Kahneman, D.',                  journal: 'Nobel Lecture',             year: 2003, domain: 'humanity',   url: 'https://www.nobelprize.org/prizes/economic-sciences/2002/kahneman/lecture/', difficulty: 'medium', citeCount: 5200,   tags: ['经典'], read: false },
  { id: 'p14', title: 'The Wealth of Nations — 经济学奠基',              authors: 'Adam Smith',                    journal: '经典导读',                   year: 1776, domain: 'economy',    url: 'https://www.adamsmithworks.org/wealth-of-nations/', difficulty: 'hard',   citeCount: 80000,  tags: ['经典'], read: false },
  { id: 'p15', title: 'Guns, Germs, and Steel (摘要)',                  authors: 'Jared Diamond',                 journal: '原著导读',                   year: 1997, domain: 'history',    url: 'https://en.wikipedia.org/wiki/Guns,_Germs,_Steel', difficulty: 'medium', citeCount: 38000,  tags: ['经典', '高引用'], read: false },
  { id: 'p16', title: 'The Art of Doing Science (Doing Research)',       authors: 'J. S. Rigden',                  journal: 'Science',                   year: 1993, domain: 'philosophy', url: 'https://www.science.org/', difficulty: 'easy',   citeCount: 400,    tags: ['方法论'], read: false }
];
