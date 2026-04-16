"use client";
import { ReactElement, ReactNode } from "react";

export const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="h-full w-full flex items-center justify-center mt-24">
      <div className="max-h-[36vw] w-[34vw] bg-neutral-200 dark:bg-neutral-800 rounded-md p-4 shadow-2xl/10 shadow-neutral-400 dark:shadow-neutral-600 border border-neutral-500 dark:border-neutral-200">
        <h1 className="text-4xl mt-4 mb-8 font-semibold  text-(--text-light) dark:text-(--text-dark) flex  items-center justify-center ">
          Welcome
        </h1>
        <div className="flex flex-col gap-2 px-2">{children}</div> 
      </div>
    </div>
  );
};
