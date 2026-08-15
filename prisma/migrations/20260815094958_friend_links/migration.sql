-- CreateTable
CREATE TABLE "FriendLink" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "sort" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FriendLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FriendLink_sort_idx" ON "FriendLink"("sort");
