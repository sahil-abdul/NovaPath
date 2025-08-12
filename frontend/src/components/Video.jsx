import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import videoService from "../srvices/video.service";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router";

function Video() {
  // console.log(videoId)
  const [videos, setVideos] = useState([]);
  const navigate = useNavigate();

  const incViews = async (videoId) => {
    if (videoId) {
      try {
        const data = await videoService.increaseView({ videoId });
      } catch (error) {
        console.log("error during inc view => ", error);
      }
    }
  };

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await videoService.getAllVideos();

        setVideos(data.docs);
      } catch (error) {
        console.error("Error fetching video data:", error);
      }
    };

    fetchVideos();
  }, []);
  // console.log(videos)

  return (
    <>
      {videos.map((video) => (
        // {console.log(video)}
        <Link
          to={`/video/${video._id}`}
          key={video._id}
          onClick={() => incViews(video._id)}
        >
          <div className="w-full max-w-2xl">
            <div className="relative mb-2 w-full pt-[56%]">
              <div className="absolute inset-0 rounded-2xl overflow-hidden">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="h-full w-full"
                />
              </div>
              <span className="absolute bottom-1 right-1 inline-block rounded bg-black px-1.5 text-sm">
                {Math.ceil(video.duration / 60)} min
              </span>
            </div>
            <div className="flex gap-x-2">
              <div className="h-10 w-10 shrink-0">
                <img
                  src={video.ownerDetails.avatar}
                  alt={video.ownerDetails.username}
                  className="h-full w-full rounded-full"
                />
              </div>
              <div className="w-full">
                <h6 className="mb-1 font-semibold">{video.title}</h6>
                <p className="flex text-sm text-gray-200">
                  {video.views} Views · createdAt :{" "}
                  {video.createdAt.split("T")[0]}
                </p>
                <p className="text-sm text-gray-200">
                  {video.ownerDetails.username}
                </p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </>
  );
}

export default Video;
