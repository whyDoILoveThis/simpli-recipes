import { Timestamp } from "firebase/firestore";
import React from "react";

const DateAndTime = ({ timestamp }: { timestamp: Timestamp }) => {
  return (
    <p className="text-sm text-slate-400">
      {timestamp.toDate().toLocaleString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      })}
    </p>
  );
};

export default DateAndTime;
