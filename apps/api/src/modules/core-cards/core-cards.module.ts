import { Module } from "@nestjs/common";
import { CoreCardsController } from "./core-cards.controller";
import { CoreCardsService } from "./core-cards.service";
import { AiOrchestratorModule } from "../ai-orchestrator/ai-orchestrator.module";

@Module({
  imports: [AiOrchestratorModule],
  controllers: [CoreCardsController],
  providers: [CoreCardsService],
})
export class CoreCardsModule {}
