"use client";
import { RoomProvider } from "@/app/liveblocks.config";
import PresencesAvatars from "@/components/PresenceAvatars";
import { RoomInfo } from "@liveblocks/node";
import Link from "next/link";

const BoardsTiles = ({ boards }: { baords: RoomInfo }) => {
  return (
    <>
      <div className="my-4 grid md:grid-cols-3 lg:grid-cols-4 gap-2">
        {boards.length > 0 &&
          boards.map((board) => (
            <Link
              className="bg-gray-200 px-8 py-12 rounded-md block relative"
              href={`/boards/${board.id}`}
              key={board.id}
            >
              {board.metadata.boardName}
              <div className="absolute bottom-1 right-1">
                <RoomProvider id={board.id} initialPresence={{}}>
                  <PresencesAvatars
                    presenseKey={"boardId"}
                    presenceValue={board.id}
                  />
                </RoomProvider>
              </div>
            </Link>
          ))}
      </div>
    </>
  );
};

export default BoardsTiles;
