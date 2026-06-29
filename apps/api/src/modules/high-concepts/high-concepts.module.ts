import { Module } from "@nestjs/common";
import { HighConceptsController } from "./high-concepts.controller";
import { HighConceptsService } from "./high-concepts.service";
import { AiOrchestratorModule } from "../ai-orchestrator/ai-orchestrator.module";

@Module({
  imports: [AiOrchestratorModule],
  controllers: [HighConceptsController],
  providers: [HighConceptsService],
})
export class HighConceptsModule {}
