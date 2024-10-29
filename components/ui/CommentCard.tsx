import React, { useEffect, useRef, useState } from "react";
import UserProfileTag from "./UserProfileTag/UserProfileTag";
import { Button } from "./button";
import Trash from "../icons/Trash";
import DateAndTime from "./DateAndTime";
import { useAuth } from "@clerk/nextjs";
import Reply from "../icons/Reply";
import { Input } from "./input";
import CloseButton from "../icons/CloseButton";
import Plus from "../icons/Plus";
import { fbGetUserById } from "@/firebase/fbGetUserById";
import CommentReplys from "./CommentReplys";
import { fbAddComment } from "@/firebase/fbAddComment";
import { fbGetComments } from "@/firebase/fbGetComments";
import Chevron from "../icons/Chevron";
import CommentsIcon from "../icons/CommentsIcon";
import Like from "../icons/reaction icons/Like";
import ReactionsIcon from "../icons/reaction icons/ReactionsIcon";
import ItsTooltip from "./its-tooltip";
import RockOn from "../icons/reaction icons/RockOn";
import Dislike from "../icons/reaction icons/Dislike";
import Love from "../icons/reaction icons/Love";
import Funny from "../icons/reaction icons/Funny";
import EyeRoll from "../icons/reaction icons/EyeRoll";
import Angry from "../icons/reaction icons/Angry";
import FlipBird from "../icons/reaction icons/FlipBird";
import { fbAddReactionToComment } from "@/firebase/fbAddReactionToComment";
import ReactionIconRenderer from "./ReactionIconRenderer";
import LoaderSpinner from "./LoaderSpinner";
import None from "../icons/reaction icons/None";
import { fbRemoveReaction } from "@/firebase/fbRemoveReaction";
import CommentCardSkeleton from "./CommentCardSkeleton";

interface Props {
  comment: Comment;
  recipe: Recipe;
  handleDeleteComment: (uid: string, id: string) => void;
  commentFetchTrigger: boolean;
  setCommentFetchTrigger: (param: boolean) => void;
}

