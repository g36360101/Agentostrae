import { Module } from "@nestjs/common";
import { ActorModule } from "./actor/actor.module";
import { DatabaseModule } from "./database/database.module";
import { HealthModule } from "./health/health.module";
import { AiOrchestratorModule } from "./modules/ai-orchestrator/ai-orchestrator.module";
import { AuthModule } from "./modules/auth/auth.module";
import { CoreCardsModule } from "./modules/core-cards/core-cards.module";
import { DevelopmentPlansModule } from "./modules/development-plans/development-plans.module";
import { IdeasModule } from "./modules/ideas/ideas.module";
import { HighConceptsModule } from "./modules/high-concepts/high-concepts.module";
import { ProjectsModule } from "./modules/projects/projects.module";
import { ReviewModule } from "./modules/review/review.module";

@Module({
  imports: [
    DatabaseModule,
    ActorModule,
    AuthModule,
    HealthModule,
    ProjectsModule,
    IdeasModule,
    HighConceptsModule,
    CoreCardsModule,
    DevelopmentPlansModule,
    ReviewModule,
    AiOrchestratorModule,
  ],
})
export class AppModule {}
