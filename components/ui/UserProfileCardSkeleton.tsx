import React from "react";

const UserProfileCardSkeleton = () => {
  return (
    <div className="flex flex-col gap-3 w-fit border border-slate-700 rounded-3xl m-4 p-4 animate-pulse">
      {/* Skeleton for user info */}
      <div className="flex gap-1 border rounded-full w-fit p-2 items-center">
        <div className="rounded-full bg-slate-600 h-6 w-6"></div>
        <div className="bg-slate-600 h-4 w-16 rounded-md"></div>
      </div>

      {/* Skeleton for buttons */}
      <div className="flex gap-2 w-fit">
        <div className="flex gap-1 items-center">
          <div className="bg-slate-600 h-9 w-14 rounded-full"></div>
        </div>
        <div className="flex gap-1 items-center">
          <div className="bg-slate-600 h-9 w-14 rounded-full"></div>
        </div>
        <div className="flex gap-1 items-center">
          <div className="bg-slate-600 h-9 w-14 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileCardSkeleton;
