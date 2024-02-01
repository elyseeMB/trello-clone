"use client";
import { useUpdateMyPresence } from "@/app/liveblocks.config";
import CardModalBody from "@/components/CardModalBody";
import "@liveblocks/react-comments/styles.css";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CardModal() {
  const router = useRouter();
  const params = useParams();
  const updateMyPresence = useUpdateMyPresence();

  function handleBackdropClick() {
    router.back();
  }

  useEffect(() => {
    if (params.cardId) {
      updateMyPresence({ cardId: params.cardId.toString() });
    }
  }, [params]);

  return (
    <>
      <div className="fixed inset-0 bg-black/70 z-10"></div>
      <div
        onClick={handleBackdropClick}
        className="absolute inset-0 z-20 w-full"
      >
        <div className="">
          <div
            className="bg-white
            px-4 my-8 p-4 max-w-sm
            mx-auto rounded-md"
          >
            <div onClick={(ev) => ev.stopPropagation()}>
              <CardModalBody />
            </div>
          </div>
        </div>

        <div>&nbsp;</div>
      </div>
    </>
  );
}
