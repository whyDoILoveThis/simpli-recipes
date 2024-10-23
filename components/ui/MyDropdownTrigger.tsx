import React from "react";
import { DropdownMenuTrigger } from "./dropdown-menu";
import { Button } from "./button";
import { BsThreeDots } from "react-icons/bs";

const MyDropdownTrigger = () => {
  return (
    <DropdownMenuTrigger className="focus:outline-none ">
      <Button className="p-0 w-[30px] h-[30px]">
        <BsThreeDots className="text-slate-400" />
      </Button>
    </DropdownMenuTrigger>
  );
};

export default MyDropdownTrigger;
