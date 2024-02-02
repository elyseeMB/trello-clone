import { authOptions } from "@/libs/authOptions";
import { liveblocksClient } from "@/libs/liveblocksClient";
import { getServerSession } from "next-auth";

export async function POST(Request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  // @ts-ignore
  if (!session && !session.user) {
    return new Response("Unauthorized", { status: 401 });
  }
  const user = session?.user;
  // @ts-ignore
  const email = user.email || "";

  // Identify the user and return the result
  const { status, body } = await liveblocksClient.identifyUser(
    {
      userId: email,
      groupIds: [],
    },
    {
      userInfo: {
        name: user?.name || "",
        email: email,
        image: user?.image,
      },
    }
  );

  return new Response(body, { status });
}
