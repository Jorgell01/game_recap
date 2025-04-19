-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT,
    "email" TEXT,
    "password" TEXT,
    "steamId" TEXT
);

-- CreateTable
CREATE TABLE "GameSession" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "gameName" TEXT NOT NULL,
    "playTime" INTEGER NOT NULL,
    "lastPlayed" DATETIME,
    CONSTRAINT "GameSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Review" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "gameId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_steamId_key" ON "User"("steamId");

-- CreateIndex
CREATE UNIQUE INDEX "GameSession_userId_gameName_key" ON "GameSession"("userId", "gameName");
