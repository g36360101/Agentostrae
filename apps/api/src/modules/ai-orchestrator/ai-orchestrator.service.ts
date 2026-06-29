import { Injectable } from "@nestjs/common";
import { MockAiProvider } from "@agentos/ai-core";

@Injectable()
export class AiOrchestratorService {
  readonly provider = new MockAiProvider();
}
