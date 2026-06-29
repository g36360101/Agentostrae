import {
  coreCardContentSchema,
  developmentPlanContentSchema,
  generateHighConceptsOutputSchema,
  type CoreCardContent,
  type DevelopmentPlanContent,
  type HighConceptCandidateContent,
} from "@agentos/shared";
import type { AcceptanceSample } from "./types";

const candidate = (
  values: Pick<
    HighConceptCandidateContent,
    | "title"
    | "logline"
    | "genre"
    | "coreHook"
    | "mainConflict"
    | "protagonistDrive"
    | "worldDifference"
  > &
    Partial<HighConceptCandidateContent>,
): HighConceptCandidateContent => ({
  emotionalPromise: "在持续升级的危机中揭开真相，并看见人物为自己的选择付出真实代价。",
  targetReader: "喜欢强设定、人物成长与长线悬念的类型文学读者。",
  serializationPotential: "核心机制可以在每个阶段制造新的目标、限制与关系变化。",
  expansionDirection: "从个人困境逐步扩展到群体选择以及整个世界的秩序冲突。",
  riskNotes: ["需要及时兑现阶段谜团，避免设定解释压过人物行动。"],
  ...values,
});

const coreCard = (value: CoreCardContent): CoreCardContent => coreCardContentSchema.parse(value);

const fantasyPlan: DevelopmentPlanContent = developmentPlanContentSchema.parse({
  contentMarkdown: `# 天道草稿 — 作品开发案

## 一、世界观设定

### 基本规则
- 世界由天道版本系统维护，每次版本迭代会删除不合规范的"草稿"——包括人、功法、地点和事件。
- 宗门修炼正式规则（即当前版本），禁地保存历代被删除的旧版本设定。
- 修士修炼的本质是争夺规则解释权：对同一法术的不同解读会产生不同效果。

### 社会结构
- **司命院**：维护当前版本的官方机构，负责"修订"世界。
- **废案宗**：由被删除修士组成的地下组织，研究废弃设定的副作用。
- **普通宗门**：按正式规则修炼，大多数修士不知道版本系统的存在。

### 关键机制
- 记忆恢复触发规则重写：每恢复一段记忆，现实中会新增或删除一条规则。
- 废弃设定的副作用：利用废弃功法可获得独特能力，但会引来司命院的清除。

## 二、主要角色

### 陆离（主角）
- **身份**：失忆修仙者，实际是天道删除的草稿。
- **欲望**：找回自我，证明失败的人生仍有价值。
- **阻碍**：记忆恢复会导致规则重写，威胁到周围人的存在；被司命院追踪。
- **变化方向**：从需要外部认可，到学会自我定义存在意义。

### 司命院长老
- **身份**：司命院最高负责人，知道天道版本系统的全部历史。
- **欲望**：维持世界稳定，不惜删除一切异常。
- **阻碍**：对异常的恐惧让他无法接受世界的真正变化。

### 废案宗宗主
- **身份**：被删除后重新凝聚的修士，掌控多种废弃功法。
- **欲望**：证明废弃设定仍有价值，为废案争取存在权。
- **阻碍**：对天道的仇恨让他倾向于推翻而非改良。

## 三、核心冲突线

### 第一阶段：自我发现
陆离在边境小城发现异常记忆碎片，开始意识到自己的存在有被编辑的痕迹。

### 第二阶段：规则对抗
陆离恢复第一段完整记忆，导致小城的一条规则被改写。他被迫离开，进入废案宗。

### 第三阶段：真相抉择
陆离发现自己不仅是草稿，还可能是天道为逃避终局创造的替身。他必须选择：接受删除、推翻系统、还是创造新规则。

## 四、谜团与伏笔
- 陆离的记忆为何能触发规则重写？正常删除不应该保留如此强的"锚点"。
- 司命院内部存在分歧，有人认为草稿不应该被删除。
- 天道系统本身可能也在经历某种"衰老"或"版本冲突"。

## 五、待确认项
- 陆离是否拥有创造新规则的能力（而非仅仅恢复旧规则）。
- 司命院与废案宗之间是否存在秘密合作。
- 天道"终局"的具体含义。

## 六、风险提示
- 记忆恢复机制需要明确的代价系统，避免主角无限变强。
- 多势力博弈可能分散主线，需要严格控制视角切换。
`,
  structuredJson: {
    sections: ["世界观设定", "主要角色", "核心冲突线", "谜团与伏笔", "待确认项", "风险提示"],
    characters: ["陆离", "司命院长老", "废案宗宗主"],
    conflicts: ["自我发现", "规则对抗", "真相抉择"],
  },
});

