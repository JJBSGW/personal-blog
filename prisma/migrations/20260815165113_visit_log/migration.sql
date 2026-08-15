-- CreateTable
CREATE TABLE "VisitLog" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "ip" TEXT,
    "userAgent" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VisitLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "VisitLog_date_idx" ON "VisitLog"("date");

-- CreateIndex
CREATE INDEX "VisitLog_ip_date_idx" ON "VisitLog"("ip", "date");
