import { Card, useMutation, useStorage } from "@/app/liveblocks.config";
import { CardType } from "@/components/Board";
import NewCardForm from "@/components/forms/NewCardForm";
import { default as ColumnCard } from "@/components/Card";
import {
  faClose,
  faEllipsis,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { shallow } from "@liveblocks/client";
import { FormEvent, useState } from "react";
import { ReactSortable } from "react-sortablejs";
import CancelButton from "@/components/CancelButton";

type ColumnProps = {
  id: string;
  name: string;
};

export default function Column({ id, name }: ColumnProps) {
  const [renameMode, setRenameMode] = useState(false);

  const columnCards = useStorage<CardType[]>((root) => {
    return root.cards
      .filter((card) => card.columnId === id)
      .map((c) => ({ ...c }))
      .sort((a, b) => a.index - b.index);
  }, shallow);

  const updateCard = useMutation(({ storage }, index, updateData) => {
    const card = storage.get("cards").get(index);
    if (card) {
      for (let key in updateData) {
        card.set(key as keyof Card, updateData[key]);
      }
    }
  }, []);

  const updateColumn = useMutation(({ storage }, id, newName) => {
    const columns = storage.get("columns");
    columns.find((c) => c.toObject().id === id)?.set("name", newName);
  }, []);

  const deleteColumn = useMutation(({ storage }, id) => {
    const columns = storage.get("columns");
    const columnIndex = columns.findIndex((c) => c.toObject().id === id);
    columns.delete(columnIndex);
  }, []);

  const setTaskOrderForColumn = useMutation(
    ({ storage }, sortedCards: Card[], newColumnId) => {
      const idOfSortedCards = sortedCards.map((c) => c.id.toString());
      const allCards: Card[] = [
        ...storage.get("cards").map((c) => c.toObject()),
      ];
      idOfSortedCards.forEach((sortedCardId, colIndex) => {
        const cardStorageIndex = allCards.findIndex(
          (c) => c.id.toString() === sortedCardId
        );
        updateCard(cardStorageIndex, {
          columnId: newColumnId,
          index: colIndex,
        });
      });
    },
    []
  );

  function handleRenameSubmit(ev: FormEvent) {
    ev.preventDefault();
    const input = (ev.target as HTMLInputElement).querySelector("input");
    if (input) {
      const newColumnName = input.value;
      updateColumn(id, newColumnName);
      setRenameMode(false);
      input.value = "";
    }
  }

  return (
    <div className="w-48 shadow-sm rounded-md p-2 bg-white">
      <div>
        {!renameMode && (
          <div className="flex justify-between">
            <h3>{name}</h3>
            <button
              onClick={() => setRenameMode(true)}
              className="text-gray-300"
            >
              <FontAwesomeIcon icon={faEllipsis} />
            </button>
          </div>
        )}
        {renameMode && (
          <div className="mb-8">
            Edit name:
            <form className="mb-2" onSubmit={handleRenameSubmit}>
              <input type="text" defaultValue={name} />
              <button type="submit" className="w-full mt-2">
                Save
              </button>
            </form>
            <hr />
            <button
              onClick={() => deleteColumn(id)}
              className="bg-red-500 p-2 text-white justify-center 
            rounded-md flex gap-2 w-full items-center"
            >
              <FontAwesomeIcon icon={faTrash} />
              Delete column
            </button>
            <CancelButton onClick={() => setRenameMode(false)} />
          </div>
        )}
      </div>
      {!renameMode && columnCards && (
        <>
          <ReactSortable
            list={columnCards}
            setList={(items) => setTaskOrderForColumn(items, id)}
            group="cards"
            className="min-h-12"
            ghostClass="opacity-40"
          >
            {columnCards.map((card) => (
              <ColumnCard
                key={card.id}
                id={card.id.toString()}
                name={card.name.toString()}
              />
            ))}
          </ReactSortable>
        </>
      )}

      {!renameMode && <NewCardForm columnId={id} />}
    </div>
  );
}
