-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "PremiumUnlock" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "signature" TEXT NOT NULL,
    "payer" TEXT NOT NULL,
    "lamports" BIGINT NOT NULL,
    "paidAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PremiumUnlock_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PremiumUnlock_signature_key" ON "PremiumUnlock"("signature");

-- CreateIndex
CREATE INDEX "PremiumUnlock_address_idx" ON "PremiumUnlock"("address");
