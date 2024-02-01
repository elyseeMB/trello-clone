"use client";
import { useOthers, Presence } from "@/app/liveblocks.config";
import { shallow } from "@liveblocks/client";

type Props = {
  presenseKey: keyof Presence;
  presenceValue: string;
};

export default function PresencesAvatars({
  presenseKey,
  presenceValue,
}: Props) {
  const others = useOthers((users) => {
    return users.filter((u) => u.presence?.[presenseKey] === presenceValue);
  }, shallow);

  return (
    <div className="flex gap-1 p-1">
      {others.map((user) => (
        <div key={user.id}>
          <img
            className="size-8 rounded-full"
            src={user.info.image}
            alt="avatar"
          />
        </div>
      ))}
    </div>
  );
}
