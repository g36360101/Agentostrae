-- CreateTable
CREATE TABLE "development_plans" (
    "id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "source_core_card_id" UUID NOT NULL,
    "ai_job_id" UUID NOT NULL,
    "content_markdown" TEXT NOT NULL,
    "structured_json" JSONB NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "development_plans_pkey" PRIMARY KEY ("id")
);

-- AlterEnum
ALTER TYPE "AiTaskType" ADD VALUE 'generate_development_plan';

-- CreateIndex
CREATE INDEX "development_plans_source_core_card_id_idx" ON "development_plans"("source_core_card_id");

-- CreateIndex
CREATE UNIQUE INDEX "development_plans_project_id_version_key" ON "development_plans"("project_id", "version");

-- AddForeignKey
ALTER TABLE "development_plans" ADD CONSTRAINT "development_plans_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "development_plans" ADD CONSTRAINT "development_plans_ai_job_id_fkey" FOREIGN KEY ("ai_job_id") REFERENCES "ai_jobs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
