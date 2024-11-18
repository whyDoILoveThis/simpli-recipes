"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { ModeToggle } from "../ModeToggle";
import logo from "@/images/recipes-logo.png";
import TransitionX from "./TransitionX";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropBtnRef = useRef<HTMLDivElement>(null);
  const [triggerXTransition, setTriggerXTransition] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        dropBtnRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !dropBtnRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setTriggerXTransition(false);
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
    <nav className=" z-50 fixed top-0 left-0 w-screen flex justify-center items-center p-2 px-4 border-b bg-teal-500 bg-opacity-15 dark:bg-white dark:bg-opacity-15">
      <div className="z-50 w-full max-w-[800px] max-h-[44px] h-[44px] flex items-center justify-between">
        <Link
          className="flex justify-center items-center font-bold"
          href={"/feed"}
        >
          <Image width={40} height={10} src={logo} alt={"logo"} />
          <p className="text-md translate-y-1 text-blue-100 leading-none">
            Simpli<span className="text-orange-300">Recipes</span>
          </p>
        </Link>
        <div
          ref={dropdownRef}
          className={`flex items-center gap-6 flex-col sm:flex-row ${
            isOpen ? "visible absolute right-10 top-16 w-fit" : "invisible w-0"
          }  sm:visible sm:w-fit`}
        >
          <div
            className={`flex ${
              isOpen
                ? "flex-col items-center gap-4 border p-4 border-slate-400 bg-teal-500 bg-opacity-15 backdrop-blur-lg rounded-2xl"
                : "flex-row gap-4 items-center"
            }`}
          >
            <ul className={`flex gap-4 ${isOpen && "flex-col"} `}>
              <li className="text-slate-200 hover:text-orange-300 font-bold">
                <Link href={"/"}>Profile</Link>
              </li>
              <li className="text-slate-200 hover:text-orange-300 font-bold">
                <Link href={"/feed"}>Feed</Link>
              </li>
              <li className="text-slate-200 hover:text-orange-300 font-bold">
                <Link href={"/create"}>Create</Link>
              </li>
              <li className="text-slate-200 hover:text-orange-300 font-bold">
                <Link href={"/ai"}>AI</Link>
              </li>
            </ul>
            <div className="flex gap-2">
              <UserButton />
              <ModeToggle />
            </div>
          </div>
          {
            <div
              ref={dropBtnRef}
              onClick={() => {
                setIsOpen(!isOpen);
              }}
              className={`fixed -top-1 right-10 visible sm:opacity-0 sm:invisible `}
            >
              {" "}
              <TransitionX
                triggerXTransition={triggerXTransition}
                setTriggerXTransition={setTriggerXTransition}
                bgColor="bg-slate-300"
              />
            </div>
          }
        </div>
      </div>
      <div className="z-40 fixed top-0 left-0 right-0 max-h-[60px] h-[60px] backdrop-blur-lg"></div>
    </nav>
  );
};

export default Navbar;
