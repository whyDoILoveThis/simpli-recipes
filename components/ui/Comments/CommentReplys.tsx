import React from "react";
import CommentCard from "./CommentCard";

interface Props {
  replys: Comment[];
  recipe: Recipe;
  handleDeleteComment: (id: string, uid: string) => void;
  commentFetchTrigger: boolean;
  setCommentFetchTrigger: (param: boolean) => void;
}

const CommentReplys = ({
  replys,
  recipe,
  handleDeleteComment,
  commentFetchTrigger,
  setCommentFetchTrigger,
}: Props) => {
  return (
    <div>
      {replys.map((reply) => (
        <CommentCard
          key={reply.commentUid}
          comment={reply}
          recipe={recipe}
          handleDeleteComment={handleDeleteComment}
          commentFetchTrigger={commentFetchTrigger}
          setCommentFetchTrigger={setCommentFetchTrigger}
        />
      ))}
    </div>
  );
};

export default CommentReplys;
