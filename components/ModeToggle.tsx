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
    <button
      className={`btn btn-round !border-none`}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {theme === "dark" ? (
        <IoFlashlight className="text-xl" />
      ) : theme === "light" ? (
        <GiNightSky className="text-[28px] text-slate-800" />
      ) : (
        !theme && <IoFlashlight className="text-xl" />
      )}
    </button>
  );
}
