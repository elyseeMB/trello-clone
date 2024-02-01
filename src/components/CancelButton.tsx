import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const CancelButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      className="mt-4 w-full flex gap-2 items-center justify-center 
  uppercase text-sm font-bold
  text-gray-400"
      onClick={onClick}
    >
      <FontAwesomeIcon icon={faClose} />
      Cancel edit
    </button>
  );
};

export default CancelButton;
