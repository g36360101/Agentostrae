import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from "@nestjs/common";
import { ActorContextService } from "../../actor/actor-context.service";
import { ChatService } from "./chat.service";
import { sendChatMessageInputSchema } from "@agentos/shared";

@Controller("projects/:projectId/chat")
export class ChatController {
  constructor(
    private readonly chat: ChatService,
    private readonly actorContext: ActorContextService,
  ) {}

  @Post()
  async sendMessage(
    @Param("projectId") projectId: string,
    @Body() rawBody: unknown,
  ) {
    const actor = await this.actorContext.getCurrentActor();
    const body = sendChatMessageInputSchema.parse(rawBody);
    const result = await this.chat.sendMessage(projectId, body, actor);
    if (!result) {
      throw new NotFoundException({
        code: "PROJECT_NOT_FOUND",
        message: "项目不存在或无权访问",
      });
    }
    return { data: result };
  }

  @Get("messages")
  async listMessages(@Param("projectId") projectId: string) {
    const actor = await this.actorContext.getCurrentActor();
    const messages = await this.chat.listMessages(projectId, actor);
    if (messages === null) {
      throw new NotFoundException({
        code: "PROJECT_NOT_FOUND",
        message: "项目不存在或无权访问",
      });
    }
    return { data: messages };
  }
}
