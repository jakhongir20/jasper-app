import { FC } from "react";
import { Outlet, useMatches } from "react-router-dom";

import { cn } from "@/shared/helpers";
import { ContentWrapper, Navigation } from "@/shared/ui";

interface Props {
  className?: string;
}

type CustomHandle = {
  navigation: boolean;
};

export const AdminLayout: FC<Props> = ({ className }) => {
  const matches = useMatches();

  const showNavigation = matches.some((match) => {
    const handle = match.handle as CustomHandle | undefined;
    return !!handle?.navigation;
  });

  return (
    <div className={cn(className)}>
      {showNavigation && (
        <ContentWrapper>
          <Navigation elementKey="__admin" />
        </ContentWrapper>
      )}

      <div className="">
        <Outlet />
      </div>
    </div>
  );
};
