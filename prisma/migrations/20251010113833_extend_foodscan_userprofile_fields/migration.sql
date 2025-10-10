-- AlterTable
ALTER TABLE "FoodScan" ADD COLUMN     "allergens" TEXT[],
ADD COLUMN     "ingredients" TEXT[],
ADD COLUMN     "nutritionSummary" TEXT,
ADD COLUMN     "reasoning" TEXT,
ADD COLUMN     "recommendation" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "dietType" TEXT,
ADD COLUMN     "medicalHistory" TEXT[];
