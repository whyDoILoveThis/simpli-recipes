import React, { useState } from "react";

interface Props {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  searchbarWidth?: string;
  searchbarAsAnimatedButton?: boolean;
  onSearch?: () => void;
}
const ItsSearchbar = ({
  searchTerm = "",
  setSearchTerm,
  searchbarWidth = "150px",
  searchbarAsAnimatedButton = false,
  onSearch,
}: Props) => {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <div
      className={`flex justify-center items-center w-full gap-2 ${
        showSearch && "justify-center"
      }`}
    >
      <div
        className={`border border-slate-500 overflow-hidden rounded-full  transition-all duration-400 flex ${
          showSearch ? "items-center  max-w-fit" : "min-w-0"
        }`}
      >
        <input
          type="text"
          placeholder="Search recipes..."
          className="bg-transparent max-w-full focus:outline-none border-none rounded-full transition-all duration-500 ease-in-out overflow-hidden"
          style={{
            maxWidth:
              showSearch || searchbarAsAnimatedButton
                ? `${searchbarWidth}`
                : "0px",
            padding:
              showSearch || searchbarAsAnimatedButton
                ? "0.5rem 0.5rem 0.5rem 1rem"
                : "0",
            height: showSearch || searchbarAsAnimatedButton ? "auto" : "0",
            transition:
              "max-width 0.5s ease, padding 0.5s ease, height 0.5s ease",
          }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <button
          type="button"
          onClick={() => {
            if (!searchbarAsAnimatedButton) {
              setShowSearch(true);
            }
            if (onSearch) {
              onSearch();
            }
          }}
          className="btn flex items-center rounded-full !border-0 p-3 !border-l"
        >
          {/* {<Search />} */}
          🔍
          <p
            className={`ml-1 opacity-0 w-0 ${
              !showSearch && "opacity-100 w-fit"
            }`}
          >
            Search
          </p>
        </button>
      </div>
      {showSearch && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <button
              className="border rounded-full p-1 px-2 text-xs"
              onClick={() => {
                setShowSearch(false);
                setSearchTerm("");
              }}
            >
              ◀
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItsSearchbar;
