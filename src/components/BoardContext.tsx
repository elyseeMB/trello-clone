import React, { Dispatch, createContext, useState } from "react";

type openCardId = string | null;

export type BoardContextProps = {
  openCard?: openCardId;
  setOpenCard?: Dispatch<React.SetStateAction<openCardId>>;
};

type ProviderProps = {
  children: React.ReactNode;
};

export const BoardContext = createContext<BoardContextProps>({});

export function BoardContextProvider({ children }: ProviderProps) {
  const [openCard, setOpenCard] = useState<openCardId>(null);
  return (
    <BoardContext.Provider
      value={{
        openCard,
        setOpenCard,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
}
