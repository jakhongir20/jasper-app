import { useState } from "react";

type ReturnValues = {
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
};

export const useToggle = (defaultValue?: boolean): ReturnValues => {
  const [isOpen, setIsOpen] = useState(defaultValue ?? false);

  function toggle() {
    setIsOpen(!isOpen);
  }

  function open() {
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

  return { isOpen, toggle, open, close };
};
