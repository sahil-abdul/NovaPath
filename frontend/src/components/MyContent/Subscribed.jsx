import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import subService from "../../srvices/SubscriptionService";
import { useEffect, useState } from "react";
function Subscribed() {
  const userData = useSelector((state) => state.auth.userData);
  const { userId = userData?.user._id } = useParams();
  const [channels, setChannels] = useState([]);
  const subscriberId = userId

  const fetchVideos = async () => {
    try {
      const data = await subService.getSubscribedChannels({ subscriberId });
      setChannels(data);
    } catch (error) {
      console.error("Error fetching subscriber data:", error);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  //   console.log(channels);

  return (
    <>
      {channels && channels.length > 0 ? (
        channels.map((data) => (
          <div key={data?._id} className="flex flex-col gap-y-4 py-4 w-full">
            <div className="flex w-full justify-between h-full">
              <div className="flex items-center gap-x-2">
                <div className="h-14 w-14 shrink-0">
                  <img
                    src={data?.channel.avatar}
                    alt={data?.channel.username}
                    className="h-full w-full rounded-full"
                  />
                </div>
                <div className="block">
                  <h6 className="font-semibold">{data?.channel.username}</h6>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="flex justify-center p-4">
          <div className="w-full max-w-sm text-center">
            <p className="mb-3 w-full">
              <span className="inline-flex rounded-full bg-[#169976] p-2 text-black">
                <span className="inline-block w-6">
                  <PeopleOutlineIcon />
                </span>
              </span>
            </p>
            <h5 className="mb-2 font-semibold">No people subscribers</h5>
            <p>
              This channel has yet to
              <strong>subscribe</strong>a new channel.
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default Subscribed;
