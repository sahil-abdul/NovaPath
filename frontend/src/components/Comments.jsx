import commentService from "../srvices/comments.service";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import SingleComment from "./SingleComment";

function Comments({ videoId }) {
  const { register, handleSubmit, reset } = useForm();
  const [comments, setComments] = useState([]);
  const user = useSelector((state) => state.auth.userData);

  const fetchComments = async () => {
    if (videoId) {
      try {
        const data = await commentService.getVideoComments({ videoId });
        if (data) {
          setComments(data);
        }
      } catch (error) {
        console.error("Error fetching comment data:", error);
      }
    }
  };

  const userId = user?.user._id;

  const id = videoId;

  // const deleteComment = async (commentId) => {
  //   await commentService.deleteComment(commentId);
  //   fetchComments();
  // };

  const addComment = async (data) => {
    await commentService.addcomment(data, videoId);
    reset();
    fetchComments();
  };

  useEffect(() => {
    fetchComments();
  }, [id]);

  return (
    <>
      <div className="fixed inset-x-0 top-full z-[60] h-[calc(100%-69px)] overflow-auto rounded-lg border border-[#1DCD9F] bg-[#121212] p-4 duration-200 hover:top-[67px] peer-focus:top-[67px] sm:static sm:h-auto sm:max-h-[500px] lg:max-h-none">
        <div className="block ">
          <h6 className="mb-4 font-semibold">{comments.length} Comments</h6>
          <form
            onSubmit={handleSubmit(addComment)}
            className="w-full flex justify-around"
          >
            <input
              type="text"
              className="w-3/4 rounded-lg border bg-transparent px-2 py-1 placeholder-white"
              placeholder="Add a Comment"
              {...register("content", {
                required: true,
              })}
            />
            <button>add</button>
          </form>
        </div>
        <hr className="my-4 border-white" />
        <div className=" ">
          {comments &&
            comments.map((comment) => (
              <SingleComment
                key={comment._id}
                userId={userId}
                comment={comment}
                fetchComments={fetchComments}
              />
            ))}
        </div>
      </div>
    </>
  );
}

export default Comments;
