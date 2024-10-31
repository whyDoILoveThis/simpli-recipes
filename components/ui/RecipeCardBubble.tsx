import React from "react";

interface Props {
  children: React.ReactNode;
  text?: string;
  color?: string;
}
const RecipeCardBubble = ({ children, text, color = "slate" }: Props) => {
  return (
    <div className="flex w-[60px] flex-col items-center justify-center">
      <div
        className={`text-center text-3xl leading-none mb-1 min-w-[50px] min-h-[50px] border rounded-full p-2 bg-${color}-500 bg-opacity-35 border-${color}-500 text-${color}-300`}
      >
        {children}
      </div>
      <p className={`text-${color}-300`}>{text && text}</p>
    </div>
  );
};

export default RecipeCardBubble;
