import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import { NavLink, Outlet, useParams } from "react-router";
import { useEffect, useState } from "react";
import userService from "../../srvices/user.service";
import subService from "../../srvices/SubscriptionService";

function ChannelProfile() {
  const { userId } = useParams();
  const [channelData, setChannelData] = useState({});

  const toggleSubscription = async (channelId) => {
    try {
      const subData = await subService.toggleSubscription({ channelId });

      fetchChannelData();
    } catch (error) {
      console.error("Error fetching subscriber data:", error);
    }
  };

  const fetchChannelData = async () => {
    try {
      const data = await userService.getUserChannel({ userId });
      if (data) {
        setChannelData(data);
      }
    } catch (error) {
      console, log("fetching the channel data error => ", error);
    }
  };

  useEffect(() => {
    fetchChannelData();
  }, []);

  return (
    <>
      <div className="h-screen flex min-h-[calc(100vh-66px)] sm:min-h-[calc(100vh-82px)] bg-black">
        <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
          <div className="relative min-h-[150px] w-full pt-[16.28%]">
            <div className="absolute inset-0 overflow-hidden">
              {channelData?.coverimage ? (
                <img src={channelData.coverimage} alt="cover-photo" />
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
                  src={channelData?.avatar}
                  alt="Channel"
                  className="h-full w-full"
                />
              </span>
              <div className="mr-auto inline-block">
                <h1 className="font-bolg text-xl">{channelData?.username}</h1>
                <p className="text-sm text-gray-400">{channelData?.email}</p>
                <p className="text-sm text-gray-400">
                  {channelData?.subscribersCount} Subscribers · 
                  {channelData?.subscribeToChannelCount} Subscribed
                </p>
              </div>
              <div className="block">
                <button
                  onClick={() => toggleSubscription(userId)}
                  className="group/btn mr-1 flex w-full items-center gap-x-2 border-[#1DCD9F] px-3 py-2 text-center font-bold text-black shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e] sm:w-auto"
                >
                  <span className="inline-block w-5">
                    <GroupOutlinedIcon />
                  </span>
                  {channelData?.isSubscribe ? (
                    <span className="text-[#1DCD9F]">Subscribed</span>
                  ) : (
                    <span className="">Subscribe</span>
                  )}
                </button>
              </div>
            </div>
            <ul className="no-scrollbar sticky top-[66px] z-[2] flex flex-row gap-x-2 overflow-auto border-b-2 border-gray-400 bg-[#121212] py-2 sm:top-[82px]">
              <NavLink
                to={`/channel/${userId}`}
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
                to={`/channel/${userId}/playlist`}
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
                to={`/channel/${userId}/tweets`}
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
                to={`/channel/${userId}/suscribed`}
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

export default ChannelProfile;
