import { Module } from "@nestjs/common";
import { AssetsController, RelationsController } from "./review.controller";
import { ReviewService } from "./review.service";
import { AiOrchestratorModule } from "../ai-orchestrator/ai-orchestrator.module";

@Module({
  imports: [AiOrchestratorModule],
  controllers: [AssetsController, RelationsController],
  providers: [ReviewService],
})
export class ReviewModule {}
