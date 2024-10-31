import React from "react";

// Loading Skeleton Components
const SkeletonCircle = ({ size }: { size: number }) => (
  <div
    className={`rounded-full bg-slate-400 animate-pulse`}
    style={{ width: size, height: size }}
  />
);

const SkeletonLine = ({ width, height }: { width: string; height: string }) => (
  <div
    className={`bg-slate-400 animate-pulse rounded-md`}
    style={{ width, height }}
  />
);

const SkeletonBlock = ({
  width,
  height,
}: {
  width: string;
  height: string;
}) => (
  <div
    className={`bg-slate-400 animate-pulse rounded-md`}
    style={{ width, height }}
  />
);

// Main Loading Skeleton Component
const ProfilePageSkeleton = () => {
  return (
    <div className="flex flex-col items-center w-full gap-4 p-4">
      {/* User Profile Image and Name Skeleton */}
      <div className="flex flex-col items-center gap-2">
        <SkeletonCircle size={120} />
        <SkeletonLine width="120px" height="24px" />
      </div>

      {/* User Info and Description Skeleton */}
      <div className="text-slate-400 text-center flex flex-col gap-2 max-w-md">
        <div className="flex flex-col gap-2">
          {Array(4)
            .fill("")
            .map((_, index) => (
              <SkeletonLine width="230px" height="14px" />
            ))}
        </div>
      </div>

      {/* Stats Section Skeleton */}
      <div className="flex justify-evenly items-center w-full max-w-md gap-6">
        {["485", "987", "67"].map((_, index) => (
          <div
            key={index}
            className="flex flex-col gap-1 items-center text-center"
          >
            <SkeletonLine width="40px" height="24px" />
            <SkeletonLine width="60px" height="14px" />
          </div>
        ))}
      </div>

      {/* Tabs Skeleton */}
      <div className="w-full max-w-md mt-4">
        <div className="flex justify-center gap-4">
          <SkeletonBlock width="100px" height="36px" />
          <SkeletonBlock width="100px" height="36px" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="w-full flex justify-center max-w-3xl mt-6">
        {/* Recipe Card List Placeholder */}
        <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(4)
            .fill("")
            .map((_, index) => (
              <SkeletonBlock key={index} width="250px" height="180px" />
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePageSkeleton;
