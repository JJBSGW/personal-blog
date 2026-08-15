-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "ip" TEXT,
ADD COLUMN     "userAgent" TEXT;

-- CreateIndex
CREATE INDEX "Comment_postId_createdAt_idx" ON "Comment"("postId", "createdAt");
