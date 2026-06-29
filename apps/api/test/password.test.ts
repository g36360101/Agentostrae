import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "../src/modules/auth/password";

describe("password hashing", () => {
  it("uses a unique salt and verifies the original password", async () => {
    const first = await hashPassword("correct horse battery staple");
    const second = await hashPassword("correct horse battery staple");

    expect(first).not.toBe(second);
    await expect(verifyPassword("correct horse battery staple", first)).resolves.toBe(true);
    await expect(verifyPassword("wrong password", first)).resolves.toBe(false);
  });

  it("rejects malformed stored hashes", async () => {
    await expect(verifyPassword("any password", "not-a-valid-hash")).resolves.toBe(false);
  });
});
