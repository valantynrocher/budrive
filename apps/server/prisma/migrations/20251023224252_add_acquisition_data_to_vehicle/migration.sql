-- AlterTable
ALTER TABLE "public"."Vehicle" ADD COLUMN     "estimated_annual_mileage" INTEGER,
ADD COLUMN     "initial_mileage" INTEGER,
ADD COLUMN     "purchase_date" TIMESTAMP(3),
ADD COLUMN     "purchase_price" DOUBLE PRECISION;
