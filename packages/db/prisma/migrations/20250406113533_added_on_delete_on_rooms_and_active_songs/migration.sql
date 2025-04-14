-- DropForeignKey
ALTER TABLE "ActiveSong" DROP CONSTRAINT "ActiveSong_roomId_fkey";

-- AddForeignKey
ALTER TABLE "ActiveSong" ADD CONSTRAINT "ActiveSong_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
