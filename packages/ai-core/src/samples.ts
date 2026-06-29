import {
  coreCardContentSchema,
  generateHighConceptsOutputSchema,
  type CoreCardContent,
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
  invalidOutput: { candidates: [{ title: "缺少群像结构" }] },
};

export const acceptanceSamples = [fantasy, mystery, scienceFiction] as const;

export const findSampleByIdea = (idea: string): AcceptanceSample =>
  acceptanceSamples.find((sample) => sample.idea === idea) ?? fantasy;
