import LoginButton from "@/components/LoginButton";
import LogoutButton from "@/components/LogoutButton";
import { authOptions } from "@/libs/authOptions";
import { getServerSession } from "next-auth";
import Link from "next/link";
import React from "react";

const Header = async () => {
  const session = await getServerSession(authOptions);
  return (
    <header className="bg-gray-200 p-4 px-8">
      <div className="flex justify-between items-center">
        <Link href={`/`} className="logo">
          Taleau
        </Link>
        <div>
          {session && (
            <>
              Hello , {session.user?.name}
              <LogoutButton />
            </>
          )}
          {!session && (
            <>
              Not logged in
              <LoginButton />
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
