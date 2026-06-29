import { Module } from "@nestjs/common";
import {
  DevelopmentPlansController,
  DevelopmentPlanVersionsController,
} from "./development-plans.controller";
import { DevelopmentPlansService } from "./development-plans.service";
import { AiOrchestratorModule } from "../ai-orchestrator/ai-orchestrator.module";

@Module({
  imports: [AiOrchestratorModule],
  controllers: [DevelopmentPlansController, DevelopmentPlanVersionsController],
  providers: [DevelopmentPlansService],
})
export class DevelopmentPlansModule {}
