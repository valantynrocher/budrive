-- CreateEnum
CREATE TYPE "public"."OnboardingStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED');

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "onboardingStatus" "public"."OnboardingStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "onboardingStep" INTEGER NOT NULL DEFAULT 0;
