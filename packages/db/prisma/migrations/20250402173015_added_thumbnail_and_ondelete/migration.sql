/*
  Warnings:

  - Added the required column `thumbnail` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thumbnail` to the `SongEntry` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ActiveSong" DROP CONSTRAINT "ActiveSong_songId_fkey";

-- DropForeignKey
ALTER TABLE "SongEntry" DROP CONSTRAINT "SongEntry_roomId_fkey";

-- DropForeignKey
ALTER TABLE "Upvote" DROP CONSTRAINT "Upvote_songEntryId_fkey";

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "thumbnail" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SongEntry" ADD COLUMN     "thumbnail" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "SongEntry" ADD CONSTRAINT "SongEntry_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Upvote" ADD CONSTRAINT "Upvote_songEntryId_fkey" FOREIGN KEY ("songEntryId") REFERENCES "SongEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActiveSong" ADD CONSTRAINT "ActiveSong_songId_fkey" FOREIGN KEY ("songId") REFERENCES "SongEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
