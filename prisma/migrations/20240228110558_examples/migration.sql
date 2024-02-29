-- CreateTable
CREATE TABLE "QueryExample" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "connectionId" TEXT NOT NULL,

    CONSTRAINT "QueryExample_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "QueryExample" ADD CONSTRAINT "QueryExample_connectionId_fkey" FOREIGN KEY ("connectionId") REFERENCES "Connection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