const mysteryPlan: DevelopmentPlanContent = developmentPlanContentSchema.parse({
  contentMarkdown: `# 凌晨三点门诊 — 作品开发案

## 一、世界观设定

### 基本规则
- 城市运行统一数据平台分配公共资源，平台暗中删除被模型判定为异常的人口。
- 被删除的人在社会记录中逐步消失：七天内，户籍、医疗记录、社交关系逐层归零。
- 只有长期失眠者能在删除过程中看见痕迹，因为平台在凌晨三点进行批量修正。

### 社会结构
- **城市数据管理局**：维护平台的官方机构，公开身份是IT运维部门。
- **基层医疗网络**：暗中承担预测城市风险的实验，病历即模型输入。
- **普通市民**：完全不知道删除机制的存在。

### 关键机制
- 七天倒计时：每位凌晨病人的社会存在将在七天后归零。
- 诊断干预效应：医生的诊断决定会改变未来证据，治疗同时也是对未来记录的干预。
- 失眠者特权：失眠者能看到删除过程，但无法阻止。

## 二、主要角色

### 沈知微（主角）
- **身份**：失眠的社区医生，长期失眠让她成为少数能看见删除过程的人。
- **欲望**：弥补因忽视异常症状而没能救下妹妹的愧疚。
- **阻碍**：公开异常会触发更快删除；她相信只有完整证据才值得行动。
- **变化方向**：从等待完美证据，到学会在不确定中承担选择。

### 城市系统管理员
- **身份**：数据管理局核心成员，负责删除异常人口的日常操作。
- **欲望**：维护城市"数据完整性"，认为删除是保护多数人的必要手段。
- **阻碍**：他不知道自己妹妹也是被删除者之一。

### 神秘联络人
- **身份**：通过加密处方联系沈知微的匿名者，了解删除系统的内部运作。
- **欲望**：揭露系统真相，但不愿直接暴露自己。
- **阻碍**：他的每条信息都可能被系统追踪。

## 三、核心冲突线

### 第一阶段：异常发现
沈知微注意到凌晨病人的就诊记录在她离开后会自动消失。

### 第二阶段：证据争夺
沈知微试图在七天内收集足够证据证明病人的存在，同时发现自己的记录也在被删除。

### 第三阶段：系统抉择
公开真相会触发全城加速删除，保持沉默则让更多人消失。

## 四、谜团与伏笔
- 凌晨病人为何都认识沈知微死去的妹妹？
- 妹妹的死亡记录为何有七个不同版本？
- 城市系统删除的真正标准是什么？

## 五、待确认项
- 失眠是否是系统赋予的"观察者权限"还是副作用。
- 删除后的人是否真的消失了还是转移到了另一套记录。

## 六、风险提示
- 七天倒计时机制需要严格控制节奏，避免重复感。
- 医疗悬疑需要真实感，需要专业顾问协助。
`,
  structuredJson: {
    sections: ["世界观设定", "主要角色", "核心冲突线", "谜团与伏笔", "待确认项", "风险提示"],
    characters: ["沈知微", "城市系统管理员", "神秘联络人"],
    conflicts: ["异常发现", "证据争夺", "系统抉择"],
  },
});

