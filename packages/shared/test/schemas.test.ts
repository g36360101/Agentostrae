import { describe, expect, it } from "vitest";
import {
  createProjectInputSchema,
  generateHighConceptsOutputSchema,
  highConceptCandidateContentSchema,
  loginInputSchema,
  registerInputSchema,
  updateProjectInputSchema,
} from "../src";

const validCandidate = {
  title: "天道草稿",
  logline: "失忆修仙者发现自己是被天道删除的草稿，并决定夺回被抹去的人生。",
  genre: "玄幻悬疑",
  coreHook: "主角每恢复一段记忆，现实就会重写一条修仙规则。",
  mainConflict: "主角必须在找回自我与维持世界稳定之间作出选择。",
  protagonistDrive: "找出自己为何被删除，并证明被判定失败的人生仍有价值。",
  worldDifference: "世界法则是可编辑文本，修士修炼的本质是争夺解释权。",
  emotionalPromise: "持续揭谜、逆天改命，以及被否定者重新定义自身价值的满足感。",
  targetReader: "喜欢升级流、规则系能力和长线谜团的读者。",
  serializationPotential: "每个境界对应一层被隐藏的世界版本，可持续展开规则冲突。",
  expansionDirection: "从个人身世谜团扩展到不同版本世界之间的存亡争夺。",
  riskNotes: ["规则设定需要保持清晰，避免谜团长期不兑现。"],
};

describe("shared schemas", () => {
  it("accepts a valid project input", () => {
    expect(createProjectInputSchema.parse({ title: "天道草稿" })).toEqual({
      title: "天道草稿",
    });
  });

  it("requires at least one project update field", () => {
    expect(() => updateProjectInputSchema.parse({})).toThrow();
    expect(updateProjectInputSchema.parse({ status: "active" })).toEqual({ status: "active" });
  });

  it("normalizes email and enforces password length", () => {
    const input = registerInputSchema.parse({
      email: "  Author@Example.COM ",
      name: "作者",
      password: "long-enough-password",
    });

    expect(input.email).toBe("author@example.com");
    expect(() =>
      loginInputSchema.parse({ email: "author@example.com", password: "short" }),
    ).toThrow();
  });

  it("rejects an incomplete high concept", () => {
    expect(() => highConceptCandidateContentSchema.parse({ title: "只有标题" })).toThrow();
  });

  it("requires at least three high concept candidates", () => {
    expect(() =>
      generateHighConceptsOutputSchema.parse({ candidates: [validCandidate] }),
    ).toThrow();
  });
});
