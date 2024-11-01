import React from "react";

const CommentCardSkeleton = () => {
  return (
    <div className=" flex flex-col gap-3 max-w-[280px] border border-slate-700 rounded-3xl m-4 p-4 animate-pulse">
      {/* Skeleton for user info */}
      <div className="flex gap-1 border rounded-full w-fit p-2 items-center">
        <div className="rounded-full bg-slate-600 h-6 w-6"></div>
        <div className="bg-slate-600 h-4 w-16 rounded-md"></div>
      </div>

      {/* Skeleton for date and time */}
      <div className="bg-slate-600 h-3 w-32 rounded-md"></div>

      {/* Skeleton for buttons */}
      <div className="flex flex-col gap-2">
        <div className="bg-slate-600 h-3 w-full rounded-md"></div>
        <div className="bg-slate-600 h-3 w-full rounded-md"></div>
        <div className="bg-slate-600 h-3 w-40 rounded-md"></div>
      </div>
    </div>
  );
};

export default CommentCardSkeleton;