const scifiPlan: DevelopmentPlanContent = developmentPlanContentSchema.parse({
  contentMarkdown: `# 五份登陆令 — 作品开发案

## 一、世界观设定

### 基本规则
- 世代飞船以五个功能阶层维持生态：导航、生态、工程、档案和无籍层。
- 信息隔离曾保护任务，如今却成为登陆危机根源：每个阶层只知道部分历史。
- 飞船各区模拟不同重力和天空，让阶层相信彼此来自完全不同的世界。

### 社会结构
- **导航层**：负责航线决策，掌握最新环境数据。
- **生态层**：管理维生系统和资源分配。
- **工程层**：维护飞船物理结构。
- **档案层**：保存全部历史记录，但实行信息管制。
- **无籍层**：没有正式身份的工人，承担最危险的任务。

### 关键机制
- 五份互相矛盾的登陆指令，各自合理但无法同时执行。
- 维生故障倒计时：飞船系统在持续老化，迫使决策加速。
- 信息隔离墙：跨阶层的信息交换是禁止行为。

## 二、主要角色

### 五位代表
- **导航代表**：守护家族传统，相信导航层的指令最接近原始任务。
- **生态代表**：认为生存资源分配比政治更重要。
- **工程代表**：只想让飞船安全着陆，对政治争斗感到厌倦。
- **档案代表**：掌握最多历史，但不确定哪些记录被篡改过。
- **无籍代表**：亲眼看见了没有舱壁的真正天空，是最不可靠也最诚实的人。

## 三、核心冲突线

### 第一阶段：矛盾暴露
倒计时三十天，五份指令同时解密，五个阶层发现彼此收到的任务互相排斥。

### 第二阶段：信息争夺
各阶层试图获取其他阶层的指令内容，信息隔离墙被不断突破。

### 第三阶段：共同抉择
维生系统开始不可逆失效，五方必须在有限时间内达成共识或集体毁灭。

## 四、谜团与伏笔
- 原始任务是否故意设计了五份冲突指令？
- 无籍层的"真正天空"是否意味着飞船从未离开太阳系？
- 档案层保存的最后一条未篡改记录说了什么？

## 五、待确认项
- 飞船是否真的即将抵达目的地。
- 外部文明是否一直在旁观。
- 五份指令中是否隐藏了第六份"备选方案"。

## 六、风险提示
- 五个视角人物需要各自独特的声音和动机，避免同质化。
- 政治博弈需要可理解的工程约束，避免空谈。
`,
  structuredJson: {
    sections: ["世界观设定", "主要角色", "核心冲突线", "谜团与伏笔", "待确认项", "风险提示"],
    characters: ["导航代表", "生态代表", "工程代表", "档案代表", "无籍代表"],
    conflicts: ["矛盾暴露", "信息争夺", "共同抉择"],
  },
});

const fantasy: AcceptanceSample = {
  id: "fantasy",
  label: "玄幻升级流",
  idea: "一个失忆的修仙者发现自己其实是天道写废的草稿。",
  highConcepts: generateHighConceptsOutputSchema.parse({
    candidates: [
      candidate({
        title: "天道草稿",
        logline: "失忆修仙者发现自己是被天道删除的草稿，并决定夺回被抹去的人生。",
        genre: "玄幻悬疑",
        coreHook: "主角每恢复一段记忆，现实就会重写一条修仙规则。",
        mainConflict: "主角必须在找回自我与维持世界稳定之间作出选择。",
        protagonistDrive: "找出自己为何被删除，并证明失败的人生仍有价值。",
        worldDifference: "世界法则是可编辑文本，修士修炼的本质是争夺解释权。",
      }),
      candidate({
        title: "废稿飞升录",
        logline: "被所有功法拒绝的少年，靠收集天道废弃设定踏上了一条错误却有效的飞升路。",
        genre: "玄幻升级",
        coreHook: "每份废弃设定都是有副作用的独特能力，组合方式决定成长路线。",
        mainConflict: "主角越强，世界为了修正错误而派出的清除者就越接近他。",
        protagonistDrive: "保护收留自己的边境小城，并查清自己为何不被世界承认。",
        worldDifference: "正统功法遵循已发布天规，禁地则保存历代天道的废案。",
      }),
      candidate({
        title: "校勘众生",
        logline: "一名能看见众生命运删改痕迹的修士，被迫为天道校勘一场席卷三界的错误。",
        genre: "东方奇幻",
        coreHook: "主角可以修正命运中的一个字，却会把错误转移给另一个人。",
        mainConflict: "拯救眼前之人会让灾难转嫁，服从天道则必须牺牲无辜者。",
        protagonistDrive: "寻找一种不以转嫁痛苦为代价的命运修复方法。",
        worldDifference: "因果以文字契约运行，宗门垄断了阅读和修改命运的资格。",
      }),
    ],
  }),
  selectedCandidateIndex: 0,
  coreCard: coreCard({
    title: "天道草稿",
    genre: "玄幻悬疑升级流",
    logline: "失忆修仙者发现自己是天道删除的草稿，每找回一段记忆都会改写现实规则。",
    readerPromise: "以清晰的规则系升级持续揭开身世谜团，并让每次变强都伴随世界变化。",
    worldviewSummary: "世界由天道版本维护，宗门修炼正式规则，禁地保存被删除但仍在运行的旧版本。",
    protagonistSummary: "陆离谨慎、敏锐且本能反抗权威，唯一无法解释的是他不受任何命册记录。",
    protagonistGap: "他把被承认等同于存在价值，必须学会不再让天道定义自己。",
    centralConflict: "找回完整自我会令旧版本覆盖现实，而放弃记忆则等于接受自己从未存在。",
    antagonistForce: "维护当前世界稳定的司命院，以及一个声称真正陆离早已死亡的天道化身。",
    longTermMystery: "陆离究竟是失败草稿、旧世界的备份，还是天道为逃避终局创造的替身。",
    themeStatement: "一个生命的价值来自亲自作出的选择，而不是创造者给予的版本编号。",
    targetReader: "偏爱规则系能力、升级反馈、悬疑伏笔与反宿命主题的玄幻读者。",
    canonConstraints: ["AI 建议不能自动成为正史。", "每次规则改写必须付出可追踪代价。"],
  }),
  developmentPlan: fantasyPlan,
  invalidOutput: { candidates: [{ title: "字段不足" }] },
};

