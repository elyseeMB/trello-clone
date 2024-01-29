import Board from "@/components/Board";
import LoginView from "@/components/views/LoginView";
import { authOptions } from "@/libs/authOptions";
import { getServerSession } from "next-auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Boards from "@/components/Boards";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return <LoginView />;
  }
  return (
    <div>
      <h1 className="text-4xl mb-4">Your boards:</h1>
      <Boards />
      <div className="mt-4">
        <Link className="btn primary gap-2 inline-flex" href={"/new-board"}>
          Create new boards{" "}
          <FontAwesomeIcon className="h-6" icon={faArrowRight} />
        </Link>
      </div>
    </div>
  );
}
