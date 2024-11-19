import React from "react";
import ItsSkeleton from "../ui/ItsSkeleton";

const RecipeCardListSkeleton = () => {
  return (
    <div className="w-full grid sm:grid-cols-2 place-items-center p-2 gap-4">
      <ItsSkeleton
        width="100%"
        height="200px"
        ClassNames="max-w-[320px] rounded-2xl relative"
      >
        <ItsSkeleton
          ClassNames="absolute top-2 left-2 rounded-full bg-slate-900"
          width="140px"
          height="50px"
          duration={1000}
        />
        <ItsSkeleton
          ClassNames="absolute top-2 right-2 rounded-full bg-slate-900"
          width="65px"
          height="40px"
          duration={1000}
        />
        <ItsSkeleton
          ClassNames="absolute bottom-4 left-4 right-4 rounded-md bg-slate-900"
          width={undefined}
          height="20px"
          duration={1000}
        />
      </ItsSkeleton>
      <ItsSkeleton
        width="100%"
        height="200px"
        ClassNames="max-w-[320px] rounded-2xl relative"
      >
        <ItsSkeleton
          ClassNames="absolute top-2 left-2 rounded-full bg-slate-900"
          width="140px"
          height="50px"
          duration={1000}
        />
        <ItsSkeleton
          ClassNames="absolute top-2 right-2 rounded-full bg-slate-900"
          width="65px"
          height="40px"
          duration={1000}
        />
        <ItsSkeleton
          ClassNames="absolute bottom-4 left-4 right-4 rounded-md bg-slate-900"
          width={undefined}
          height="20px"
          duration={1000}
        />
      </ItsSkeleton>
      <ItsSkeleton
        width="75%"
        height="300px"
        ClassNames="max-w-[320px] rounded-2xl relative"
      >
        <ItsSkeleton
          ClassNames="absolute top-2 left-2 rounded-full bg-slate-900"
          width="140px"
          height="50px"
          duration={1000}
        />
        <ItsSkeleton
          ClassNames="absolute top-2 right-2 rounded-full bg-slate-900"
          width="65px"
          height="40px"
          duration={1000}
        />
        <ItsSkeleton
          ClassNames="absolute bottom-4 left-4 right-4 rounded-md bg-slate-900"
          width={undefined}
          height="20px"
          duration={1000}
        />
      </ItsSkeleton>
      <ItsSkeleton
        width="100%"
        height="200px"
        ClassNames="max-w-[320px] rounded-2xl relative"
      >
        <ItsSkeleton
          ClassNames="absolute top-2 left-2 rounded-full bg-slate-900"
          width="140px"
          height="50px"
          duration={1000}
        />
        <ItsSkeleton
          ClassNames="absolute top-2 right-2 rounded-full bg-slate-900"
          width="65px"
          height="40px"
          duration={1000}
        />
        <ItsSkeleton
          ClassNames="absolute bottom-4 left-4 right-4 rounded-md bg-slate-900"
          width={undefined}
          height="20px"
          duration={1000}
        />
      </ItsSkeleton>
      <ItsSkeleton
        width="75%"
        height="300px"
        ClassNames="max-w-[320px] rounded-2xl relative"
      >
        <ItsSkeleton
          ClassNames="absolute top-2 left-2 rounded-full bg-slate-900"
          width="140px"
          height="50px"
          duration={1000}
        />
        <ItsSkeleton
          ClassNames="absolute top-2 right-2 rounded-full bg-slate-900"
          width="65px"
          height="40px"
          duration={1000}
        />
        <ItsSkeleton
          ClassNames="absolute bottom-4 left-4 right-4 rounded-md bg-slate-900"
          width={undefined}
          height="20px"
          duration={1000}
        />
      </ItsSkeleton>
      <ItsSkeleton
        width="100%"
        height="200px"
        ClassNames="max-w-[320px] rounded-2xl relative"
      >
        <ItsSkeleton
          ClassNames="absolute top-2 left-2 rounded-full bg-slate-900"
          width="140px"
          height="50px"
          duration={1000}
        />
        <ItsSkeleton
          ClassNames="absolute top-2 right-2 rounded-full bg-slate-900"
          width="65px"
          height="40px"
          duration={1000}
        />
        <ItsSkeleton
          ClassNames="absolute bottom-4 left-4 right-4 rounded-md bg-slate-900"
          width={undefined}
          height="20px"
          duration={1000}
        />
      </ItsSkeleton>
    </div>
  );
};

export default RecipeCardListSkeleton;
