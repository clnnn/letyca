-- CreateTable
CREATE TABLE "Widget" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "connectionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "Widget_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Widget" ADD CONSTRAINT "Widget_connectionId_fkey" FOREIGN KEY ("connectionId") REFERENCES "Connection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
