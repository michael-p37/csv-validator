-- CreateEnum
CREATE TYPE "UploadStatus" AS ENUM ('PENDING', 'VALIDATED', 'COMPLETED');

-- CreateTable
CREATE TABLE "UploadJob" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploadedBy" INTEGER NOT NULL,
    "status" "UploadStatus" NOT NULL,

    CONSTRAINT "UploadJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UploadRow" (
    "id" TEXT NOT NULL,
    "uploadJobId" TEXT NOT NULL,
    "rowNumber" INTEGER NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "age" INTEGER,
    "isValid" BOOLEAN NOT NULL DEFAULT false,
    "errors" JSONB,

    CONSTRAINT "UploadRow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Person" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Person_email_key" ON "Person"("email");

-- AddForeignKey
ALTER TABLE "UploadJob" ADD CONSTRAINT "UploadJob_uploadedBy_fkey" FOREIGN KEY ("uploadedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UploadRow" ADD CONSTRAINT "UploadRow_uploadJobId_fkey" FOREIGN KEY ("uploadJobId") REFERENCES "UploadJob"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
