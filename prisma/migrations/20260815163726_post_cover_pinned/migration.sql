-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "cover" TEXT,
ADD COLUMN     "pinned" BOOLEAN NOT NULL DEFAULT false;
