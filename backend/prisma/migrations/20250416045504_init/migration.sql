/*
  Warnings:

  - A unique constraint covering the columns `[userId,gameName]` on the table `GameSession` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "GameSession_userId_gameName_key" ON "GameSession"("userId", "gameName");
