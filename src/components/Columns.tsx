"use client";
import { Column, useMutation, useStorage } from "@/app/liveblocks.config";
import NewColumnForm from "@/components/forms/NewColumnForm";
import { ReactSortable } from "react-sortablejs";
import { default as BoardColumn } from "@/components/Column";
import { LiveList, LiveObject, shallow } from "@liveblocks/client";

function Columns() {
  const columns = useStorage(
    (root) => root.columns.map((c) => ({ ...c })),
    shallow
  );

  const updateColumns = useMutation(
    ({ storage }, columns: LiveObject<Column>[]) => {
      storage.set("columns", new LiveList(columns));
    },
    []
  );

  function setColumnsOrder(sortedColumns: Column[]) {
    const newColumns: LiveObject<Column>[] = [];
    sortedColumns.forEach((sortedColumn, newIndex) => {
      const newSortedColumn = { ...sortedColumn };
      newSortedColumn.index = newIndex;
      newColumns.push(new LiveObject(newSortedColumn));
    });
    updateColumns(newColumns);
  }

  if (!columns) {
    return;
  }

  return (
    <div className="gap-4 grid md:grid-cols-2 lg:grid-cols-2 ">
      <ReactSortable
        list={columns}
        setList={setColumnsOrder}
        group={"board-column"}
        className="flex gap-2"
        ghostClass="opacity-40"
      >
        {columns?.length > 0 &&
          columns.map((column) => <BoardColumn key={column.id} {...column} />)}
      </ReactSortable>
      <NewColumnForm />
    </div>
  );
}

export default Columns;
