import { useSelector } from "react-redux";

import { NavLink, Outlet } from "react-router";
import { use, useEffect, useState } from "react";
import subService from "../../srvices/SubscriptionService";

function MyContent() {
  const user = useSelector((state) => state.auth.userData);
  const [subscriber, setSubscriber] = useState(0);
  const [subscribed, setSubscribed] = useState(0);

  const userData = user?.user;

  const fetchSubscriberData = async () => {
    try {
      const subsribeTo = await subService.getSubscribedChannels({
        subscriberId: userData?._id,
      });
      setSubscribed(subsribeTo?.length);

      const subsribeby = await subService.getChannelSubscriber({
        channelId: userData?._id,
      });

      setSubscriber(subsribeby?.length);
    } catch (error) {
      console.log("fetching subscriber's data error -> ", error);
    }
  };

  // console.log(subscriber)

  useEffect(() => {
    fetchSubscriberData();
  }, []);

  return (
    <>
      <div className="flex min-h-[calc(100vh-66px)] sm:min-h-[calc(100vh-82px)] bg-black">
        <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
          <div className="relative min-h-[150px] w-full pt-[16.28%]">
            <div className="absolute inset-0 overflow-hidden">
              {userData?.coverimage ? (
                <img src={userData.coverimage} alt="cover-photo" />
              ) : (
                <div className="text-center">
                  <p>No coverImage uploded</p>
                </div>
              )}
            </div>
          </div>
          <div className="px-4 pb-4">
            <div className="flex flex-wrap gap-4 pb-4 pt-6">
              <span className="relative -mt-12 inline-block h-28 w-28 shrink-0 overflow-hidden rounded-full border-2">
                <img
                  src={userData?.avatar}
                  alt="Channel"
                  className="h-full w-full"
                />
              </span>
              <div className="mr-auto inline-block">
                <h1 className="font-bolg text-xl">{userData?.username}</h1>
                <p className="text-sm text-gray-400">{userData?.email}</p>
                <p className="text-sm text-gray-400">
                  {subscriber} Subscribers · {subscribed} Subscribed
                </p>
              </div>
              
            </div>
            <ul className="no-scrollbar sticky top-[66px] z-[2] flex flex-row gap-x-2 overflow-auto border-b-2 border-gray-400 bg-[#121212] py-2 sm:top-[82px]">
              <NavLink
                to="/MyContent"
                end
                className={({ isActive }) =>
                  isActive
                    ? "bg-[#1DCD9F] w-full rounded text-black"
                    : "w-full "
                }
              >
                <li className="w-full">
                  <button className="w-full border-b-2  px-3 py-1.5 text-[white]">
                    Videos
                  </button>
                </li>
              </NavLink>
              <NavLink
                to="/MyContent/playlist"
                className={({ isActive }) =>
                  isActive ? "bg-[#1DCD9F] w-full rounded text-black" : "w-full"
                }
              >
                <li className="w-full">
                  <button className="w-full border-b-2 border-transparent px-3 py-1.5 text-gray-400">
                    Playlist
                  </button>
                </li>
              </NavLink>
              <NavLink
                to="/MyContent/tweets"
                className={({ isActive }) =>
                  isActive ? "bg-[#1DCD9F] w-full rounded text-black" : "w-full"
                }
              >
                <li className="w-full">
                  <button className="w-full border-b-2 border-transparent px-3 py-1.5 text-gray-400">
                    Tweets
                  </button>
                </li>
              </NavLink>
              <NavLink
                to="/MyContent/suscribed"
                className={({ isActive }) =>
                  isActive ? "bg-[#1DCD9F] w-full rounded text-black" : "w-full"
                }
              >
                <li className="w-full">
                  <button className="w-full border-b-2 border-transparent px-3 py-1.5 text-gray-400">
                    Subscribed
                  </button>
                </li>
              </NavLink>
            </ul>
            <Outlet />
          
          </div>
        </section>
      </div>
    </>
  );
}

export default MyContent;
