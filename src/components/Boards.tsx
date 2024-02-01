"use server";

import BoardsTiles from "@/components/BoardsTiles";
import { liveblocksClient } from "@/libs/liveblocksClient";
import { getUserEmail } from "@/libs/userClient";

export default async function Boards() {
  const email = await getUserEmail();
  const { data: rooms } = await liveblocksClient.getRooms({
    userId: email,
  });
  return <BoardsTiles boards={rooms} />;
}
