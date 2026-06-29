import { Inject, Injectable, Scope, UnauthorizedException } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import type { Request } from "express";
import { PrismaService } from "../database/prisma.service";
import { parseSessionToken } from "../modules/auth/session-cookie";
import { readEnvironment } from "../config/env";

export interface Actor {
  id: string;
}

@Injectable({ scope: Scope.REQUEST })
export class ActorContextService {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    @Inject(PrismaService) private readonly prisma: PrismaService,
  ) {}

  async getCurrentActor(): Promise<Actor> {
    const environment = readEnvironment();
    if (environment.AUTH_MODE === "demo") {
      return { id: environment.DEMO_ACTOR_ID };
    }

    const tokenHash = parseSessionToken(this.request.headers.cookie, environment);
    if (!tokenHash) {
      throw unauthorized();
    }

    const session = await this.prisma.session.findUnique({
      where: { tokenHash },
      select: { userId: true, expiresAt: true },
    });

    if (!session || session.expiresAt <= new Date()) {
      throw unauthorized();
    }

    return { id: session.userId };
  }
}

const unauthorized = (): UnauthorizedException =>
  new UnauthorizedException({
    code: "UNAUTHORIZED",
    message: "Authentication required",
  });
