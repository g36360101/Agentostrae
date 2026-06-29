import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

const KEY_LENGTH = 64;
const COST = 16_384;
const BLOCK_SIZE = 8;
const PARALLELIZATION = 1;
const MAX_MEMORY = 64 * 1024 * 1024;

export const hashPassword = async (password: string): Promise<string> => {
  const salt = randomBytes(16);
  const derivedKey = await deriveKey(password, salt, COST, BLOCK_SIZE, PARALLELIZATION);

  return [
    "scrypt",
    COST,
    BLOCK_SIZE,
    PARALLELIZATION,
    salt.toString("hex"),
    derivedKey.toString("hex"),
  ].join("$");
};

export const verifyPassword = async (password: string, storedHash: string): Promise<boolean> => {
  const [algorithm, costValue, blockSizeValue, parallelizationValue, saltHex, hashHex] =
    storedHash.split("$");

  if (
    algorithm !== "scrypt" ||
    !costValue ||
    !blockSizeValue ||
    !parallelizationValue ||
    !saltHex ||
    !hashHex
  ) {
    return false;
  }

  const expected = Buffer.from(hashHex, "hex");
  if (expected.length !== KEY_LENGTH) {
    return false;
  }

  try {
    const actual = await deriveKey(
      password,
      Buffer.from(saltHex, "hex"),
      Number(costValue),
      Number(blockSizeValue),
      Number(parallelizationValue),
    );
    return timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
};

const deriveKey = async (
  password: string,
  salt: Buffer,
  cost: number,
  blockSize: number,
  parallelization: number,
): Promise<Buffer> =>
  new Promise((resolve, reject) => {
    scrypt(
      password,
      salt,
      KEY_LENGTH,
      { cost, blockSize, parallelization, maxmem: MAX_MEMORY },
      (error, derivedKey) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(derivedKey);
      },
    );
  });
