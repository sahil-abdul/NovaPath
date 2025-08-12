import { useState, useEffect } from "react";
import videoService from "../../srvices/video.service";
import VideoSettingsIcon from "@mui/icons-material/VideoSettings";
// import { duration } from "@mui/material/styles";
import { Link, useParams } from "react-router";

function OwnersVideo() {
  const [videos, setVideos] = useState([]);
  const { userId } = useParams();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        if (userId) {
          const data = await videoService.getChannelsVideo({
            channelId: userId,
          });
          setVideos(data);
        } else {
          const data = await videoService.getAllUserVideo();
          setVideos(data);
        }
      } catch (error) {
        console.error("Error fetching video data:", error);
      }
    };

    fetchVideos();
  }, []);

  // console.log(videos[0])
  return (
    <div className="flex flex-wrap gap-4 pt-2 w-full sm:justify-center lg:justify-start">
      {videos && videos.length > 0 ? (
        videos?.map((video) => (
          <Link to={`/video/${video._id}`} key={video._id}>
            <div className="max-w-[300px] min-w-[270px]">
              <div className="relative mb-2 w-full pt-[56%] ">
                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="h-full w-full"
                  />
                </div>
                <span className="absolute bottom-1 right-1 inline-block rounded bg-black px-1.5 text-sm">
                  {Math.floor(video.duration)} sec
                </span>
              </div>
              <h6 className="mb-1 font-semibold">{video.title}</h6>
              <p className="flex text-sm text-gray-200">
                {video.views} Views · createdAt :{" "}
                {video.createdAt.split("T")[0]}
              </p>
            </div>
          </Link>
        ))
      ) : (
        <div className="flex justify-center p-4 w-full">
          <div className="w-full max-w-sm text-center">
            <p className="mb-3 w-full">
              <span className="inline-flex rounded-full bg-[#1DCD9F] p-2 text-black">
                <VideoSettingsIcon />
              </span>
            </p>
            <h5 className="mb-2 font-semibold">No videos uploaded</h5>
            <p>
              This page has yet to upload a video. Search another page in order
              to find more videos.
            </p>
          </div>
        </div>
      )}
    </div>
    //   </div >
  );
}

export default OwnersVideo;
