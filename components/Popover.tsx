import React, { useEffect } from "react";

interface Props {
  children?: React.ReactNode;
  zIndex?: string;
}

const Popover = ({ children, zIndex = "999" }: Props) => {
  const isOpen = true;
  useEffect(() => {
    // Disable body scroll when popover is open
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("");
    }

    // Clean up to remove class when component unmounts or closes
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);
  return (
    <div
      className={`bg-black pt-14 bg-opacity-60 fixed z-40 top-0 left-0 w-screen h-screen backdrop-blur-md 
                    flex flex-col items-center 
    `}
    >
      <div className="w-full h-full max-w-[800px] relative  flex flex-col items-center ">
        {children}
      </div>
    </div>
  );
};

export default Popover;
