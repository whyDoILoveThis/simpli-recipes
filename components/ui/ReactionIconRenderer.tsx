import React from "react";
import Like from "../icons/reaction icons/Like";
import RockOn from "../icons/reaction icons/RockOn";
import Dislike from "../icons/reaction icons/Dislike";
import Love from "../icons/reaction icons/Love";
import Funny from "../icons/reaction icons/Funny";
import Angry from "../icons/reaction icons/Angry";
import FlipBird from "../icons/reaction icons/FlipBird";

interface Props {
  reaction: string;
  size?: string;
}
const ReactionIconRenderer = ({ reaction, size }: Props) => {
  return (
    <div className={`text-[${size}]`}>
      {reaction === "like" ? (
        <Like />
      ) : reaction === "rock-on" ? (
        <RockOn />
      ) : reaction === "dislike" ? (
        <Dislike />
      ) : reaction === "love" ? (
        <Love />
      ) : reaction === "funny" ? (
        <Funny />
      ) : reaction === "angry" ? (
        <Angry />
      ) : reaction === "flip-bird" ? (
        <FlipBird />
      ) : null}
    </div>
  );
};

export default ReactionIconRenderer;
