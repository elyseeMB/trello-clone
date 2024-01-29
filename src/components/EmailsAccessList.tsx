"use client";

import { removeEmailFromBoard } from "@/app/actions/boardAction";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RoomAccesses } from "@liveblocks/node";
import { useRouter } from "next/navigation";

export default function EmailsAccessList({
  boardId,
  usersAccesses,
}: {
  boardId: string;
  usersAccesses: RoomAccesses;
}) {
  const router = useRouter();

  async function handleDelete(emailToDelete: string) {
    await removeEmailFromBoard(boardId, emailToDelete);
    router.refresh();
  }

  return (
    <div className="max-w-sm">
      {Object.keys(usersAccesses).map((email) => (
        <div
          key={email}
          className="flex 
          gap-2 my-4 items-center 
          max-w-sm justify-between
          border rounded-lg pl-4
          "
        >
          {email}
          <button className="btn p-1" onClick={() => handleDelete(email)}>
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      ))}
    </div>
  );
}
