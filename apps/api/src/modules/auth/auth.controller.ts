import { Body, Controller, Get, Inject, Post, Req, Res } from "@nestjs/common";
import type { Request, Response } from "express";
import {
  loginInputSchema,
  registerInputSchema,
  type AuthResponse,
  type LoginInput,
  type LogoutResponse,
  type RegisterInput,
} from "@agentos/shared";
import { ActorContextService } from "../../actor/actor-context.service";
import { ZodValidationPipe } from "../../common/zod-validation.pipe";
import { readEnvironment } from "../../config/env";
import { AuthService } from "./auth.service";
import { clearSessionCookie, readSessionToken, setSessionCookie } from "./session-cookie";

@Controller("auth")
export class AuthController {
  constructor(
    @Inject(AuthService) private readonly auth: AuthService,
    @Inject(ActorContextService) private readonly actorContext: ActorContextService,
  ) {}

  @Post("register")
  async register(
    @Body(new ZodValidationPipe(registerInputSchema)) input: RegisterInput,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthResponse> {
    const session = await this.auth.register(input);
    setSessionCookie(response, session.token, readEnvironment());
    return { success: true, data: { user: session.user } };
  }

  @Post("login")
  async login(
    @Body(new ZodValidationPipe(loginInputSchema)) input: LoginInput,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthResponse> {
    const session = await this.auth.login(input);
    setSessionCookie(response, session.token, readEnvironment());
    return { success: true, data: { user: session.user } };
  }

  @Post("logout")
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LogoutResponse> {
    const environment = readEnvironment();
    await this.auth.logout(readSessionToken(request.headers.cookie, environment));
    clearSessionCookie(response, environment);
    return { success: true, data: { authenticated: false } };
  }

  @Get("me")
  async me(): Promise<AuthResponse> {
    const actor = await this.actorContext.getCurrentActor();
    return { success: true, data: { user: await this.auth.getCurrentUser(actor.id) } };
  }
}
