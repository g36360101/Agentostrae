import { ConflictException, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { Prisma, type User } from "@agentos/db";
import type { CurrentUser, LoginInput, RegisterInput } from "@agentos/shared";
import { PrismaService } from "../../database/prisma.service";
import { hashPassword, verifyPassword } from "./password";
import { createSessionToken, hashSessionToken, sessionExpiry } from "./session-cookie";
import { readEnvironment } from "../../config/env";

export interface AuthenticatedSession {
  token: string;
  user: CurrentUser;
}

@Injectable()
export class AuthService {
  private dummyPasswordHash: Promise<string> | undefined;

  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async register(input: RegisterInput): Promise<AuthenticatedSession> {
    const passwordHash = await hashPassword(input.password);
    const token = createSessionToken();
    const environment = readEnvironment();

    try {
      const user = await this.prisma.$transaction(async (transaction) => {
        const createdUser = await transaction.user.create({
          data: {
            email: input.email.toLowerCase(),
            name: input.name,
            passwordHash,
          },
        });
        await transaction.session.create({
          data: {
            userId: createdUser.id,
            tokenHash: hashSessionToken(token),
            expiresAt: sessionExpiry(environment),
          },
        });
        return createdUser;
      });

      return { token, user: toCurrentUser(user) };
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new ConflictException({
          code: "EMAIL_ALREADY_REGISTERED",
          message: "An account with this email already exists",
        });
      }
      throw error;
    }
  }

  async login(input: LoginInput): Promise<AuthenticatedSession> {
    const user = await this.prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
    });

    const passwordMatches = user
      ? await verifyPassword(input.password, user.passwordHash)
      : await verifyPassword(input.password, await this.getDummyPasswordHash());

    if (!user || !passwordMatches) {
      throw invalidCredentials();
    }

    const token = createSessionToken();
    const environment = readEnvironment();
    await this.prisma.session.create({
      data: {
        userId: user.id,
        tokenHash: hashSessionToken(token),
        expiresAt: sessionExpiry(environment),
      },
    });

    return { token, user: toCurrentUser(user) };
  }

  async logout(token: string | undefined): Promise<void> {
    if (!token) {
      return;
    }
    await this.prisma.session.deleteMany({
      where: { tokenHash: hashSessionToken(token) },
    });
  }

  async getCurrentUser(userId: string): Promise<CurrentUser> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException({
        code: "UNAUTHORIZED",
        message: "Authentication required",
      });
    }
    return toCurrentUser(user);
  }

  private getDummyPasswordHash(): Promise<string> {
    this.dummyPasswordHash ??= hashPassword("invalid-credential-placeholder");
    return this.dummyPasswordHash;
  }
}

const toCurrentUser = (user: User): CurrentUser => ({
  id: user.id,
  email: user.email,
  name: user.name,
  createdAt: user.createdAt.toISOString(),
  updatedAt: user.updatedAt.toISOString(),
});

const invalidCredentials = (): UnauthorizedException =>
  new UnauthorizedException({
    code: "INVALID_CREDENTIALS",
    message: "Email or password is incorrect",
  });
