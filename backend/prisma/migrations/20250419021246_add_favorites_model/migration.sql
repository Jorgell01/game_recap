/*
  Warnings:

  - You are about to drop the column `image` on the `Favorite` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Favorite` table. All the data in the column will be lost.
  - Added the required column `coverUrl` to the `Favorite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gameName` to the `Favorite` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Favorite" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "gameId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "gameName" TEXT NOT NULL,
    "coverUrl" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Favorite" ("gameId", "id", "userId") SELECT "gameId", "id", "userId" FROM "Favorite";
DROP TABLE "Favorite";
ALTER TABLE "new_Favorite" RENAME TO "Favorite";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
