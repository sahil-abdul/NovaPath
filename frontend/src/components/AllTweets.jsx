import { useEffect, useState } from "react";
import tweetService from "../srvices/tweets.service";
import MailOutlineIcon from "@mui/icons-material/MailOutline";

import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import likeService from "../srvices/likes.service";
import Tweet from "./Tweet";

function AllTweets() {
  const [tweets, setTweets] = useState([]);
  const [likes, setLikes] = useState(0);
  const userdata = useSelector((state) => state.auth.userData?.user);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  //   console.log(userdata);
  const addTweet = async (data) => {
    await tweetService.addTweet(data);
    reset();
    FetchTweetData();
  };

  const deleteTweet = async (tweetId) => {
    await tweetService.deleteTweet({ tweetId });
    FetchTweetData();
  };

  const FetchTweetData = async () => {
    try {
      const data = await tweetService.getAllTweets();
      if (data) {
        setTweets(data);
      }
    } catch (error) {
      console.log("tweets fetching error -> ", error);
    }
  };

  //likes

  useEffect(() => {
    FetchTweetData();
  }, []);

  return (
    <>
      <div className="w-full h-full overflow-auto p-1.5 flex flex-col align-top bg-black gap-1.5">
        <div className="mt-2 border border-[#1DCD9F] pb-2 rounded-2xl">
          <form onSubmit={handleSubmit(addTweet)}>
            <textarea
              className="mb-2 h-10 resize-none border-none bg-transparent px-3 pt-2 outline-none"
              placeholder="Write a tweet"
              {...register("content", {
                required: true,
              })}
            />

            <div className="flex items-center justify-end gap-x-3 px-3">
              <button
                type="submit"
                className="bg-gray-600 hover:bg-black px-3 py-2 font-semibold text-black"
              >
                Send
              </button>
              {errors.content && errors.content.type === "required" && (
                <span className="text-red-400 mt-0.5" role="alert">
                  Content is required
                </span>
              )}
            </div>
          </form>
        </div>
        <div className="py-4 w-full h-full bg-black">
          {tweets && tweets.length > 0 ? (
            tweets.map((tweet) => <Tweet tweet={tweet} key={tweet._id} FetchTweetData = {FetchTweetData}/>)
          ) : (
            <div className="flex justify-center p-4">
              <div className="w-full max-w-sm text-center">
                <p className="mb-3 w-full">
                  <span className="inline-flex rounded-full bg-[#169976] p-2 text-black">
                    <span className="inline-block w-6">
                      <MailOutlineIcon />
                    </span>
                  </span>
                </p>
                <h5 className="mb-2 font-semibold">No Tweets</h5>
                <p>
                  No one has <strong>Tweeted</strong> here yet.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default AllTweets;
