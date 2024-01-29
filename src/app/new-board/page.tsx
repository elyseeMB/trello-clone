"use client";

import { createBoard } from "@/app/actions/boardAction";
import { redirect } from "next/navigation";

export default function NewBoardPage() {
  async function handleNewBoardSubmit(formDate: FormData) {
    const boardName = formDate.get("name")?.toString() || "";
    const { id } = await createBoard(boardName);
    redirect(`/boards/${id}`);
  }
  return (
    <div>
      <form action={handleNewBoardSubmit} className="max-w-sm bloxk">
        <h1 className="text-2xl mb-4">Create new boards</h1>
        <input type="text" name="name" placeholder="board name" />
        <button type="submit" className="mt-2 w-full">
          Create boards
        </button>
      </form>
    </div>
  );
}
