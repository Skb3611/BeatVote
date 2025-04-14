-- CreateEnum
CREATE TYPE "RoomType" AS ENUM ('PUBLIC', 'PRIVATE');

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "password" TEXT,
ADD COLUMN     "type" "RoomType" NOT NULL DEFAULT 'PUBLIC';
