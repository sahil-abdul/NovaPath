import MailOutlineIcon from "@mui/icons-material/MailOutline";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import { useEffect, useState } from "react";
import Tweet from "../Tweet";
import tweetService from "../../srvices/tweets.service";
import { useParams } from "react-router";

function UserTweets() {
  const [tweets, setTweets] = useState();
  const { userId } = useParams();

  const FetchTweetData = async () => {
    try {
      if (userId) {
        const data = await tweetService.getChannelsTweet({ userId });
        if (data) {
          setTweets(data);
        }
      } else {
        const data = await tweetService.getUsersTweet();
        if (data) {
          setTweets(data);
        }
      }
    } catch (error) {
      console.log("users tweets error => ", error);
    }
  };


  useEffect(() => {
    FetchTweetData();
  }, []);

  // console.log(tweets);
  return (
    <>
      <div className="py-4 w-full h-full bg-black">
        {tweets && tweets.length > 0 ? (
          tweets.map((tweet) => (
            <Tweet
              tweet={tweet}
              key={tweet._id}
              FetchTweetData={FetchTweetData}
            />
            // <div
            //   key={tweet._id}
            //   className="flex gap-3 border-b border-gray-700 py-4 last:border-b-transparent"
            // >
            //   <div className="h-14 w-14 shrink-0">
            //     <img
            //       src={tweet?.owner.avatar}
            //       alt={tweet?.owner.username}
            //       className="h-full w-full rounded-full"
            //     />
            //   </div>
            //   <div className="w-full">
            //     <h4 className="mb-1 flex items-center gap-x-2">
            //       <span className="font-semibold">{tweet?.owner.username}</span>
            //
            //       <span className="inline-block text-sm text-gray-400">
            //         createdAt : {tweet?.createdAt.split("T")[0]}
            //       </span>
            //     </h4>
            //     <p className="mb-2">{tweet?.content}</p>
            //     <div className="flex gap-4">
            //       <button
            //         className="group inline-flex items-center gap-x-1 outline-none after:content-[attr(data-like-count)] focus:after:content-[attr(data-like-count-alt)]"
            //         data-like-count="425"
            //         data-like-count-alt="424"
            //       >
            //         <ThumbUpAltIcon />
            //       </button>

            //       <button onClick={() => deleteTweet(tweet._id)}>delete</button>
            //     </div>
            //   </div>
            // </div>
          ))
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
                This channel has yet to make a<strong>Tweet</strong>.
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default UserTweets;