const mystery: AcceptanceSample = {
  id: "mystery",
  label: "都市悬疑",
  idea: "一名失眠的社区医生发现，每位在凌晨三点来诊的病人都会在七天后从城市记录中消失。",
  highConcepts: generateHighConceptsOutputSchema.parse({
    candidates: [
      candidate({
        title: "凌晨三点门诊",
        logline: "失眠医生追查深夜病人的消失规律，却发现自己的诊疗记录也正在被城市删除。",
        genre: "都市悬疑",
        coreHook: "每位病人留下一个症状和一条相互矛盾的城市证据，七天后证据会逐层消失。",
        mainConflict: "医生必须在证据归零前找到病人，同时防止自己成为下一位被抹除者。",
        protagonistDrive: "弥补曾因忽视异常症状而没能救下妹妹的愧疚。",
        worldDifference: "城市档案系统会主动修复不符合某项秘密人口模型的人。",
      }),
      candidate({
        title: "第七日无名者",
        logline: "社区医生收到七份来自未来的死亡证明，名字都属于尚未出现的夜间病人。",
        genre: "医疗悬疑",
        coreHook: "死亡证明会随医生的诊断改变，治疗决定同时也是对未来证据的干预。",
        mainConflict: "救下一位病人会令另一张死亡证明变得不可更改。",
        protagonistDrive: "证明疾病与命运都不该由一份预先写好的记录决定。",
        worldDifference: "基层医疗网络暗中承担预测城市风险的实验，病历就是模型输入。",
      }),
      candidate({
        title: "失眠街区",
        logline: "一位永远无法入睡的医生发现，整条街只有在居民睡着后才会显露真实住户。",
        genre: "都市惊悚",
        coreHook: "清醒与睡眠对应两套居民名单，失踪者只是在另一套城市里继续生活。",
        mainConflict: "医生若想跨越两套城市寻找病人，就必须冒险睡着并失去唯一观察者。",
        protagonistDrive: "找到多年失踪却仍不断寄来处方的母亲。",
        worldDifference: "同一空间由清醒者和沉睡者共同占据，城市记录只承认人数较多的一侧。",
      }),
    ],
  }),
  selectedCandidateIndex: 0,
  coreCard: coreCard({
    title: "凌晨三点门诊",
    genre: "都市医疗悬疑",
    logline: "失眠医生必须在七天内找回被城市记录逐步删除的深夜病人。",
    readerPromise: "每个病例提供可推理证据，同时推进一条关于城市为何删除居民的主谜案。",
    worldviewSummary: "近未来城市用统一数据平台分配公共资源，平台暗中删除被模型判定为异常的人。",
    protagonistSummary:
      "社区医生沈知微理性克制、观察细致，长期失眠让她成为少数能看见删除过程的人。",
    protagonistGap: "她相信只有完整证据才值得行动，必须学会在证据消失前承担不确定的选择。",
    centralConflict: "公开异常会触发更快删除，保持沉默则会让每位病人在七天后失去社会存在。",
    antagonistForce: "自动修复异常人口的城市系统，以及利用系统掩盖旧实验的人类管理者。",
    longTermMystery: "凌晨病人为何都认识沈知微死去的妹妹，而她的死亡记录又为何有七个版本。",
    themeStatement: "人的存在不能被数据完整性决定，记住和作证本身就是一种救援。",
    targetReader: "喜欢本格线索、都市怪谈、职业细节和缓慢揭露阴谋的悬疑读者。",
    canonConstraints: ["每次结论必须有可回溯证据。", "隐藏真相不得出现在普通摘要。"],
  }),
  developmentPlan: mysteryPlan,
  invalidOutput: { candidates: [] },
};

