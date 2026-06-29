-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('draft', 'active', 'archived');

-- CreateEnum
CREATE TYPE "AiTaskType" AS ENUM ('generate_high_concepts', 'generate_core_card');

-- CreateEnum
CREATE TYPE "AiJobStatus" AS ENUM ('pending', 'running', 'succeeded', 'failed');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" VARCHAR(320) NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" UUID NOT NULL,
    "owner_id" UUID NOT NULL,
    "title" VARCHAR(120) NOT NULL,
    "genre" VARCHAR(80),
    "premise" TEXT,
    "status" "ProjectStatus" NOT NULL DEFAULT 'draft',
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_ideas" (
    "id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "raw_text" TEXT NOT NULL,
    "genre_preference" VARCHAR(80),
    "reader_expectation" TEXT,
    "taboo_notes" TEXT,
    "reference_vibe" TEXT,
    "ai_creativity_level" DOUBLE PRECISION NOT NULL DEFAULT 0.7,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "project_ideas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "high_concept_candidates" (
    "id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "idea_id" UUID NOT NULL,
    "ai_job_id" UUID NOT NULL,
    "title" VARCHAR(120) NOT NULL,
    "logline" TEXT NOT NULL,
    "genre" VARCHAR(80) NOT NULL,
    "core_hook" TEXT NOT NULL,
    "main_conflict" TEXT NOT NULL,
    "protagonist_drive" TEXT NOT NULL,
    "world_difference" TEXT NOT NULL,
    "emotional_promise" TEXT NOT NULL,
    "target_reader" TEXT NOT NULL,
    "serialization_potential" TEXT NOT NULL,
    "expansion_direction" TEXT NOT NULL,
    "risk_notes" JSONB NOT NULL,
    "is_selected" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "high_concept_candidates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_core_cards" (
    "id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "source_candidate_id" UUID NOT NULL,
    "title" VARCHAR(120) NOT NULL,
    "genre" VARCHAR(80) NOT NULL,
    "logline" TEXT NOT NULL,
    "reader_promise" TEXT NOT NULL,
    "worldview_summary" TEXT NOT NULL,
    "protagonist_summary" TEXT NOT NULL,
    "protagonist_gap" TEXT NOT NULL,
    "central_conflict" TEXT NOT NULL,
    "antagonist_force" TEXT NOT NULL,
    "long_term_mystery" TEXT NOT NULL,
    "theme_statement" TEXT NOT NULL,
    "target_reader" TEXT NOT NULL,
    "canon_constraints" JSONB NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "project_core_cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_jobs" (
    "id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "task_type" "AiTaskType" NOT NULL,
    "status" "AiJobStatus" NOT NULL DEFAULT 'pending',
    "provider" VARCHAR(80) NOT NULL,
    "model" VARCHAR(120) NOT NULL,
    "input_json" JSONB NOT NULL,
    "output_json" JSONB,
    "error_message" TEXT,
    "token_usage" INTEGER,
    "completed_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "ai_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "projects_owner_id_idx" ON "projects"("owner_id");

-- CreateIndex
CREATE INDEX "project_ideas_project_id_idx" ON "project_ideas"("project_id");

-- CreateIndex
CREATE INDEX "high_concept_candidates_project_id_idx" ON "high_concept_candidates"("project_id");

-- CreateIndex
CREATE INDEX "high_concept_candidates_idea_id_idx" ON "high_concept_candidates"("idea_id");

-- CreateIndex
CREATE INDEX "high_concept_candidates_ai_job_id_idx" ON "high_concept_candidates"("ai_job_id");

-- CreateIndex
CREATE INDEX "project_core_cards_source_candidate_id_idx" ON "project_core_cards"("source_candidate_id");

-- CreateIndex
CREATE UNIQUE INDEX "project_core_cards_project_id_version_key" ON "project_core_cards"("project_id", "version");

-- CreateIndex
CREATE INDEX "ai_jobs_project_id_idx" ON "ai_jobs"("project_id");

-- CreateIndex
CREATE INDEX "ai_jobs_status_idx" ON "ai_jobs"("status");

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_ideas" ADD CONSTRAINT "project_ideas_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "high_concept_candidates" ADD CONSTRAINT "high_concept_candidates_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "high_concept_candidates" ADD CONSTRAINT "high_concept_candidates_idea_id_fkey" FOREIGN KEY ("idea_id") REFERENCES "project_ideas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "high_concept_candidates" ADD CONSTRAINT "high_concept_candidates_ai_job_id_fkey" FOREIGN KEY ("ai_job_id") REFERENCES "ai_jobs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_core_cards" ADD CONSTRAINT "project_core_cards_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_core_cards" ADD CONSTRAINT "project_core_cards_source_candidate_id_fkey" FOREIGN KEY ("source_candidate_id") REFERENCES "high_concept_candidates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_jobs" ADD CONSTRAINT "ai_jobs_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
