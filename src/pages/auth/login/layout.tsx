import { cn } from "@/shared/helpers";
import { FC } from "react";
import { Outlet } from "react-router-dom";

interface Props {
  className?: string;
}

export const AuthLayout: FC<Props> = ({ className }) => {
  return (
    <div
      className={cn(
        "grid h-screen bg-black-100 bg-gradient-to-r from-[#2EADBD] to-[#1d7488] bg-cover bg-center bg-no-repeat",
        className,
      )}
    >
      <div
        className={"absolute z-10 h-full w-full bg-black opacity-[40%]"}
      ></div>
      {/*<HeaderTransparent/>*/}
      <main className="z-50 flex flex-col items-center justify-center overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
};
