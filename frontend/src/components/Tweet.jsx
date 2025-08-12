import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import likeService from "../srvices/likes.service";
import tweetService from "../srvices/tweets.service";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";

function Tweet({ tweet, FetchTweetData }) {
  const [likes, setLikes] = useState([]);
  const userdata = useSelector((state) => state.auth.userData?.user);

  const deleteTweet = async (tweetId) => {
    await tweetService.deleteTweet({ tweetId });
    FetchTweetData();
  };

  const toggleTweetLike = async () => {
    await likeService.toggleTweetLike({ tweetId: tweet?._id });
    fetchTweetLike();
  };

  const fetchTweetLike = async () => {
    try {
      const likes = await likeService.getTweetLikes({ tweetId: tweet?._id });
      if (likes) {
        setLikes(likes);
      }
    } catch (error) {
      console.error("Error fetching vide like data:", error);
    }
  };

  useEffect(() => {
    fetchTweetLike();
  },[])
  return (
    <>
      <div className="flex gap-3 border-b border-gray-700 py-4 last:border-b-transparent">
        <div className="h-14 w-14 shrink-0">
          <img
            src={tweet?.owner.avatar}
            alt={tweet?.owner.username}
            className="h-full w-full rounded-full"
          />
        </div>
        <div className="w-full">
          <h4 className="mb-1 flex items-center gap-x-2">
            <span className="font-semibold">{tweet?.owner.username}</span> 
            <span className="inline-block text-sm text-gray-400">
              createdAt : {tweet?.createdAt.split("T")[0]}
            </span>
          </h4>
          <p className="mb-2">{tweet?.content}</p>
          <div className="flex gap-4">
            <button
              className="group inline-flex items-center gap-x-1 outline-none  "
              onClick={() => toggleTweetLike()}
            >
              <ThumbUpAltIcon /> {likes.length}
            </button>
            {userdata && userdata?._id === tweet.owner._id && (
              <button onClick={() => deleteTweet(tweet._id)}>delete</button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Tweet;
