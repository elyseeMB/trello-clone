import { Card, useMutation, useStorage } from "@/app/liveblocks.config";
import { BoardContext, BoardContextProps } from "@/components/BoardContext";
import CancelButton from "@/components/CancelButton";
import CardDescription from "@/components/CardDescription";
import DeleteWithConfirmation from "@/components/DeleteWithConfirmation";
import {
  faEllipsis,
  faFileLines,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { shallow } from "@liveblocks/client";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useContext, useEffect, useState } from "react";

export default function CardModal() {
  const router = useRouter();
  const params = useParams();
  const { setOpenCard } = useContext<BoardContextProps>(BoardContext);
  const [editMode, setEditMode] = useState(false);

  const card = useStorage((root) => {
    return root.cards.find((c) => c.id === params.cardId);
  }, shallow);

  const updateCard = useMutation(({ storage }, cardId, updateData) => {
    const cards = storage.get("cards").map((c) => c.toObject());
    const index = cards.findIndex((c) => c.id === cardId);
    const card = storage.get("cards").get(index);
    for (let updateKey in updateData) {
      card?.set(updateKey as keyof Card, updateData[updateKey]);
    }
  }, []);

  const deleteCard = useMutation(({ storage }, id) => {
    const cards = storage.get("cards");
    const cardIndex = cards.findIndex((c) => c.toObject().id === id);
    cards.delete(cardIndex);
  }, []);

  useEffect(() => {
    if (params.cardId && setOpenCard) {
      setOpenCard(params.cardId.toString());
    }
  }, [params]);

  function handleDelete() {
    deleteCard(params.cardId);
    if (setOpenCard) {
      setOpenCard(null);
    }
    router.back();
  }

  function handleBackdropClick() {
    if (params.cardId && setOpenCard) {
      setOpenCard(params.cardId.toString());
    }
    router.back();
  }

  function handleNameChangeSubmit(ev: FormEvent) {
    ev.preventDefault();
    const input = (ev.target as HTMLInputElement).querySelector("input");
    if (input) {
      const newName = input.value;
      updateCard(params.cardId, { name: newName });
      setEditMode(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70" onClick={handleBackdropClick}>
      <div
        className="bg-white
        p-4 mt-8 max-w-xs
        mx-auto rounded-md"
        onClick={(ev) => ev.stopPropagation()}
      >
        {!editMode && (
          <div className="flex justify-between">
            <h4 className="text-lg">{card?.name}</h4>
            <button className="text-gray-400" onClick={() => setEditMode(true)}>
              <FontAwesomeIcon icon={faEllipsis} />
            </button>
          </div>
        )}
        {editMode && (
          <div>
            <form onSubmit={handleNameChangeSubmit}>
              <input type="text" defaultValue={card?.name} className="mb-2" />
              <button className="w-full" type="submit">
                Save
              </button>
              <div className="mt-2">
                <DeleteWithConfirmation
                  onDelete={() => {
                    handleDelete();
                  }}
                />
              </div>
              <CancelButton onClick={() => setEditMode(false)} />
            </form>
          </div>
        )}
        {!editMode && (
          <div>
            <h2 className="flex gap-2 items-center mt-4">
              <FontAwesomeIcon icon={faFileLines} />
              Description
            </h2>
            <CardDescription />
          </div>
        )}
      </div>
    </div>
  );
}
