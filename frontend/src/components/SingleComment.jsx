import { useState, useEffect } from "react";
import commentService from "../srvices/comments.service";
import likeService from "../srvices/likes.service";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";

function SingleComment({ comment, fetchComments, userId }) {
  const [likes, setLikes] = useState([]);

  const deleteComment = async (commentId) => {
    await commentService.deleteComment(commentId);
    fetchComments();
  };
  const toggleCommentLike = async () => {
    await likeService.toggleCommentLike({ commentId: comment?._id });
    fetchCommentLike();
  };

  const fetchCommentLike = async () => {
    try {
      const likes = await likeService.getCommentLikes({
        commentId: comment?._id,
      });
      if (likes) {
        setLikes(likes);
      }
    } catch (error) {
      console.error("Error fetching comment like data:", error);
    }
  };

  useEffect(() => {
    fetchCommentLike();
  }, []);

  return (
    <>
      <div key={comment._id} className="flex flex-col">
        <div className="flex-1">
          <div className="flex gap-x-4">
            <div className="mt-2 h-11 w-11 shrink-0">
              <img
                src={comment.owner.avatar}
                alt={comment.owner.username}
                className="h-full w-full rounded-full"
              />
            </div>
            <div className="block">
              <p className="flex items-center text-[#1DCD9F]">
                {comment.owner.username}
                <span className="text-sm text-gray-300 ml-1.5">
                   · createdAt : {comment.createdAt.split("T")[0]}
                </span>
              </p>
              <p className="text-sm text-gray-200">{comment.owner.email}</p>
              <p className="mt-3 text-sm">{comment.content}</p>
            </div>
          </div>
        </div>
        <button
          className="group inline-flex items-center gap-x-1 outline-none  "
          onClick={() => toggleCommentLike()}
        >
          <ThumbUpAltIcon /> {likes.length}
        </button>
        {userId == comment.owner._id ? (
          <div className="m-1 mt-1.5">
            <button onClick={() => deleteComment(comment._id)}>delete</button>
            <hr className="my-4 border-white" />
          </div>
        ) : (
          <hr className="my-4 border-white" />
        )}
      </div>
    </>
  );
}

export default SingleComment;
