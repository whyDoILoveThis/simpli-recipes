import React from "react";
import { FaRegThumbsUp, FaRegThumbsDown } from "react-icons/fa";

interface Props {
  thumbUp: boolean;
}
const Thumb = ({ thumbUp }: Props) => {
  return <div>{!thumbUp ? <FaRegThumbsDown /> : <FaRegThumbsDown />}</div>;
};

export default Thumb;
