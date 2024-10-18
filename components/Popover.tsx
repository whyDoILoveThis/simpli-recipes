import React from "react";

interface Props {
  children?: React.ReactNode;
  zIndex?: string;
}

const Popover = ({ children, zIndex }: Props) => {
  return (
    <div
      className={`bg-black pt-14 bg-opacity-60 fixed z-${zIndex} top-0 left-0 w-screen h-screen backdrop-blur-md 
                    flex flex-col items-center 
    `}
    >
      {children}
    </div>
  );
};

export default Popover;
