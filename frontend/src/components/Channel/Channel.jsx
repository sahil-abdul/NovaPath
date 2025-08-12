import { useState, useEffect } from "react";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import subService from "../../srvices/SubscriptionService";
import {Link } from "react-router";

function Channel({ video }) {
  const [isSubscribed, setIsSubScriber] = useState(false);
  const [subCount,setSubCount] = useState(0);
  const channelId = video?.owner?._id;

  const getSubount =  async () => {
    try {
      if(channelId){
      const count = await subService.getChannelSubscriber({channelId});
      setSubCount(count.length);
      }
    } catch (error) {
      console.log("getting the sub count error => ",error)
    }
  }

  const toggleSubscription = async (channelId) => {
    try {
      const subData = await subService.toggleSubscription({ channelId });

      if (subData.data) {
        setIsSubScriber(true);
      } else {
        setIsSubScriber(false);
      }
    } catch (error) {
      console.error("Error fetching subscriber data:", error);
    }
    getSubount();
  };

  useEffect(() => {
    const checkSubOrNot = async () => {
      if (channelId) {
        try {
          const isSub = await subService.isSubscribe({ channelId });

          setIsSubScriber(isSub);
        } catch (error) {
          console.log("checking subscribe or not => ", error);
        }
      }
    };

    checkSubOrNot();
    getSubount();
  }, [channelId]);
  return (
    <>
      <div className="mt-4 flex items-center justify-between">
        <Link to={`/channel/${video?.owner?._id}`}>
          <div className="flex items-center gap-x-4">
            <div className="mt-2 h-12 w-12 shrink-0">
              <img
                src={video?.owner?.avatar}
                alt="reactpatterns"
                className="h-full w-full rounded-full"
              />
            </div>
            <div className="block">
              <p className="text-gray-200">{video?.owner?.username}</p>
              <p className="text-sm text-gray-400">{subCount} Subscribers</p>
            </div>
          </div>
        </Link>
        <div className="block">
          <button
            onClick={() => toggleSubscription(video?.owner._id)}
            className="group/btn mr-1 flex w-full items-center gap-x-2 border-[#1DCD9F] px-3 py-2 text-center font-bold text-black shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e] sm:w-auto"
          >
            <span className="inline-block w-5">
              <SubscriptionsIcon />
            </span>
            {isSubscribed ? (
              <span className="text-[#1DCD9F]">Subscribed</span>
            ) : (
              <span className="">Subscribe</span>
            )}
          </button>
        </div>
      </div>
    </>
  );
}

export default Channel;
