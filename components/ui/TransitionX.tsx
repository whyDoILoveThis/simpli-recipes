"use client";
import React, { useState } from "react";

interface Props {
  bgColor?: string;
}
const TransitionX = ({ bgColor = "" }: Props) => {
  const [doIt, setDoIt] = useState(false);

  return (
    <button
      className="relative"
      onClick={() => {
        setDoIt(!doIt);
      }}
    >
      <span className="absolute w-8 h-8 -translate-x-3.5"></span>
      <div
        className={`absolute w-1 h-8 rounded-full ${
          bgColor !== "" ? bgColor : "bg-white"
        } transition-all duration-300 ${doIt ? "rotate-45" : "rotate-90"} `}
      ></div>
      <div
        className={`absolute w-1 h-8 rounded-full  ${
          bgColor !== "" ? bgColor : "bg-white"
        } transition-all duration-500 -rotate-45 ${
          doIt ? "-rotate-45" : "-rotate-90 -translate-y-3"
        }`}
      ></div>
      <div
        className={`absolute w-1 h-8 rounded-full  ${
          bgColor !== "" ? bgColor : "bg-white"
        } transition-all duration-500 -rotate-45 ${
          doIt ? "rotate-45" : "rotate-90 translate-y-3"
        }`}
      ></div>
    </button>
  );
};

export default TransitionX;