const CommentCard = ({
  comment,
  recipe,
  handleDeleteComment,
  commentFetchTrigger,
  setCommentFetchTrigger,
}: Props) => {
  const { userId } = useAuth();
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [commenter, setCommenter] = useState<User | null>();
  const [replyText, setReplyText] = useState("");
  const [replys, setReplys] = useState<Comment[]>();
  const [showReplys, setShowReplys] = useState(false);
  const stringOptions = [
    "border-blue-400",
    "border-red-400",
    "border-green-400",
    "border-purple-400",
    "border-pink-400",
    "border-yellow-400",
  ];
  const [selectedString, setSelectedString] = useState("");
  const [myReaction, setMyReaction] = useState<Reaction | null>();
  const [reactionPopShake, setReactionPopShake] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [loadingReaction, setLoadingReaction] = useState(false);
  const [deletingComment, setDeletingComment] = useState(false);
  const [addingComment, setAddingComment] = useState(false);
  const [commentsPopShake, setCommentsPopShake] = useState(false);

  useEffect(() => {
    const g = async () => {
      setCommenter(await fbGetUserById(comment.userUid));
    };
    g();
    // Filter out replys for this comment
    const fetchReplysAndGetMyReaction = async () => {
      if (!recipe.uid) return;
      const allComments = await fbGetComments(recipe.uid);
      const commentReplys = allComments.filter(
        (c) => c.parentCommentId === comment.commentUid
      );
      const thisComment = allComments.filter(
        (c) => c.commentUid === comment.commentUid
      );
      const thisCommentsReactions =
        (thisComment[0] && thisComment[0].reactions) || null;
      const myReactionToThisComment = thisCommentsReactions?.filter(
        (r) => r.userUid === userId
      );
      myReactionToThisComment && setMyReaction(myReactionToThisComment[0]);
      setReplys(commentReplys);
    };
    fetchReplysAndGetMyReaction();
  }, []);

  useEffect(() => {
    const g = async () => {
      setCommenter(await fbGetUserById(comment.userUid));
    };
    g();
    // Filter out replys for this comment
    const fetchReplysAndGetMyReaction = async () => {
      if (!recipe.uid) return;
      const allComments = await fbGetComments(recipe.uid);
      const commentReplys = allComments.filter(
        (c) => c.parentCommentId === comment.commentUid
      );
      const thisComment = allComments.filter(
        (c) => c.commentUid === comment.commentUid
      );
      const thisCommentsReactions =
        (thisComment[0] && thisComment[0].reactions) || null;
      const myReactionToThisComment = thisCommentsReactions?.filter(
        (r) => r.userUid === userId
      );
      myReactionToThisComment && setMyReaction(myReactionToThisComment[0]);
      setReplys(commentReplys);
    };
    fetchReplysAndGetMyReaction();
  }, [commentFetchTrigger]);

  const deleteButton = () => {
    return (
      <Button
        className="btn-round min-w-[35px] p-0 text-lg absolute top-2 right-2"
        variant={"destructive"}
        onClick={() => {
          recipe.uid && handleDeleteComment(recipe.uid, comment.commentUid);
          setDeletingComment(true);
        }}
      >
        <Trash />
      </Button>
    );
  };

  useEffect(() => {
    const randomString =
      stringOptions[Math.floor(Math.random() * stringOptions.length)];
    setSelectedString(randomString);
  }, []);

  useEffect(() => {
    reactionPopShake &&
      setTimeout(() => {
        setReactionPopShake(false);
      }, 800);
  }, [reactionPopShake]);

  useEffect(() => {
    commentsPopShake &&
      setTimeout(() => {
        setCommentsPopShake(false);
      }, 800);
  }, [commentsPopShake]);

  useEffect(() => {
    if (!replys?.length) {
      setShowReplys(false);
    }
  }, [replys]);

  const handleAddReply = async () => {
    if (!replyText.trim() || !userId || !recipe.uid) return; // Prevent empty replys
    setAddingComment(true);

    // Here you would call your Firebase function to add the reply
    await fbAddComment(recipe.uid, userId, replyText, comment.commentUid); // Ensure your fbAddComment supports parentCommentId
    // Optionally clear the reply input
    setReplyText("");
    setShowReplyInput(false); // Close the reply input after adding
    setCommentFetchTrigger(!commentFetchTrigger);
    setAddingComment(false);
    setCommentsPopShake(true);
  };

  const handleAddReaction = async (reaction: string) => {
    setLoadingReaction(true);
    recipe.uid &&
      userId &&
      (await fbAddReactionToComment(
        userId,
        recipe.uid,
        comment.commentUid,
        reaction
      ));
    setCommentFetchTrigger(!commentFetchTrigger);
    setLoadingReaction(false);
    setReactionPopShake(true);
  };

  const handleRemoveReaction = async () => {
    setLoadingReaction(true);
    recipe.uid &&
      userId &&
      myReaction &&
      (await fbRemoveReaction(
        userId,
        recipe.uid,
        comment.commentUid,
        myReaction
      ));
    setCommentFetchTrigger(!commentFetchTrigger);
    setLoadingReaction(false);
  };

  useEffect(() => {
    if (deletingComment) {
      setTimeout(() => {
        return null;
      }, 3000);
    }
  }, [deletingComment]);

  if (deletingComment) {
    return <CommentCardSkeleton />;
  }

  return (
    <div
      className={`relative mt-2 flex flex-col gap-1 w-full max-w-[285px] border bg-black bg-opacity-40 rounded-2xl p-2 ${
        comment.parentCommentId !== null &&
        "border-none rounded-none bg-transparent border-opacity-40"
      } ${!showReplys && comment.parentCommentId !== null && "border-none"}`}
    >
      {/** DELETE BUTTON */}
      {userId === comment.userUid
        ? deleteButton()
        : userId === recipe.creatorUid && deleteButton()}

      {/** COMMENT CONTENT */}
      <UserProfileTag dbUserId={comment.userUid} />
      <DateAndTime timestamp={comment.postedAt} />
      <p>{comment.comment}</p>

      {/** REPLY BUTTON */}
      <div className="flex items-center gap-2 ">
        <div
          className={`flex gap-2 w-0 ${
            showReplyInput
              ? "border border-opacity-100 p-1 w-full max-w-[230px]"
              : "border-opacity-0"
          } rounded-full transition-all duration-600`}
        >
          <Button
            onClick={() => setShowReplyInput(!showReplyInput)}
            className="btn-round min-w-[35px] p-0 text-lg"
          >
            {showReplyInput ? (
              <div className="w-4 h-[1px] bg-white rounded-full"></div>
            ) : (
              <Reply />
            )}
          </Button>

          <div className="flex gap-1 items-center">
            <Input
              value={replyText}
              onChange={(e) => {
                setReplyText(e.target.value);
              }}
              placeholder={`Reply to ${commenter?.fullName?.split(" ")[0]}...`}
              className={` border-none ${
                showReplyInput ? "w-full visible opacity-100" : "w-0  opacity-0"
              } transition-all duration-500`}
            />
          </div>
          <Button
            onClick={handleAddReply}
            className={`btn-round text-xl ${
              showReplyInput ? "opacity-100" : "opacity-0"
            } transition-all duration-500`}
          >
            <Plus />
          </Button>
        </div>
      </div>

      {/** COMMENTS AND REACTIONS */}
      <div className="flex gap-2">
        {/** COMMENT OPENER */}
        <Button
          className={` ${
            commentsPopShake &&
            "pop-shake border-yellow-400 border-opacity-40 transition-all duration-75"
          } flex gap-1 items-center max-w-[60px] max-h-[25px]  h-[25px] p-0 px-1 ${
            showReplys && comment.parentCommentId !== null && selectedString
          }`}
          onClick={() => {
            replys && replys.length > 0 && setShowReplys(!showReplys);
            showReactions && setShowReactions(false);
          }}
        >
          {replys && replys.length > 0 && (
            <span
              className={`${
                !showReplys && "-rotate-180"
              } transition-all duration-500`}
            >
              <Chevron />
            </span>
          )}
          {addingComment ? <LoaderSpinner /> : <CommentsIcon />}
          {replys && replys.length}
        </Button>

        {/** REACTION BUTTON */}
        <ItsTooltip
          tooltipClassName=" -translate-x-[24%] "
          tooltipElement={
            <div className="text-2xl flex flex-col justify-center items-center gap-2 w-fit">
              <div className="flex items-center gap-2">
                {" "}
                <span
                  onClick={() => {
                    handleAddReaction("like");
                  }}
                  className="hover:-translate-y-1  transition-all duration-400"
                >
                  <Like />
                </span>
                <span
                  onClick={() => {
                    handleAddReaction("rock-on");
                  }}
                  className="text-[28px] hover:-translate-y-1 transition-all duration-400"
                >
                  <RockOn />
                </span>
                <span
                  onClick={() => {
                    handleAddReaction("dislike");
                  }}
                  className="hover:-translate-y-1 transition-all duration-400"
                >
                  <Dislike />
                </span>
                <span
                  onClick={() => {
                    handleAddReaction("love");
                  }}
                  className="text-[28px] hover:-translate-y-1 transition-all duration-400"
                >
                  <Love />
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  onClick={() => {
                    handleAddReaction("funny");
                  }}
                  className="text-[28px] hover:-translate-y-1 transition-all duration-400"
                >
                  <Funny />
                </span>

                <span
                  onClick={() => {
                    handleAddReaction("angry");
                  }}
                  className="text-[32px] hover:-translate-y-1 transition-all duration-400"
                >
                  <Angry />
                </span>
                <span
                  onClick={() => {
                    handleAddReaction("flip-bird");
                  }}
                  className="-translate-x-1 text-[28px] hover:-translate-y-1 transition-all duration-400"
                >
                  <FlipBird />
                </span>
                {myReaction !== null && myReaction !== undefined && (
                  <span
                    onClick={() => {
                      myReaction !== null &&
                        myReaction !== undefined &&
                        handleRemoveReaction();
                    }}
                    className="-translate-x-1 text-red-400 text-[28px] hover:-translate-y-1 transition-all duration-400"
                  >
                    <None />
                  </span>
                )}
              </div>
            </div>
          }
          delay={800}
        >
          <Button
            onClick={() => {
              setShowReactions(!showReactions);
              showReplys && setShowReplys(false);
            }}
            className={`${
              reactionPopShake &&
              "pop-shake border-yellow-400 border-opacity-40 transition-all duration-75"
            } flex gap-1 items-center max-w-[60px] max-h-[25px] h-[25px] p-0 px-1`}
          >
            <span
              className={`${
                !showReactions && "-rotate-180"
              } transition-all duration-500`}
            >
              {comment.reactions && comment.reactions?.length > 0 && (
                <Chevron />
              )}
            </span>
            <span className="text-[16px]">
              {myReaction?.theReaction && !loadingReaction ? (
                <ReactionIconRenderer reaction={myReaction.theReaction} />
              ) : !loadingReaction ? (
                <ReactionsIcon />
              ) : !loadingReaction && myReaction?.theReaction === "none" ? (
                <ReactionsIcon />
              ) : (
                loadingReaction && <LoaderSpinner />
              )}
            </span>
            {comment.reactions && comment.reactions.length
              ? comment.reactions.length
              : "0"}
          </Button>
        </ItsTooltip>
      </div>

      {/** COMMENTS SECTION */}
      <div
        className={`overflow-y-scroll ${
          showReplys ? ` opacity-100 max-h-[600px] ` : "max-h-0 opacity-0"
        } transition-all duration-700 border-l border-t ${
          comment.parentCommentId !== null && selectedString
        } ${comment.parentCommentId === null && ""}
            ${comment.parentCommentId !== null && " no-scrollbar"}`}
      >
        {replys && replys.length > 0 && (
          <CommentReplys
            replys={replys}
            recipe={recipe}
            handleDeleteComment={handleDeleteComment}
            commentFetchTrigger={commentFetchTrigger}
            setCommentFetchTrigger={setCommentFetchTrigger}
          />
        )}
      </div>

      {/** REACTIONS LIST */}
      <div
        className={`overflow-y-scroll overflow-x-hidden ${
          showReactions ? ` opacity-100 max-h-[600px] ` : "max-h-0 opacity-0"
        } transition-all duration-700`}
      >
        {comment.reactions &&
          comment.reactions.length > 0 &&
          comment.reactions.map((reaction, index) => (
            <div
              className="flex flex-col gap-1 justify-center border border-slate-500 border-opacity-30 rounded-2xl p-2 w-fit bg-slate-400 bg-opacity-10"
              key={index}
            >
              <div className="flex gap-1 items-center">
                <UserProfileTag dbUserId={reaction.userUid} />
                {reaction && reaction.theReaction && (
                  <ReactionIconRenderer
                    size="32px"
                    reaction={reaction.theReaction}
                  />
                )}
              </div>
              <span className="text-xs">
                <DateAndTime timestamp={reaction.reactedAt} />
              </span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default CommentCard;
