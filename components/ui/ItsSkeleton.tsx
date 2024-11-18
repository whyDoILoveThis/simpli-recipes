"use client";
import React, { useEffect, useState } from "react";

interface Props {
  width?: string;
  height?: string;
  ClassNames?: string;
  duration?: number;
  children?: React.ReactNode;
}
const ItsSkeleton = ({
  width,
  height = "60px",
  ClassNames,
  duration = 800,
  children,
}: Props) => {
  const [move, setMove] = useState(false);

  useEffect(() => {
    setMove(!move);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setMove(!move);
    }, duration);
  }, [move]);

  return (
    <div
      className={`bg-slate-400 transition-opacity duration-1000 ${
        move ? "opacity-0" : "opacity-100"
      } ${ClassNames ? ClassNames : "rounded-md"}`}
      style={{ width, height }}
    >
      {children}
    </div>
  );
};

export default ItsSkeleton;
