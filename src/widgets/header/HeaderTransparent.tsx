import { cn } from "@/shared/helpers";
import { Layout } from "antd";
import { CSSProperties, FC } from "react";

interface Props {
  className?: string;
}

const headerStyle: CSSProperties = {
  color: "#fff",
  height: 40,
  lineHeight: "40px",
  background: "transparent",
  padding: "28px 64px",
};

export const HeaderTransparent: FC<Props> = ({ className }) => {
  return (
    <Layout.Header style={headerStyle} className={cn(className)}>
      <div className="z-50 flex h-full w-full justify-between">
        <div className="flex items-center">
          {/* <div>
            <img src="/logo-purple.svg" alt="Logo" />
          </div>
          <div className="ml-2.5">
            <img src="/logo-2.svg" alt="Logo" />
          </div> */}
        </div>
        <div className="flex items-center gap-5">
          {/* <HeaderLanguageTransparent /> */}
        </div>
      </div>
    </Layout.Header>
  );
};
