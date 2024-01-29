import { Card, useMutation, useStorage } from "@/app/liveblocks.config";
import { CardType } from "@/components/Board";
import NewCardForm from "@/components/forms/NewCardForm";
import { shallow } from "@liveblocks/client";
import { FormEvent, useState } from "react";
import { ReactSortable } from "react-sortablejs";

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
        {!renameMode && <h3 onClick={() => setRenameMode(true)}>{name}</h3>}
        {renameMode && (
          <form onSubmit={handleRenameSubmit}>
            <input type="text" defaultValue={name} />
          </form>
        )}
      </div>
      {columnCards && (
        <>
          <ReactSortable
            list={columnCards}
            setList={(items) => setTaskOrderForColumn(items, id)}
            group="cards"
            className="min-h-12"
            ghostClass="opacity-40"
          >
            {columnCards.map((card) => (
              <div
                key={card.id}
                className="border bg-white my-2 p-4 rounded-md"
              >
                <span> {card.name} </span>
              </div>
            ))}
          </ReactSortable>
        </>
      )}
      <NewCardForm columnId={id} />
    </div>
  );
}
