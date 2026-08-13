/**
 * 知识库模块：扩展书籍种子数据（用户上传书单）
 * 与 LIB_SEED_BOOKS 合并使用，在 library-data.js 之后加载
 */
const LIB_SEED_BOOKS_EXTRA = [
  /* ===== 人性与心理学 ===== */
  { id:'b11', domain:'humanity', title:'认知觉醒', author:'周岭', difficulty:'easy', cover:null,
    mindmap:{ root:'认知觉醒', children:[
      { label:'大脑构造', children:[{label:'本能脑：爬行动物时代'},{label:'情绪脑：哺乳动物时代'},{label:'理智脑：人类独有但年轻'}]},
      { label:'焦虑根源', children:[{label:'想同时做很多事又想立即看到效果'},{label:'复利曲线的拐点还没到'}]},
      { label:'元认知', children:[{label:'反思日记：每日复盘'},{label:'冥想：训练注意力'}]},
      { label:'行动力', children:[{label:'清晰力：把目标写下来'},{label:'在拉伸区练习，不贪舒适区'}]}
    ]},
    guide:{ why:'从大脑构造出发解释为什么我们总是焦虑和拖延，给出元认知和清晰力等可落地的行动框架。', questions:[
      '本能脑、情绪脑、理智脑三者如何博弈？为什么理智脑常常输？',
      '为什么"想同时做很多事又想立即看到效果"是焦虑的根源？',
      '元认知是什么？反思日记如何帮你跳出自动驾驶模式？',
      '什么是"清晰力"？为什么"写下来"比"想清楚"更有力量？',
      '复利效应的拐点意味着什么？如何在低谷期不放弃？'
    ], core:['三脑理论','元认知','清晰力','拉伸区','复利效应'], difficulty:'入门', difficultyDesc:'语言通俗，适合自我成长入门'}
  },
  { id:'b12', domain:'humanity', title:'被讨厌的勇气', author:'岸见一郎 / 古贺史健', difficulty:'medium', cover:null,
    mindmap:{ root:'被讨厌的勇气', children:[
      { label:'目的论 vs 原因论', children:[{label:'不是"因为过去所以现在"'},{label:'而是"为了现在所以选择"'}]},
      { label:'课题分离', children:[{label:'这是谁的课题？'},{label:'不干涉他人课题'}]},
      { label:'共同体感觉', children:[{label:'贡献感来自他者贡献'},{label:'存在本身就有价值'}]},
      { label:'活在当下', children:[{label:'人生是点的连续'},{label:'此时此刻即可舞蹈'}]}
    ]},
    guide:{ why:'以对话体介绍阿德勒心理学，打破"过去决定现在"的因果论，用目的论和课题分离给人行动的自由。', questions:[
      '目的论和原因论有什么根本区别？为什么说"选择"比"原因"更有力量？',
      '课题分离如何解决人际关系中的纠结？"这是谁的课题"怎么判断？',
      '"被讨厌的勇气"意味着什么？为什么自由等于被讨厌？',
      '共同体感觉和"他者贡献"如何重建自我价值？',
      '"人生是点的连续"如何改变了你对过去和未来的看法？'
    ], core:['目的论','课题分离','共同体感觉','活在当下','自我接纳'], difficulty:'进阶', difficultyDesc:'对话体可读性强，但核心概念需反复咀嚼'}
  },
  { id:'b13', domain:'humanity', title:'当下的力量', author:'埃克哈特·托利', difficulty:'medium', cover:null,
    mindmap:{ root:'当下的力量', children:[
      { label:'痛苦之身', children:[{label:'对过去的认同'},{label:'情绪的惯性模式'}]},
      { label:'观察者', children:[{label:'你不是你的思维'},{label:'成为思维的见证者'}]},
      { label:'临在', children:[{label:'全然处于当下'},{label:'停止心理时间旅行'}]},
      { label:'臣服', children:[{label:'接受当下如其所是'},{label:'不是放弃而是接纳'}]}
    ]},
    guide:{ why:'用灵性视角解读"活在当下"，帮助读者从思维认同中解脱，体验临在的力量。', questions:[
      '"痛苦之身"是什么？它如何通过回忆和情绪延续？',
      '为什么"你不是你的思维"？观察者意识如何改变体验？',
      '什么是"临在"？它与冥想有什么区别和联系？',
      '臣服和放弃有什么不同？如何在困难中实践臣服？',
      '心理时间旅行如何制造痛苦？停止它意味着什么？'
    ], core:['痛苦之身','观察者意识','临在','臣服','心理时间'], difficulty:'进阶', difficultyDesc:'灵性语境需开放心态，核心概念偏抽象'}
  },
  { id:'b14', domain:'humanity', title:'自卑与超越', author:'阿尔弗雷德·阿德勒', difficulty:'medium', cover:null,
    mindmap:{ root:'自卑与超越', children:[
      { label:'自卑感', children:[{label:'人人都有自卑'},{label:'自卑是进步的动力'}]},
      { label:'追求优越', children:[{label:'健康vs不健康的追求'},{label:'从个人到社会'}]},
      { label:'社会兴趣', children:[{label:'人生三大任务：工作/社交/亲密'},{label:'合作是核心'}]},
      { label:'生活风格', children:[{label:'童年形成模式'},{label:'认识并调整风格'}]}
    ]},
    guide:{ why:'阿德勒个体心理学经典，从自卑感出发理解人的行为动力，给出超越自卑的社会化路径。', questions:[
      '自卑感为什么不是缺陷而是动力？它和自卑情结有什么区别？',
      '"追求优越"有健康和不健康之分吗？如何区分？',
      '人生三大任务（工作、社交、亲密）如何体现社会兴趣？',
      '童年如何形成生活风格？成人后还能改变吗？',
      '为什么阿德勒说"合作能力"是心理健康的标尺？'
    ], core:['自卑感','追求优越','社会兴趣','生活风格','合作能力'], difficulty:'进阶', difficultyDesc:'学术经典，需要耐心消化部分术语'}
  },
  { id:'b15', domain:'humanity', title:'自控力', author:'凯利·麦格尼格尔', difficulty:'easy', cover:null,
    mindmap:{ root:'自控力', children:[
      { label:'我要/我不要/我想要', children:[{label:'三种力量共存'},{label:'前额叶皮层的作用'}]},
      { label:'自控力是有限资源', children:[{label:'自我损耗'},{label:'血糖与决策力'}]},
      { label:'多巴胺陷阱', children:[{label:'奖励的承诺vs真正的满足'},{label:'虚假渴望'}]},
      { label:'冥想训练', children:[{label:'5分钟呼吸法'},{label:'提升自控力基线'}]}
    ]},
    guide:{ why:'斯坦福最受欢迎的心理学课程，用脑科学解释自控力，给出冥想等可操作的训练方法。', questions:[
      '"我要"、"我不要"、"我想要"三种力量分别对应大脑什么区域？',
      '为什么自控力是有限资源？什么会加速它的损耗？',
      '多巴胺如何制造"虚假渴望"？奖励承诺和真正满足有什么区别？',
      '冥想如何提升自控力？5分钟呼吸法的原理是什么？',
      '什么是"道德许可效应"？为什么做了好事后更容易放纵？'
    ], core:['三种自控力','自我损耗','多巴胺陷阱','冥想训练','道德许可'], difficulty:'入门', difficultyDesc:'通俗有趣，案例丰富，可操作性强'}
  },

  /* ===== 经济与商业 ===== */
  { id:'b16', domain:'economy', title:'好的家庭教育', author:'李希贵', difficulty:'medium', cover:null,
    mindmap:{ root:'好的家庭教育', children:[
      { label:'关系先于教育', children:[{label:'亲子关系的底层逻辑'},{label:'信任比管控更重要'}]},
      { label:'给孩子选择权', children:[{label:'自主决策的能力'},{label:'试错是最快的成长'}]},
      { label:'看不见的课程', children:[{label:'环境即教育'},{label:'同伴的力量'}]},
      { label:'评价体系', children:[{label:'多元评价代替单一分数'},{label:'成长型思维'}]}
    ]},
    guide:{ why:'北京十一学校校长李希贵的教育实践，从关系、选择、评价三个维度重新定义家庭教育。', questions:[
      '为什么"关系先于教育"？亲子关系的信任基础如何建立？',
      '给孩子选择权会不会失控？如何在自由和规则间平衡？',
      '"看不见的课程"指什么？环境如何无声地教育孩子？',
      '多元评价体系如何减轻分数焦虑？什么是成长型思维？',
      '这本书的理念对普通家庭的日常教育有什么可落地的建议？'
    ], core:['关系先于教育','选择权','环境即教育','多元评价','成长型思维'], difficulty:'进阶', difficultyDesc:'理念与案例结合，适合家长和教育者'}
  },
  { id:'b17', domain:'economy', title:'财务自由之路', author:'博多·舍费尔', difficulty:'easy', cover:null,
    mindmap:{ root:'财务自由之路', children:[
      { label:'金钱观', children:[{label:'金钱是自由工具'},{label:'责任与自信'}]},
      { label:'储蓄策略', children:[{label:'先付给自己'},{label:'10%原则'}]},
      { label:'复利与投资', children:[{label:'时间是最强盟友'},{label:'指数基金定投'}]},
      { label:'财务自由', children:[{label:'被动收入覆盖支出'},{label:'三个阶段'}]}
    ]},
    guide:{ why:'欧洲巴比伦理财课，从金钱观到储蓄、投资、财务自由，给出清晰的7年路径。', questions:[
      '"先付给自己"意味着什么？10%原则如何执行？',
      '复利在什么条件下才能真正发挥作用？时间的作用有多大？',
      '财务自由的三个阶段是什么？你现在处于哪个阶段？',
      '为什么作者说"自信"比"收入"更重要？',
      '指数基金定投为什么适合普通人？它和主动投资有什么区别？'
    ], core:['金钱观','先付给自己','复利','指数基金','财务自由'], difficulty:'入门', difficultyDesc:'通俗易懂，适合理财入门'}
  },
  { id:'b18', domain:'economy', title:'穷爸爸富爸爸', author:'罗伯特·清崎', difficulty:'easy', cover:null,
    mindmap:{ root:'穷爸爸富爸爸', children:[
      { label:'资产vs负债', children:[{label:'资产：把钱放进口袋'},{label:'负债：把钱掏出口袋'}]},
      { label:'现金流象限', children:[{label:'E雇员/S自雇/B企业主/I投资者'},{label:'从左侧到右侧'}]},
      { label:'财商教育', children:[{label:'学校不教金钱'},{label:'让钱为你工作'}]},
      { label:'富人思维', children:[{label:'买资产而非负债'},{label:'用收入投资'}]}
    ]},
    guide:{ why:'用两个爸爸的故事区分资产与负债，颠覆传统"赚钱-花钱"模式，建立让钱为你工作的财商思维。', questions:[
      '资产和负债的定义是什么？你的房子是资产还是负债？',
      '现金流象限的四个位置有什么本质区别？',
      '为什么学校不教财商？普通人如何补上这一课？',
      '"让钱为你工作"和"为钱工作"的区别是什么？',
      '这本书的理念在中国环境下需要做哪些调整？'
    ], core:['资产vs负债','现金流象限','财商教育','让钱工作','富人思维'], difficulty:'入门', difficultyDesc:'故事性强，理念简单有力'}
  },
  { id:'b19', domain:'economy', title:'穷查理宝典', author:'查理·芒格', difficulty:'hard', cover:null,
    mindmap:{ root:'穷查理宝典', children:[
      { label:'多元思维模型', children:[{label:'100+个模型跨学科'},{label:'心理学/物理/数学/生物'}]},
      { label:'人类误判心理学', children:[{label:'25个认知偏差'},{label:'奖励超级力量'}]},
      { label:'反向思考', children:[{label:'如果我知道会死在哪就不去'},{label:'避免愚蠢比追求聪明更重要'}]},
      { label:'能力圈', children:[{label:'知道自己不知道什么'},{label:'在圈内行动'}]}
    ]},
    guide:{ why:'巴菲特黄金搭档芒格的智慧集，从多元思维模型到人类误判心理学，展示如何用跨学科知识做决策。', questions:[
      '什么是多元思维模型？为什么单一学科不足以解决复杂问题？',
      '芒格总结的25个认知偏差中，哪个对你影响最大？',
      '"反过来想，总是反过来想"如何帮你避免犯错？',
      '能力圈的边界如何判断？知道"不知道什么"为什么很重要？',
      '芒格的阅读习惯和他的决策能力有什么关系？'
    ], core:['多元思维模型','人类误判心理学','反向思考','能力圈','跨学科'], difficulty:'精深', difficultyDesc:'信息密集，需要跨学科知识和投资经验'}
  },
  { id:'b20', domain:'economy', title:'原则', author:'瑞·达利欧', difficulty:'medium', cover:null,
    mindmap:{ root:'原则', children:[
      { label:'极度真实', children:[{label:'面对现实不美化'},{label:'透明沟通'}]},
      { label:'极度透明', children:[{label:'让问题暴露'},{label:'不要隐瞒错误'}]},
      { label:'创意择优', children:[{label:'最好的想法胜出'},{label:'可信度加权决策'}]},
      { label:'机器模型', children:[{label:'把组织当机器'},{label:'目标-机器-结果循环'}]}
    ]},
    guide:{ why:'桥水基金创始人达利欧的生活和工作原则，用极度真实和极度透明的方法做出更好的决策。', questions:[
      '"极度真实"为什么比"感觉良好"更重要？它如何改变沟通方式？',
      '极度透明会不会伤害人际关系？如何平衡透明和尊重？',
      '创意择优和民主投票有什么区别？可信度加权如何运作？',
      '把组织当机器的模型如何帮你发现和修复问题？',
      '这些原则适用于个人生活吗？如何提取个人版原则？'
    ], core:['极度真实','极度透明','创意择优','可信度加权','机器模型'], difficulty:'进阶', difficultyDesc:'篇幅较长，核心理念集中在前半部分'}
  },
  { id:'b21', domain:'economy', title:'黑天鹅', author:'纳西姆·塔勒布', difficulty:'hard', cover:null,
    mindmap:{ root:'黑天鹅', children:[
      { label:'黑天鹅事件', children:[{label:'稀有/影响巨大/事后可解释'},{label:'不可预测的本质'}]},
      { label:'平均斯坦vs极端斯坦', children:[{label:'正态分布的局限'},{label:'幂律分布主导现实'}]},
      { label:'叙述谬误', children:[{label:'事后编故事'},{label:'简化复杂性'}]},
      { label:'反脆弱策略', children:[{label:'杠铃策略'},{label:'从波动中获益'}]}
    ]},
    guide:{ why:'揭示极端事件对历史的塑造力，打破正态分布思维，建立应对不确定性的认知框架。', questions:[
      '黑天鹅事件的三个特征是什么？为什么它不可预测？',
      '平均斯坦和极端斯坦有什么区别？金融数据属于哪个？',
      '叙述谬误如何让我们误以为世界是可预测的？',
      '杠铃策略如何帮助你在不确定性中获益？',
      '为什么专家预测常常不如简单模型？'
    ], core:['黑天鹅事件','极端斯坦','叙述谬误','杠铃策略','不确定性'], difficulty:'精深', difficultyDesc:'思维密度高，作者行文跳跃，需耐心'}
  },
  { id:'b22', domain:'economy', title:'聪明的投资者', author:'本杰明·格雷厄姆', difficulty:'hard', cover:null,
    mindmap:{ root:'聪明的投资者', children:[
      { label:'价值投资', children:[{label:'安全边际'},{label:'内在价值vs市场价格'}]},
      { label:'市场先生', children:[{label:'情绪化的对手'},{label:'利用而非跟随'}]},
      { label:'防御型vs进取型', children:[{label:'被动投资策略'},{label:'主动分析策略'}]},
      { label:'安全边际', children:[{label:'买入价格远低于价值'},{label:'投资的基石'}]}
    ]},
    guide:{ why:'巴菲特称之为"有史以来最好的投资书"，奠定价值投资理论：安全边际和市场先生概念至今适用。', questions:[
      '"市场先生"的隐喻如何帮助理解市场波动？',
      '安全边际是什么？为什么它是投资的基石？',
      '防御型和进取型投资者的策略有什么区别？你适合哪种？',
      '内在价值和市场价格为什么会偏离？如何利用这种偏离？',
      '这本书的原理在当今量化交易时代还适用吗？'
    ], core:['价值投资','安全边际','市场先生','内在价值','防御vs进取'], difficulty:'精深', difficultyDesc:'学术性强，需要基本财务知识'}
  },
  { id:'b23', domain:'economy', title:'一本书读懂财报', author:'肖星', difficulty:'easy', cover:null,
    mindmap:{ root:'一本书读懂财报', children:[
      { label:'资产负债表', children:[{label:'钱从哪来，花到哪去'},{label:'资产=负债+所有者权益'}]},
      { label:'利润表', children:[{label:'赚了还是亏了'},{label:'收入-费用=利润'}]},
      { label:'现金流量表', children:[{label:'经营/投资/融资'},{label:'现金流比利润更真实'}]},
      { label:'财务分析', children:[{label:'毛利率/周转率/回报率'},{label:'同业对比'}]}
    ]},
    guide:{ why:'清华大学肖星教授的财报入门，用通俗语言把三张表讲透，适合零基础读者。', questions:[
      '资产负债表的"资产=负债+所有者权益"如何理解？',
      '为什么有利润的企业可能现金流断裂？现金流量表告诉你什么？',
      '利润表的收入和费用如何匹配？权责发生制是什么？',
      '毛利率、周转率、回报率分别衡量什么？',
      '如何用财务比率快速判断一家公司的健康程度？'
    ], core:['资产负债表','利润表','现金流量表','财务比率','同业对比'], difficulty:'入门', difficultyDesc:'通俗案例，零基础可读'}
  },
  { id:'b24', domain:'economy', title:'反脆弱', author:'纳西姆·塔勒布', difficulty:'hard', cover:null,
    mindmap:{ root:'反脆弱', children:[
      { label:'脆弱vs反脆弱', children:[{label:'脆弱怕波动'},{label:'反脆弱从波动中变强'}]},
      { label:'杠铃策略', children:[{label:'90%安全+10%冒险'},{label:'不对称收益'}]},
      { label:'创伤后成长', children:[{label:'小创伤=疫苗'},{label:'过度保护=脆弱'}]},
      { label:'否定法', children:[{label:'减法比加法有效'},{label:'去掉有害的东西'}]}
    ]},
    guide:{ why:'从黑天鹅延伸出的哲学：不仅是抵御不确定性，而是从波动和压力中变得更强。', questions:[
      '脆弱、强韧、反脆弱三者有什么区别？',
      '杠铃策略如何创造不对称收益？为什么不用中间策略？',
      '小创伤如何像疫苗一样增强系统？过度保护为什么反而有害？',
      '否定法为什么比加法更有效？在投资中如何应用？',
      '人体免疫系统如何体现反脆弱性？社会组织呢？'
    ], core:['反脆弱','杠铃策略','创伤后成长','否定法','不对称收益'], difficulty:'精深', difficultyDesc:'哲学性强，需要一定阅读功底'}
  },
  { id:'b25', domain:'economy', title:'国富论', author:'亚当·斯密', difficulty:'hard', cover:null,
    mindmap:{ root:'国富论', children:[
      { label:'分工与交换', children:[{label:'分工提升生产率'},{label:'交换是分工的前提'}]},
      { label:'看不见的手', children:[{label:'自利驱动公益'},{label:'市场价格机制'}]},
      { label:'劳动价值论', children:[{label:'劳动是财富源泉'},{label:'价值与价格'}]},
      { label:'自由贸易', children:[{label:'比较优势雏形'},{label:'关税的代价'}]}
    ]},
    guide:{ why:'现代经济学奠基之作，分工理论、看不见的手、自由贸易思想至今影响全球经济政策。', questions:[
      '分工如何提升生产率？它有没有负面效应？',
      '"看不见的手"到底在调节什么？它什么时候会失灵？',
      '劳动价值论和后来的边际效用理论有什么不同？',
      '斯密反对自由贸易吗？他对关税的态度如何？',
      '这本书的思想在今天的全球化中如何体现？'
    ], core:['分工理论','看不见的手','劳动价值论','自由贸易','市场价格'], difficulty:'精深', difficultyDesc:'18世纪文风，需要耐心和历史背景'}
  },
  { id:'b26', domain:'economy', title:'稀缺', author:'塞德希尔·穆来纳森', difficulty:'medium', cover:null,
    mindmap:{ root:'稀缺', children:[
      { label:'稀缺心态', children:[{label:'注意力被俘获'},{label:'管窥效应'}]},
      { label:'带宽税', children:[{label:'认知资源被消耗'},{label:'决策质量下降'}]},
      { label:'稀缺陷阱', children:[{label:'借债-更多稀缺-更多借债'},{label:'忙人越忙越穷'}]},
      { label:'余闲', children:[{label:'留出缓冲'},{label:'计划应对突发'}]}
    ]},
    guide:{ why:'用心理学解释为什么穷人越来越穷、忙人越来越忙，揭示"稀缺心态"如何消耗认知带宽。', questions:[
      '稀缺心态如何俘获注意力？"管窥效应"是什么？',
      '认知带宽是什么？稀缺如何消耗它？',
      '稀缺陷阱如何形成自我强化循环？如何打破？',
      '"余闲"为什么比"效率"更重要？',
      '这本书对时间管理和个人财务有什么启示？'
    ], core:['稀缺心态','管窥效应','带宽税','稀缺陷阱','余闲'], difficulty:'进阶', difficultyDesc:'行为经济学，概念清晰但需消化'}
  },
  { id:'b27', domain:'economy', title:'贫穷的本质', author:'阿比吉特·班纳吉', difficulty:'medium', cover:null,
    mindmap:{ root:'贫穷的本质', children:[
      { label:'贫困陷阱', children:[{label:'营养/健康/教育恶性循环'},{label:'代际传递'}]},
      { label:'穷人的选择', children:[{label:'信息不对称'},{label:'风险规避导致保守'}]},
      { label:'微型金融', children:[{label:'小额信贷的效果'},{label:'储蓄的障碍'}]},
      { label:'政策启示', children:[{label:'精准干预'},{label:'随机对照试验(RCT)'}]}
    ]},
    guide:{ why:'诺奖得主用随机对照实验研究全球贫困，揭示穷人决策的真实逻辑，颠覆传统扶贫思维。', questions:[
      '贫困陷阱如何形成？它和稀缺心态有什么关系？',
      '穷人为什么做出看似不理性的选择？信息不对称如何影响他们？',
      '小额信贷真的有效吗？它解决了什么问题又留下了什么？',
      'RCT随机对照试验如何帮助设计更好的扶贫政策？',
      '这本书对中国扶贫实践有什么启示？'
    ], core:['贫困陷阱','信息不对称','微型金融','RCT','精准干预'], difficulty:'进阶', difficultyDesc:'学术性但案例丰富，需基本经济学常识'}
  },
  { id:'b28', domain:'economy', title:'投资最重要的事', author:'霍华德·马克斯', difficulty:'medium', cover:null,
    mindmap:{ root:'投资最重要的事', children:[
      { label:'第二层次思维', children:[{label:'大家怎么看 vs 我怎么看不同'},{label:'共识中找不到超额收益'}]},
      { label:'价值与价格', children:[{label:'好公司不等于好投资'},{label:'以低于价值的价格买入'}]},
      { label:'周期', children:[{label:'钟摆效应'},{label:'人在极端时犯大错'}]},
      { label:'风险控制', children:[{label:'风险不是波动而是永久损失'},{label:'安全边际'}]}
    ]},
    guide:{ why:'橡树资本创始人的投资备忘录，从第二层次思维到周期和风险，凝聚40年投资智慧。', questions:[
      '第二层次思维和第一层次有什么区别？如何训练？',
      '为什么"好公司"不一定是"好投资"？价值与价格的关系是什么？',
      '钟摆效应如何描述市场极端？如何在周期中保持理性？',
      '风险的定义为什么不是波动？永久损失如何防范？',
      '这些原则如何应用于A股或加密货币市场？'
    ], core:['第二层次思维','价值与价格','周期','风险控制','安全边际'], difficulty:'进阶', difficultyDesc:'投资经验丰富者收获更大'}
  },
  { id:'b29', domain:'economy', title:'证券分析', author:'本杰明·格雷厄姆', difficulty:'hard', cover:null,
    mindmap:{ root:'证券分析', children:[
      { label:'内在价值', children:[{label:'未来现金流的折现'},{label:'与市场价格的差异'}]},
      { label:'安全边际', children:[{label:'买入价远低于内在价值'},{label:'容错空间'}]},
      { label:'资产负债表分析', children:[{label:'流动资产/负债'},{label:'隐藏资产'}]},
      { label:'损益表分析', children:[{label:'盈利质量'},{label:'非经常性损益'}]}
    ]},
    guide:{ why:'价值投资的教科书级著作，从内在价值到安全边际，系统讲解证券分析的方法论。', questions:[
      '内在价值如何估算？它与市场价格为什么会有差异？',
      '安全边际如何防范分析错误？多大的边际才够？',
      '资产负债表分析的关键指标有哪些？',
      '盈利质量如何判断？非经常性损益如何识别？',
      '这本书的方法在当今市场中还适用吗？需要哪些更新？'
    ], core:['内在价值','安全边际','资产负债表分析','盈利质量','折现现金流'], difficulty:'精深', difficultyDesc:'专业性强，需要会计和金融基础'}
  },
  { id:'b30', domain:'economy', title:'巴菲特致股东的信', author:'沃伦·巴菲特', difficulty:'medium', cover:null,
    mindmap:{ root:'巴菲特致股东的信', children:[
      { label:'企业视角投资', children:[{label:'买企业而非股票'},{label:'长期持有'}]},
      { label:'护城河', children:[{label:'竞争优势的来源'},{label:'品牌/成本/网络/切换成本'}]},
      { label:'管理层评估', children:[{label:'诚信与能力'},{label:'资本配置能力'}]},
      { label:'市场情绪', children:[{label:'别人贪婪我恐惧'},{label:'逆向思维'}]}
    ]},
    guide:{ why:'巴菲特数十年致股东信的精华，从企业视角投资到护城河和管理层评估，展现投资智慧。', questions:[
      '为什么巴菲特说"买企业而不是买股票"？这种视角如何改变决策？',
      '护城河的四种类型是什么？如何识别一家公司的护城河？',
      '巴菲特如何评估管理层？诚信和能力哪个更重要？',
      '"别人贪婪我恐惧"在实操中如何执行？逆向思维的心理障碍是什么？',
      '巴菲特的投资风格在这些年有什么演变？'
    ], core:['企业视角','护城河','管理层评估','逆向思维','长期持有'], difficulty:'进阶', difficultyDesc:'需要投资基础，信件风格需适应'}
  },
  { id:'b31', domain:'economy', title:'彼得林奇的成功投资', author:'彼得·林奇', difficulty:'easy', cover:null,
    mindmap:{ root:'彼得林奇的成功投资', children:[
      { label:'十倍股', children:[{label:'日常生活中的发现'},{label:'小公司大潜力'}]},
      { label:'股票分类', children:[{label:'缓慢增长/稳定增长/快速增长'},{label:'周期/困境反转/资产隐蔽'}]},
      { label:'PEG比率', children:[{label:'市盈率/增长率'},{label:'合理估值标尺'}]},
      { label:'投资纪律', children:[{label:'知道你买的是什么'},{label:'耐心持有'}]}
    ]},
    guide:{ why:'麦哲伦基金掌门人林奇的投资入门，用日常观察发现十倍股，方法简单但需要耐心和纪律。', questions:[
      '林奇如何从日常生活中发现投资机会？这种方法可行吗？',
      '六种股票分类分别有什么特征？投资策略有何不同？',
      'PEG比率如何帮你判断估值是否合理？它有什么局限？',
      '为什么"知道你买的是什么"比技术分析更重要？',
      '林奇的方法适合中国A股市场吗？需要哪些调整？'
    ], core:['十倍股','股票分类','PEG比率','投资纪律','日常观察'], difficulty:'入门', difficultyDesc:'语言通俗，案例丰富，适合入门'}
  },
  { id:'b32', domain:'economy', title:'股票作手回忆录', author:'埃德温·勒菲弗', difficulty:'medium', cover:null,
    mindmap:{ root:'股票作手回忆录', children:[
      { label:'趋势跟踪', children:[{label:'顺势而为'},{label:'不在反转前行动'}]},
      { label:'人性不变', children:[{label:'贪婪与恐惧循环'},{label:'历史会重演'}]},
      { label:'试探性建仓', children:[{label:'先小仓试错'},{label:'对了再加仓'}]},
      { label:'纪律', children:[{label:'止损的重要性'},{label:'独处与独立思考'}]}
    ]},
    guide:{ why:'以传奇交易员利弗莫尔为原型的小说体投资经典，展示趋势跟踪和市场心理的永恒智慧。', questions:[
      '利弗莫尔的"试探性建仓"策略如何运作？为什么先小后大？',
      '"人性不变"如何解释市场反复出现的模式？',
      '趋势跟踪的核心原则是什么？如何判断趋势反转？',
      '利弗莫尔最终失败的原因是什么？给人什么警示？',
      '这本书的交易智慧在当今算法时代还适用吗？'
    ], core:['趋势跟踪','人性不变','试探性建仓','止损纪律','独立思考'], difficulty:'进阶', difficultyDesc:'小说体可读性强，交易智慧需提炼'}
  },
  { id:'b33', domain:'economy', title:'股票大作手操盘术', author:'杰西·利弗莫尔', difficulty:'medium', cover:null,
    mindmap:{ root:'股票大作手操盘术', children:[
      { label:'关键点交易', children:[{label:'突破买入'},{label:'最小阻力方向'}]},
      { label:'资金管理', children:[{label:'分批建仓'},{label:'保留现金储备'}]},
      { label:'时机', children:[{label:'等待正确时机'},{label:'耐心比正确更重要'}]},
      { label:'规则', children:[{label:'不追涨杀跌'},{label:'亏损不加仓'}]}
    ]},
    guide:{ why:'利弗莫尔亲笔操盘笔记，比回忆录更技术化，记录关键点交易和资金管理的具体规则。', questions:[
      '关键点交易是什么？如何判断最小阻力方向？',
      '资金管理为什么比选股更重要？分批建仓如何执行？',
      '为什么"等待正确时机"比"选对股票"更难？',
      '利弗莫尔的核心交易规则有哪些？哪些至今仍然有效？',
      '利弗莫尔的交易体系有什么致命缺陷？'
    ], core:['关键点交易','资金管理','时机选择','交易规则','最小阻力'], difficulty:'进阶', difficultyDesc:'需要交易经验，概念偏实操'}
  },
  { id:'b34', domain:'economy', title:'以交易为生', author:'亚历山大·埃尔德', difficulty:'medium', cover:null,
    mindmap:{ root:'以交易为生', children:[
      { label:'心理三分法', children:[{label:'理性自我/冲动自我/纪律自我'},{label:'三者博弈'}]},
      { label:'资金管理', children:[{label:'2%风险法则'},{label:'头寸规模计算'}]},
      { label:'技术分析', children:[{label:'趋势/支撑/阻力'},{label:'指标辅助不主导'}]},
      { label:'交易记录', children:[{label:'记录每笔交易理由'},{label:'复盘与改进'}]}
    ]},
    guide:{ why:'从心理学和资金管理角度讲交易，强调交易是"概率游戏"而非"预测游戏"，适合系统化交易入门。', questions:[
      '心理三分法如何帮助你理解交易中的自我冲突？',
      '2%风险法则如何计算头寸？它如何保护你不爆仓？',
      '为什么技术指标只能辅助不能主导决策？',
      '交易记录为什么如此重要？如何建立有效的复盘习惯？',
      '以交易为生需要满足什么条件？'
    ], core:['心理三分法','2%风险法则','资金管理','交易记录','概率思维'], difficulty:'进阶', difficultyDesc:'需要基本交易经验，系统化思维'}
  },
  { id:'b35', domain:'economy', title:'海龟交易法则', author:'柯蒂斯·费思', difficulty:'medium', cover:null,
    mindmap:{ root:'海龟交易法则', children:[
      { label:'趋势突破', children:[{label:'20日突破入场'},{label:'55日突破确认'}]},
      { label:'头寸规模', children:[{label:'波动率调整(N值)'},{label:'每单位风险恒定'}]},
      { label:'止损与加仓', children:[{label:'2N止损'},{label:'盈利后金字塔加仓'}]},
      { label:'心理', children:[{label:'纪律执行系统'},{label:'克服回撤期心理'}]}
    ]},
    guide:{ why:'传奇交易实验的亲历记录，展示完整的趋势跟踪系统——从入场到止损到头寸管理，全部规则化。', questions:[
      '海龟交易系统的核心逻辑是什么？为什么趋势跟踪能赚钱？',
      'N值（波动率）如何决定头寸规模？为什么不同品种用同一个系统？',
      '2N止损和金字塔加仓如何配合？',
      '为什么有了好系统大多数人还是亏钱？心理因素占多少？',
      '海龟法则在当今市场还有效吗？需要哪些调整？'
    ], core:['趋势突破','N值头寸管理','2N止损','金字塔加仓','纪律执行'], difficulty:'进阶', difficultyDesc:'系统化交易经典，需理解趋势跟踪逻辑'}
  },
  { id:'b36', domain:'economy', title:'芒格之道', author:'李录 编', difficulty:'hard', cover:null,
    mindmap:{ root:'芒格之道', children:[
      { label:'跨学科思维', children:[{label:'100+模型'},{label:'物理/生物/心理/经济'}]},
      { label:'逆向思考', children:[{label:'避免愚蠢'},{label:'收集失败案例'}]},
      { label:'能力圈', children:[{label:'不碰不懂的'},{label:'机会来时重注'}]},
      { label:'品格', children:[{label:'诚实是最佳策略'},{label:'信任降低交易成本'}]}
    ]},
    guide:{ why:'李录整理的芒格讲话集，比穷查理宝典更聚焦投资实践，展示芒格如何在真实决策中运用多元思维。', questions:[
      '芒格如何在投资决策中运用跨学科思维模型？',
      '逆向思考如何帮你避免投资中的致命错误？',
      '能力圈在实操中如何界定？"不碰不懂的"有多难？',
      '为什么芒格说"诚实是最佳策略"？它与投资回报有什么关系？',
      '芒格和巴菲特的投资风格有什么异同？'
    ], core:['跨学科思维','逆向思考','能力圈','诚实策略','集中投资'], difficulty:'精深', difficultyDesc:'需要投资经验和跨学科知识'}
  },
  { id:'b37', domain:'economy', title:'底层逻辑', author:'刘润', difficulty:'easy', cover:null,
    mindmap:{ root:'底层逻辑', children:[
      { label:'是非对错', children:[{label:'事实/观点/立场/信仰'},{label:'谁的损失大谁的错'}]},
      { label:'思考方式', children:[{label:'假设-验证-结论-调整'},{label:'复盘思维'}]},
      { label:'个体进化', children:[{label:'人生商业模式=能力×效率×杠杆'},{label:'可复制的成长'}]},
      { label:'理解他人', children:[{label:'同理心'},{label:'边界感'}]}
    ]},
    guide:{ why:'用商业咨询视角拆解日常问题的"底层逻辑"，帮你在复杂世界中建立清晰的思考框架。', questions:[
      '事实、观点、立场、信仰如何区分？混淆它们会带来什么问题？',
      '"谁的损失大谁的错"如何改变你的归因方式？',
      '人生商业模式的公式如何帮你规划成长路径？',
      '什么是"可复制的成长"？它和天赋有什么关系？',
      '底层逻辑和"常识"有什么区别？'
    ], core:['是非对错','思考方式','个体进化','理解他人','商业模式'], difficulty:'入门', difficultyDesc:'通俗易懂，案例偏商业'}
  },

  /* ===== 科学与技术 ===== */
  { id:'b38', domain:'science', title:'七堂极简物理课', author:'卡洛·罗韦利', difficulty:'easy', cover:null,
    mindmap:{ root:'七堂极简物理课', children:[
      { label:'相对论', children:[{label:'时空弯曲'},{label:'引力即几何'}]},
      { label:'量子力学', children:[{label:'不确定性原理'},{label:'量子叠加'}]},
      { label:'宇宙结构', children:[{label:'恒星演化'},{label:'宇宙膨胀'}]},
      { label:'热与时间', children:[{label:'熵增方向'},{label:'时间的本质'}]}
    ]},
    guide:{ why:'意大利物理学家用7篇短文讲透现代物理，篇幅极短但意境深远，适合零基础读者感受科学之美。', questions:[
      '相对论如何改变了我们对时间和空间的理解？',
      '量子力学的不确定性原理意味着什么？',
      '熵增为什么定义了时间的方向？',
      '这本书如何用诗意语言传达物理学的美？',
      '现代物理学最前沿的困惑是什么？'
    ], core:['相对论','量子力学','宇宙结构','熵增','时间的本质'], difficulty:'入门', difficultyDesc:'极短篇幅，零基础可读'}
  },
  { id:'b39', domain:'science', title:'写给大家的设计书', author:'罗宾·威廉姆斯', difficulty:'easy', cover:null,
    mindmap:{ root:'写给大家的设计书', children:[
      { label:'亲密性', children:[{label:'相关信息分组'},{label:'减少视觉混乱'}]},
      { label:'对齐', children:[{label:'统一对齐方式'},{label:'建立视觉秩序'}]},
      { label:'重复', children:[{label:'一致性的力量'},{label:'建立品牌感'}]},
      { label:'对比', children:[{label:'制造层次感'},{label:'吸引注意力'}]}
    ]},
    guide:{ why:'设计入门经典，用CRAP四原则（对比/重复/对齐/亲密性）让普通人也能做出专业排版。', questions:[
      'CRAP四原则分别解决什么设计问题？',
      '亲密性如何减少视觉混乱？',
      '为什么"对齐"比"居中"更有力量？',
      '对比如何制造层次感和注意力？',
      '这四个原则如何应用到PPT、简历、海报中？'
    ], core:['亲密性','对齐','重复','对比','CRAP原则'], difficulty:'入门', difficultyDesc:'零基础可读，实操性极强'}
  },
  { id:'b40', domain:'science', title:'别逗了费曼先生', author:'理查德·费曼', difficulty:'easy', cover:null,
    mindmap:{ root:'别逗了费曼先生', children:[
      { label:'好奇心驱动', children:[{label:'什么都想搞明白'},{label:'从蚂蚁到锁匠'}]},
      { label:'第一性原理', children:[{label:'不迷信权威'},{label:'自己推导验证'}]},
      { label:'科学方法', children:[{label:'怀疑是美德'},{label:'实验高于理论'}]},
      { label:'费曼精神', children:[{label:'享受发现的乐趣'},{label:'不装懂'}]}
    ]},
    guide:{ why:'诺贝尔物理学奖得主的趣闻自传，展示真正的好奇心和科学精神如何让生活充满乐趣。', questions:[
      '费曼的好奇心如何驱动他的科学发现？',
      '为什么费曼说"不知道"是科学的起点？',
      '费曼如何用第一性原理思考问题？',
      '费曼精神对普通人的学习和工作有什么启示？',
      '为什么费曼反对"假装理解"？'
    ], core:['好奇心','第一性原理','科学方法','怀疑精神','享受发现'], difficulty:'入门', difficultyDesc:'幽默风趣，零基础可读'}
  },
  { id:'b41', domain:'science', title:'失控', author:'凯文·凯利', difficulty:'hard', cover:null,
    mindmap:{ root:'失控', children:[
      { label:'蜂群思维', children:[{label:'分布式智能'},{label:'没有中心也能协作'}]},
      { label:'涌现', children:[{label:'整体大于部分之和'},{label:'简单规则产生复杂行为'}]},
      { label:'共同进化', children:[{label:'生物与环境的协同'},{label:'红皇后效应'}]},
      { label:'技术演化', children:[{label:'技术有自己的方向'},{label:'生物与技术的趋同'}]}
    ]},
    guide:{ why:'KK预言互联网、云计算、物联网的圣经级著作，从生物进化到技术演化，展示"失控"即"涌现"。', questions:[
      '蜂群思维如何颠覆中心化控制？',
      '涌现现象在自然界和人类社会中如何体现？',
      '共同进化和红皇后效应有什么区别？',
      'KK的预言哪些已经实现，哪些还没有？',
      '"技术有自己的方向"意味着什么？人类还能控制技术吗？'
    ], core:['蜂群思维','涌现','共同进化','技术演化','分布式'], difficulty:'精深', difficultyDesc:'篇幅宏大，概念密集，需耐心'}
  },
  { id:'b42', domain:'science', title:'费曼物理学讲义', author:'理查德·费曼', difficulty:'hard', cover:null,
    mindmap:{ root:'费曼物理学讲义', children:[
      { label:'力学与运动', children:[{label:'牛顿定律的本质'},{label:'能量守恒'}]},
      { label:'电磁学', children:[{label:'场的概念'},{label:'麦克斯韦方程'}]},
      { label:'量子力学', children:[{label:'概率波'},{label:'测量问题'}]},
      { label:'物理直觉', children:[{label:'用类比理解'},{label:'从现象出发'}]}
    ]},
    guide:{ why:'费曼在加州理工的传奇讲义，把物理从公式推导变为直觉理解，至今被奉为最好的物理教材。', questions:[
      '费曼如何用直觉和类比讲物理？和传统教材有什么不同？',
      '能量守恒为什么是物理学的基石？',
      '电磁场是什么？麦克斯韦方程如何统一电和磁？',
      '量子力学的概率波意味着什么？测量问题如何理解？',
      '费曼讲义适合什么样的人读？需要什么基础？'
    ], core:['牛顿定律','能量守恒','电磁场','量子力学','物理直觉'], difficulty:'精深', difficultyDesc:'需要数学基础，但讲解极为精妙'}
  },
  { id:'b43', domain:'science', title:'系统之美', author:'德内拉·梅多斯', difficulty:'medium', cover:null,
    mindmap:{ root:'系统之美', children:[
      { label:'系统要素', children:[{label:'要素/连接/功能'},{label:'存量与流量'}]},
      { label:'反馈回路', children:[{label:'正反馈（增强环）'},{label:'负反馈（调节环）'}]},
      { label:'系统行为', children:[{label:'延迟效应'},{label:'杠杆点'}]},
      { label:'系统陷阱', children:[{label:'政策阻力'},{label:'目标侵蚀'}]}
    ]},
    guide:{ why:'系统思考入门经典，把世界看作相互连接的系统，帮你看清"头痛医头"为什么无效。', questions:[
      '系统的三个要素是什么？为什么"连接"比"要素"更重要？',
      '正反馈和负反馈如何塑造系统行为？',
      '什么是杠杆点？为什么小改变可能产生大效果？',
      '系统陷阱有哪些？"政策阻力"如何破解？',
      '如何用系统思维分析你生活中反复出现的问题？'
    ], core:['系统要素','反馈回路','延迟效应','杠杆点','系统陷阱'], difficulty:'进阶', difficultyDesc:'概念清晰但需要练习应用'}
  },
  { id:'b44', domain:'science', title:'时间简史', author:'史蒂芬·霍金', difficulty:'medium', cover:null,
    mindmap:{ root:'时间简史', children:[
      { label:'宇宙起源', children:[{label:'大爆炸理论'},{label:'宇宙微波背景'}]},
      { label:'时空', children:[{label:'相对论与弯曲时空'},{label:'黑洞与事件视界'}]},
      { label:'时间箭头', children:[{label:'热力学箭头'},{label:'心理学箭头'}]},
      { label:'统一理论', children:[{label:'量子引力'},{label:'弦理论'}]}
    ]},
    guide:{ why:'霍金的科普经典，从大爆炸到黑洞，用通俗语言带领读者探索宇宙的终极问题。', questions:[
      '大爆炸理论有什么证据？宇宙之前是什么？',
      '黑洞和事件视界是什么？信息能在黑洞中保存吗？',
      '时间为什么有方向？热力学箭头和心理学箭头有什么关系？',
      '统一理论为什么重要？弦理论是方向吗？',
      '霍金如何用通俗语言讲清楚最难懂的物理？'
    ], core:['大爆炸','弯曲时空','黑洞','时间箭头','统一理论'], difficulty:'进阶', difficultyDesc:'概念深奥但霍金讲解清晰'}
  },
  { id:'b45', domain:'science', title:'必然', author:'凯文·凯利', difficulty:'medium', cover:null,
    mindmap:{ root:'必然', children:[
      { label:'12种必然趋势', children:[{label:'形成/知化/流动'},{label:'屏读/使用/共享'}]},
      { label:'知化', children:[{label:'AI是新型电力'},{label:'一切都将智能化'}]},
      { label:'流动', children:[{label:'从固化到流动'},{label:'使用权>所有权'}]},
      { label:'过滤', children:[{label:'注意力稀缺'},{label:'算法推荐'}]}
    ]},
    guide:{ why:'KK预测未来30年12种技术必然趋势，从知化到流动，帮你看清不可逆的技术方向。', questions:[
      'KK说的"必然"是什么意思？为什么技术趋势不可逆转？',
      '"知化"如何改变所有行业？AI作为基础设施意味着什么？',
      '为什么"使用权"会取代"所有权"？',
      '注意力经济中"过滤"为什么如此重要？',
      'KK的预测哪些已经在我们身边发生了？'
    ], core:['12种趋势','知化','流动','使用权','过滤'], difficulty:'进阶', difficultyDesc:'前瞻性强，需要技术背景理解部分概念'}
  },
  { id:'b46', domain:'science', title:'寂静的春天', author:'蕾切尔·卡逊', difficulty:'easy', cover:null,
    mindmap:{ root:'寂静的春天', children:[
      { label:'DDT之害', children:[{label:'生物富集效应'},{label:'食物链传递'}]},
      { label:'生态平衡', children:[{label:'物种间的依赖'},{label:'人为干预的代价'}]},
      { label:'替代方案', children:[{label:'生物防治'},{label:'生态学思维'}]},
      { label:'环保运动', children:[{label:'从科学到政策'},{label:'公民行动的力量'}]}
    ]},
    guide:{ why:'现代环保运动的开山之作，用DDT案例揭示化学污染对生态系统的连锁破坏，改变了人类与自然的关系。', questions:[
      'DDT如何通过生物富集影响食物链顶端物种？',
      '为什么"控制自然"的观念是危险的？',
      '生物防治比化学防治有什么优势和局限？',
      '这本书如何推动了环保立法？',
      '寂静的春天在今天有什么新的版本？'
    ], core:['生物富集','生态平衡','生物防治','环保运动','生态学思维'], difficulty:'入门', difficultyDesc:'文学性科学写作，可读性强'}
  },
  { id:'b47', domain:'science', title:'物种起源', author:'查尔斯·达尔文', difficulty:'hard', cover:null,
    mindmap:{ root:'物种起源', children:[
      { label:'自然选择', children:[{label:'变异/遗传/选择'},{label:'适者生存'}]},
      { label:'变异与遗传', children:[{label:'个体差异是原料'},{label:'有利变异被保留'}]},
      { label:'物种分化', children:[{label:'地理隔离'},{label:'生殖隔离'}]},
      { label:'共同祖先', children:[{label:'生命之树'},{label:'所有物种同源'}]}
    ]},
    guide:{ why:'改变人类世界观的科学巨著，用自然选择理论解释物种起源，至今是生物学的基石。', questions:[
      '自然选择的三个条件是什么？为什么缺一不可？',
      '为什么达尔文说"适者生存"而非"强者生存"？',
      '物种分化如何发生？地理隔离为什么重要？',
      '共同祖先理论如何重塑了人类的自我认知？',
      '进化论在今天有什么新的发展和修正？'
    ], core:['自然选择','变异与遗传','物种分化','共同祖先','适者生存'], difficulty:'精深', difficultyDesc:'19世纪文风，逻辑严密但篇幅长'}
  },

  /* ===== 历史与文明 ===== */
  { id:'b48', domain:'history', title:'全球通史', author:'斯塔夫里阿诺斯', difficulty:'medium', cover:null,
    mindmap:{ root:'全球通史', children:[
      { label:'史前人类', children:[{label:'从采集到农业'},{label:'人类扩散全球'}]},
      { label:'文明发展', children:[{label:'欧亚大陆的轴心'},{label:'区域文明'}]},
      { label:'西方崛起', children:[{label:'技术与制度突破'},{label:'全球扩张'}]},
      { label:'全球互连', children:[{label:'殖民与去殖民'},{label:'全球化时代'}]}
    ]},
    guide:{ why:'以全球视角而非区域视角讲述人类历史，打破"欧洲中心论"，展示文明间的互动与互构。', questions:[
      '全球史观和传统国别史有什么根本区别？',
      '为什么欧亚大陆率先发展出复杂文明？',
      '西方崛起的原因是什么？地理还是制度？',
      '殖民体系如何塑造了今天的世界格局？',
      '全球互连时代历史学的新挑战是什么？'
    ], core:['全球史观','文明互动','西方崛起','殖民体系','全球化'], difficulty:'进阶', difficultyDesc:'篇幅宏大，建议选读关键章节'}
  },

  /* ===== 数据与世界 ===== */
  { id:'b49', domain:'data', title:'数据化决策', author:'道格拉斯·W·哈伯德', difficulty:'medium', cover:null,
    mindmap:{ root:'数据化决策', children:[
      { label:'万物皆可量化', children:[{label:'偏好/风险/价值'},{label:'间接测量法'}]},
      { label:'校准估计', children:[{label:'90%置信区间'},{label:'减少不确定性'}]},
      { label:'信息价值', children:[{label:'计算信息的期望价值'},{label:'不为零价值信息做测量'}]},
      { label:'贝叶斯更新', children:[{label:'先验/似然/后验'},{label:'逐步修正'}]}
    ]},
    guide:{ why:'用数据科学方法解决"不可量化"问题，从偏好到风险，教你用测量降低决策的不确定性。', questions:[
      '为什么作者说"万物皆可量化"？如何量化"不可量化"的东西？',
      '什么是校准估计？90%置信区间如何使用？',
      '信息的期望价值如何计算？什么时候不值得做测量？',
      '贝叶斯更新如何帮你逐步修正判断？',
      '这些方法如何应用到日常生活和商业决策中？'
    ], core:['万物可量化','校准估计','信息价值','贝叶斯更新','不确定性'], difficulty:'进阶', difficultyDesc:'需要基本统计思维，案例丰富'}
  },
  { id:'b50', domain:'data', title:'精益数据分析', author:'阿利斯泰尔·克罗尔', difficulty:'medium', cover:null,
    mindmap:{ root:'精益数据分析', children:[
      { label:'精益创业循环', children:[{label:'构建-测量-学习'},{label:'最小可行产品(MVP)'}]},
      { label:'第一关键指标', children:[{label:'每个阶段一个核心指标'},{label:'其他指标辅助'}]},
      { label:'指标框架', children:[{label:'获客/活跃/留存/收入'},{label:'漏斗分析'}]},
      { label:'数据驱动文化', children:[{label:'假设先行'},{label:'实验精神'}]}
    ]},
    guide:{ why:'把精益创业和数据分析结合，教创业团队如何用"一个关键指标"快速验证假设、避免空转。', questions:[
      '精益创业循环如何运作？MVP的作用是什么？',
      '什么是"第一关键指标"？为什么不能同时追多个指标？',
      '不同阶段的创业公司应该关注什么指标？',
      '漏斗分析如何帮你找到增长瓶颈？',
      '如何建立数据驱动的团队文化？'
    ], core:['精益循环','第一关键指标','MVP','漏斗分析','数据文化'], difficulty:'进阶', difficultyDesc:'适合创业者/产品经理，需要基本数据思维'}
  },
  { id:'b51', domain:'data', title:'信号与噪声', author:'纳特·西尔弗', difficulty:'medium', cover:null,
    mindmap:{ root:'信号与噪声', children:[
      { label:'预测的困境', children:[{label:'数据多不等于预测好'},{label:'过拟合问题'}]},
      { label:'贝叶斯预测', children:[{label:'先验概率的重要性'},{label:'不断修正'}]},
      { label:'领域案例', children:[{label:'选举/体育/天气/经济'},{label:'不同领域的预测难度'}]},
      { label:'预测者素养', children:[{label:'承认不确定性'},{label:'警惕过度自信'}]}
    ]},
    guide:{ why:'FiveThirtyEight创始人用选举和体育预测展示如何在数据洪流中分离信号与噪声。', questions:[
      '为什么数据越多预测不一定越准？过拟合是什么意思？',
      '贝叶斯方法如何改进预测？先验概率为什么重要？',
      '为什么天气预报越来越准而经济预测仍然很差？',
      '一个优秀的预测者应该具备什么素养？',
      '如何在日常生活中避免被噪声误导？'
    ], core:['信号与噪声','贝叶斯预测','过拟合','先验概率','预测素养'], difficulty:'进阶', difficultyDesc:'案例丰富，需要基本概率概念'}
  },

  /* ===== 哲学与思维 ===== */
  { id:'b52', domain:'philosophy', title:'谈美', author:'朱光潜', difficulty:'easy', cover:null,
    mindmap:{ root:'谈美', children:[
      { label:'美感态度', children:[{label:'实用/科学/美感三种态度'},{label:'距离产生美'}]},
      { label:'美感经验', children:[{label:'直觉与联想'},{label:'移情作用'}]},
      { label:'艺术与生活', children:[{label:'艺术是生活理想化'},{label:'人生艺术化'}]},
      { label:'美的条件', children:[{label:'和谐/比例/节奏'},{label:'内容与形式'}]}
    ]},
    guide:{ why:'朱光潜写给青年的美学入门，用亲切的书信体把"美"从哲学概念变成生活体验。', questions:[
      '三种对待事物的方式（实用/科学/美感）有什么区别？',
      '为什么"距离产生美"？移情作用如何运作？',
      '什么是"人生艺术化"？朱光潜的建议是什么？',
      '美的条件有哪些？和谐和比例为什么重要？',
      '这本书对提升日常审美有什么帮助？'
    ], core:['美感态度','心理距离','移情作用','人生艺术化','形式与内容'], difficulty:'入门', difficultyDesc:'书信体亲切，零基础可读'}
  },
  { id:'b53', domain:'philosophy', title:'纳瓦尔宝典', author:'埃里克·乔根森', difficulty:'easy', cover:null,
    mindmap:{ root:'纳瓦尔宝典', children:[
      { label:'财富公式', children:[{label:'专长+杠杆+判断力'},{label:'被动收入'}]},
      { label:'幸福', children:[{label:'幸福是可习得的技能'},{label:'欲望是选择'}]},
      { label:'阅读', children:[{label:'读好书不在多'},{label:'建立思维模型'}]},
      { label:'复利', children:[{label:'人际关系复利'},{label:'知识复利'}]}
    ]},
    guide:{ why:'硅谷投资人纳瓦尔的智慧合集，从财富创造到幸福哲学，用极简语言传递高密度洞察。', questions:[
      '纳瓦尔的财富公式是什么？"专长"为什么如此重要？',
      '为什么他说"幸福是可习得的技能"？欲望和幸福有什么关系？',
      '纳瓦尔的阅读方法和传统有什么不同？',
      '人际关系和知识的复利如何运作？',
      '纳瓦尔的哲学和斯多葛学派有什么相似之处？'
    ], core:['财富公式','专长','杠杆','幸福技能','知识复利'], difficulty:'入门', difficultyDesc:'碎片化洞察，适合快速阅读'}
  },
  { id:'b54', domain:'philosophy', title:'中国哲学简史', author:'冯友兰', difficulty:'medium', cover:null,
    mindmap:{ root:'中国哲学简史', children:[
      { label:'先秦诸子', children:[{label:'儒家/道家/墨家/法家'},{label:'百家争鸣'}]},
      { label:'儒学演变', children:[{label:'汉代经学'},{label:'宋明理学'}]},
      { label:'佛学中国化', children:[{label:'禅宗'},{label:'儒释道融合'}]},
      { label:'中国哲学精神', children:[{label:'内圣外王'},{label:'天人合一'}]}
    ]},
    guide:{ why:'冯友兰用英文写给西方人的中国哲学通史，回译后成为最好的中文哲学入门书之一。', questions:[
      '先秦诸子的核心思想分别是什么？百家争鸣的本质是什么？',
      '儒学从汉代到宋明经历了什么变化？',
      '佛学如何中国化为禅宗？',
      '"内圣外王"如何概括中国哲学的精神？',
      '中国哲学和西方哲学的根本区别是什么？'
    ], core:['先秦诸子','儒学演变','禅宗','内圣外王','天人合一'], difficulty:'进阶', difficultyDesc:'学术通史，需要耐心但讲解清晰'}
  },
  { id:'b55', domain:'philosophy', title:'查拉图斯特拉如是说', author:'尼采', difficulty:'hard', cover:null,
    mindmap:{ root:'查拉图斯特拉如是说', children:[
      { label:'超人', children:[{label:'超越人类的存在'},{label:'自我超越'}]},
      { label:'权力意志', children:[{label:'不是控制而是创造'},{label:'生命力的肯定'}]},
      { label:'永恒轮回', children:[{label:'如果一切重复'},{label:'你能否接受？'}]},
      { label:'价值重估', children:[{label:'上帝已死'},{label:'自己创造价值'}]}
    ]},
    guide:{ why:'尼采的哲学诗，以查拉图斯特拉的口吻讲述超人、权力意志、永恒轮回和价值重估。', questions:[
      '"超人"不是超级英雄——尼采说的超人是什么？',
      '权力意志为什么不是"控制别人"而是"自我创造"？',
      '永恒轮回如何成为生命的终极检验？',
      '"上帝已死"之后，人类如何自己创造价值？',
      '尼采的哲学如何影响了后来的存在主义？'
    ], core:['超人','权力意志','永恒轮回','价值重估','上帝已死'], difficulty:'精深', difficultyDesc:'哲学诗体，隐喻密集，需要反复阅读'}
  }
];
