"use client";
import React, { useState, useRef, useEffect } from "react";
import { BsThreeDots } from "react-icons/bs";

interface Props {
  children: React.ReactNode;
  theButton: React.ReactNode | string;
}
const ItsDropdown = ({ children, theButton }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropBtnRef = useRef<HTMLDivElement>(null);

  // Toggle dropdown open/close on button click
  const handleToggle = () => {
    setIsOpen(!isOpen);
  };
  // Close dropdown if clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        dropBtnRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !dropBtnRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Clean up listener on unmount
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <article className="w-full h-screen flex justify-center items-center">
      <div className="relative">
        <div
          className="cursor-pointer mb-1"
          ref={dropBtnRef}
          onClick={handleToggle}
        >
          {theButton}
        </div>

        <div
          ref={dropdownRef}
          className={`absolute selection:bg-transparent transition-all duration-400 z-50 min-w-[8rem] overflow-hidden rounded-md border bg-black bg-opacity-20 backdrop-blur-md p-1 shadow-md ${
            isOpen ? "opacity-100 p-2" : "opacity-0 p-0"
          }`}
        >
          <ul className="flex flex-col gap-2">{children}</ul>
        </div>
      </div>
    </article>
  );
};

export default ItsDropdown;
