import React from "react";
import LoaderSpinner from "../ui/LoaderSpinner";
import SendIcon from "../icons/SendIcon";

interface Props {
  prompt: string;
  setPrompt: (value: string) => void;
  disableSendBtn: boolean;
  loadingAiRes: boolean;
  setLoadingAiRes: (bool: boolean) => void;
  setSavingRecipe: (bool: boolean) => void;
  setRecipeSaved: (bool: boolean) => void;
}
const AiTextarea = ({
  prompt,
  setPrompt,
  disableSendBtn,
  loadingAiRes,
  setLoadingAiRes,
  setSavingRecipe,
  setRecipeSaved,
}: Props) => {
  return (
    <div className="w-full flex items-end gap-2 p-2 rounded-2xl bg-black bg-opacity-15 dark:bg-white dark:bg-opacity-10">
      <textarea
        className="text-sm pl-2 font-bold min-h-[150px] h-fit max-h-[300px] focus:outline-none placeholder:text-opacity-40 w-full text-wrap bg-transparent"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your recipe idea here..."
      />
      <button
        disabled={disableSendBtn}
        style={{ cursor: `${loadingAiRes ? "default" : "pointer"}` }}
        className={`btn btn-ghost btn-round text-2xl`}
        onClick={() => {
          setLoadingAiRes(true);
          setSavingRecipe(false);
          setRecipeSaved(false);
        }}
        type="submit"
      >
        {loadingAiRes ? <LoaderSpinner /> : <SendIcon />}
      </button>
    </div>
  );
};

export default AiTextarea;
