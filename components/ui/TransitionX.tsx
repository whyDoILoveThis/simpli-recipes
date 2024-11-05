"use client";
import React, { useState } from "react";

interface Props {
  bgColor?: string;
}
const TransitionX = ({ bgColor = "" }: Props) => {
  const [doIt, setDoIt] = useState(false);
  return (
    <div
      className="ml-5 relative h-11"
      onClick={() => {
        setDoIt(!doIt);
      }}
    >
      <div
        className={`absolute w-2 h-11 rounded-full ${
          bgColor !== "" ? bgColor : "bg-white"
        } transition-all duration-700 ${doIt ? "rotate-45" : "rotate-90"} `}
      ></div>
      <div
        className={`absolute w-2 h-11 rounded-full  ${
          bgColor !== "" ? bgColor : "bg-white"
        } transition-all duration-700 -rotate-45 ${
          doIt ? "-rotate-45" : "-rotate-90 -translate-y-4"
        }`}
      ></div>
      <div
        className={`absolute w-2 h-11 rounded-full  ${
          bgColor !== "" ? bgColor : "bg-white"
        } transition-all duration-700 -rotate-45 ${
          doIt ? "rotate-45" : "-rotate-90 translate-y-4"
        }`}
      ></div>
    </div>
  );
};

export default TransitionX;
