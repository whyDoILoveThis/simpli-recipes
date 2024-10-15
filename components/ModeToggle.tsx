"use client";

import * as React from "react";
import { IoFlashlight } from "react-icons/io5";
import { GiNightSky } from "react-icons/gi";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Button
      className="rounded-full bg-transparent border hover:bg-black dark:hover:bg-white dark:text-white text-slate-950 dark:hover:bg-opacity-10 hover:bg-opacity-10 w-[30px] h-[30px] p-0"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {theme === "dark" ? (
        <IoFlashlight className="text-xl" />
      ) : theme === "light" ? (
        <GiNightSky className="text-2xl" />
      ) : (
        !theme && <IoFlashlight className="text-xl" />
      )}
    </Button>
  );
}
