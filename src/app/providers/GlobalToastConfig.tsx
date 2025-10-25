import { FC, ReactNode, useEffect } from "react";

import { setGlobalToastFunction, useToast } from "@/shared/hooks";

interface Props {
  children: ReactNode;
}

export const GlobalToastConfig: FC<Props> = ({ children }) => {
  const { toast } = useToast();

  useEffect(() => {
    setGlobalToastFunction((message, type) => {
      toast(message, type);
    });
  }, [toast]);

  return children;
};
