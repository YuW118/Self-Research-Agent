/**
 * Self-Research Agent - 表达力训练主题库
 * 25 个主题，按类别组织：职场 / 生活 / 思想 / 故事
 * 每次随机抽取，用户可跳过换题
 */

const SPEECH_TOPICS = [
  // === 职场与成长 ===
  { category: '职场', topic: '我最近学到的一个新技能', hint: '它是什么？怎么学会的？改变了你什么？' },
  { category: '职场', topic: '如果我是老板', hint: '我会怎么管理团队？什么最重要？' },
  { category: '职场', topic: '我的核心竞争力', hint: '哪 3 个能力让你不可替代？举例说明' },
  { category: '职场', topic: '一次失败教会我的事', hint: '发生了什么？你当时怎么想的？现在怎么看待它？' },
  { category: '职场', topic: '如果可以重启职业生涯', hint: '你会从哪一年开始？做什么不同的选择？' },
  { category: '职场', topic: '如何高效地学习新东西', hint: '你的方法是什么？有具体例子吗？' },

  // === 生活与日常 ===
  { category: '生活', topic: '什么才算是好的生活', hint: '不跟风别人的模板，你的定义是什么？' },
  { category: '生活', topic: '我的精力管理方法', hint: '什么时候精力最好？什么时候最差？你怎么调整？' },
  { category: '生活', topic: '什么是值得花钱的', hint: '哪些消费让你觉得值？哪些是后悔的？' },
  { category: '生活', topic: '一天中最喜欢的一个时刻', hint: '描述它：什么感觉？为什么珍贵？' },
  { category: '生活', topic: '如何与不确定性共处', hint: '你经历过什么不确定的事？你是怎么走过来的？' },
  { category: '生活', topic: '我每天的节奏感', hint: '你的日常是怎么流动的？有没有仪式感？' },

  // === 思想与观念 ===
  { category: '思想', topic: '什么是真正的自由', hint: '财务自由？时间自由？还是内心的自由？' },
  { category: '思想', topic: '十年后的自己', hint: '他在做什么？过着什么样的生活？什么没变？' },
  { category: '思想', topic: '什么是「成功」', hint: '你小时候怎么定义？现在呢？变化是什么？' },
  { category: '思想', topic: '给我最重要的人的一封信', hint: '谁？为什么重要？你想对他说什么？' },
  { category: '思想', topic: '如果可以重启人生', hint: '你会改变什么？为什么？有没有不后悔的？' },
  { category: '思想', topic: 'AI 会改变什么', hint: '你看到的趋势是什么？你准备好了吗？' },

  // === 故事与关系 ===
  { category: '故事', topic: '一个改变了我的人', hint: '是谁？什么场景？具体改变了什么？' },
  { category: '故事', topic: '我最珍视的一段关系', hint: '和谁？为什么这段关系特别？它给了你什么？' },
  { category: '故事', topic: '最近一次受益匪浅的对话', hint: '和谁？聊了什么？有什么收获？' },
  { category: '故事', topic: '我做过最勇敢的一件事', hint: '什么时候？为什么勇敢？结果呢？' },
  { category: '故事', topic: '童年里最深刻的记忆', hint: '什么画面？什么气味？为什么忘不掉？' },
  { category: '故事', topic: '如果给 18 岁的自己一个建议', hint: '你会说什么？为什么是这句话？' },
  { category: '故事', topic: '我希望被记住的三件事', hint: '你希望别人在想起你时想到哪三样？' }
];

/**
 * 获取今日随机主题（按日期种子，保证同一天同一主题不重复）
 * @param {string[]} usedTopics - 已用过的主题列表（可选，避免当天重复抽取）
 * @returns {{ category: string, topic: string, hint: string }}
 */
function getSpeechTopic(usedTopics) {
  const available = usedTopics && usedTopics.length
    ? SPEECH_TOPICS.filter(t => !usedTopics.includes(t.topic))
    : SPEECH_TOPICS;
  const pool = available.length > 0 ? available : SPEECH_TOPICS;

  // 用当天日期做种子，保证同一天抽到相同主题（但切换时跳过）
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const idx = seed % pool.length;
  return pool[idx];
}

/**
 * 随机主题（不依赖日期种子）
 */
function getRandomSpeechTopic() {
  const idx = Math.floor(Math.random() * SPEECH_TOPICS.length);
  return SPEECH_TOPICS[idx];
}
