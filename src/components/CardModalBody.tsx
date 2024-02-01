import {
  Card,
  useMutation,
  useStorage,
  useThreads,
} from "@/app/liveblocks.config";
import { BoardContext, BoardContextProps } from "@/components/BoardContext";
import CancelButton from "@/components/CancelButton";
import CardDescription from "@/components/CardDescription";
import DeleteWithConfirmation from "@/components/DeleteWithConfirmation";
import {
  faComment,
  faEllipsis,
  faFileLines,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { shallow } from "@liveblocks/client";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useContext, useEffect, useState } from "react";
import { Composer, Thread } from "@liveblocks/react-comments";

export default function CardModalBody() {
  const router = useRouter();
  const params = useParams();
  const { setOpenCard } = useContext<BoardContextProps>(BoardContext);
  const [editMode, setEditMode] = useState(false);
  const { threads } = useThreads({
    query: { metadata: { cardId: params.cardId.toString() } },
  });

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
    <>
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
            <div className="mb-8 mt-8">
              <CancelButton onClick={() => setEditMode(false)} />
            </div>
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
          <h2 className="flex gap-2 items-center mt-4">
            <FontAwesomeIcon icon={faComment} />
            Comments
          </h2>
          <div className="-mx-4">
            {threads &&
              threads.map((thread) => (
                <div key={thread.id}>
                  <Thread thread={thread} id={thread.id} />
                </div>
              ))}
            {threads?.length === 0 && (
              <div>
                <Composer metadata={{ cardId: params.cardId.toString() }} />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
