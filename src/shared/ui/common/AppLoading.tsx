import { FC } from "react";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { CLoadingProgress } from "@/shared/ui";

interface Props {
  className?: string;
}

export const AppLoading: FC<Props> = ({ className }) => {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();

  const show = isFetching + isMutating > 0;
  return show ? <CLoadingProgress /> : null;
};
