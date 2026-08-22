-- CreateTable
CREATE TABLE "WalletTally" (
    "walletHash" TEXT NOT NULL,
    "mints" TEXT[],
    "holdingsUsd" DECIMAL(20,2) NOT NULL,
    "zakatDueUsd" DECIMAL(20,2) NOT NULL,
    "firstScannedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastScannedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WalletTally_pkey" PRIMARY KEY ("walletHash")
);
