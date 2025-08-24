import React from "react";

interface Props {
  color?: string; // e.g., "pink", "blue", "green", "red", etc.
}

const LoaderSpinner = ({ color = "" }: Props) => {
  // Dynamically construct the class name based on the color
  const className =
    color && color !== "" && `loader-spinner-${color.toLowerCase()}`;

  return <div className={`loader-spinner ${className}`} />;
};

export default LoaderSpinner;