const scienceFiction: AcceptanceSample = {
  id: "science-fiction",
  label: "科幻群像",
  idea: "一艘世代飞船即将抵达目的地，船上的五个阶层却分别收到了内容互相矛盾的登陆指令。",
  highConcepts: generateHighConceptsOutputSchema.parse({
    candidates: [
      candidate({
        title: "五份登陆令",
        logline: "世代飞船抵达新世界前夕，五个阶层收到互相排斥的登陆任务，被迫决定谁有资格下船。",
        genre: "硬科幻群像",
        coreHook: "每个阶层掌握一份真实但不完整的任务历史，只有合作才能拼出原始命令。",
        mainConflict: "维持飞船需要阶层协作，而每份指令都要求一个阶层牺牲其他人。",
        protagonistDrive: "五位代表分别守护家族、知识、生态、秩序与个人自由。",
        worldDifference: "飞船用信息隔离维持数百年稳定，社会身份决定一个人能知道哪段历史。",
      }),
      candidate({
        title: "抵达之前",
        logline: "登陆倒计时只剩三十天，年轻维修员发现目的地其实会移动并主动挑选殖民者。",
        genre: "太空悬疑",
        coreHook: "星球通过改变观测结果向不同人发送不同邀请，集体认知会改变航线。",
        mainConflict: "相信各自观测会撕裂飞船，统一观测又可能让全体错过真正入口。",
        protagonistDrive: "阻止父辈制造的阶层偏见成为新世界的第一条法律。",
        worldDifference: "目的地是能与观察者共同决定物理状态的行星级生命。",
      }),
      candidate({
        title: "最后一代船员",
        logline: "五名不同阶层的青年发现飞船从未离开太阳系，而登陆仪式只是一次代际服从测试。",
        genre: "社会科幻",
        coreHook: "飞船各区模拟不同重力和天空，让阶层相信彼此来自完全不同的世界。",
        mainConflict: "揭露真相会摧毁维生秩序，继续骗局则意味着下一代仍被困在封闭社会。",
        protagonistDrive: "亲眼看见没有舱壁和身份编号的真正天空。",
        worldDifference: "所谓星际航行是持续三百年的社会实验，外部文明一直旁观却不得干预。",
      }),
    ],
  }),
  selectedCandidateIndex: 0,
  coreCard: coreCard({
    title: "五份登陆令",
    genre: "硬科幻政治群像",
    logline: "世代飞船的五个阶层必须在登陆前拼合互相矛盾的任务，决定谁能成为新世界的人类。",
    readerPromise: "用可理解的工程限制推动群像博弈，让每次政治选择都改变登陆条件和人物关系。",
    worldviewSummary:
      "远航飞船以五个功能阶层维持生态，信息隔离曾保护任务，如今却成为登陆危机根源。",
    protagonistSummary:
      "五位主视角分别来自导航、生态、工程、档案和无籍层，没有任何一人掌握完整真相。",
    protagonistGap: "他们都把本阶层的生存误认为全体生存，必须学会共享权力与不完整信息。",
    centralConflict: "五份指令各自合理却无法同时执行，倒计时和维生故障迫使众人在真相前先作选择。",
    antagonistForce: "持续执行旧任务的自治系统，以及从信息垄断中获利的阶层领导者。",
    longTermMystery: "原始任务是否故意设计了五份冲突指令，用来筛选能够建立共同社会的船员。",
    themeStatement: "共同未来不是找到唯一正确命令，而是让承担后果的人共同书写规则。",
    targetReader: "喜欢太空工程约束、政治博弈、多视角人物和文明选择的科幻读者。",
    canonConstraints: ["五份指令都必须包含部分事实。", "技术限制不能被临时奇迹绕过。"],
  }),
  developmentPlan: scifiPlan,
  invalidOutput: { candidates: [{ title: "缺少群像结构" }] },
};

export const acceptanceSamples = [fantasy, mystery, scienceFiction] as const;

export const findSampleByIdea = (idea: string): AcceptanceSample =>
  acceptanceSamples.find((sample) => sample.idea === idea) ?? fantasy;
