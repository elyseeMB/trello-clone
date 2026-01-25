import { LiveList, LiveObject, createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

const client = createClient({
  authEndpoint: "/api/liveblocks-auth",
  throttle: 100,
});

export type Presence = {
  boardId?: null | string;
  cardId?: null | string;
};

type UserMeta = {
  id: string;
  info: {
    name: string;
    email: string;
    image: string;
  };
};

type RoomEvent = {};

type ThreadMetadata = {
  cardId: string;
};

export type Column = {
  name: string;
  index: number;
  id: string;
};
export type Card = {
  name: string;
  index: number;
  id: string;
  columnId: string;
};

type Storage = {
  columns: LiveList<LiveObject<Column>>;
  cards: LiveList<LiveObject<Card>>;
};

export const {
  RoomProvider,
  useMyPresence,
  useStorage,
  useMutation,
  useRoom,
  useUpdateMyPresence,
  useSelf,
  useOthers,
  useThreads,
  /* ...all the other hooks you’re using... */
} = createRoomContext<Presence, Storage, UserMeta, RoomEvent, ThreadMetadata>(
  client
);
