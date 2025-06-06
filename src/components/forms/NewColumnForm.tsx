"use client";

import { Column, useMutation } from "@/app/liveblocks.config";
import { LiveObject } from "@liveblocks/client";
import { FormEvent } from "react";
import uniqid from "uniqid";

export default function NewColumnForm() {
  const addColumn = useMutation(({ storage }, columnName) => {
    return storage.get("columns").push(
      new LiveObject<Column>({
        name: columnName,
        id: uniqid.time(),
        index: 9999,
      })
    );
  }, []);

  function handleNewColumn(ev: FormEvent) {
    ev.preventDefault();
    const input = (ev.target as HTMLFormElement).querySelector("input");
    if (input) {
      const columnName = input?.value;
      addColumn(columnName);
      input.value = "";
    }
  }
  return (
    <form onSubmit={handleNewColumn} className="max-w-xs">
      <label className="block">
        <span className="text-gray-600 block">Column name:</span>
      </label>
      <input type="text" placeholder="new column name" />
      <button className="mt-2 block w-full" type="submit">
        create column
      </button>
    </form>
  );
}
