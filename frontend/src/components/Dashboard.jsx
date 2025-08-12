import { useSelector } from "react-redux";
import videoService from "../srvices/video.service";
import Header from "./Header";
import AddBoxIcon from "@mui/icons-material/AddBox";
import DeleteSweepTwoToneIcon from "@mui/icons-material/DeleteSweepTwoTone";
import EditSquareIcon from "@mui/icons-material/EditSquare";
import { useState, useEffect } from "react";
import EditVideo from "./EditVideo";
import UploadVideo from "./UploadVideo";
import VideoSettingsIcon from '@mui/icons-material/VideoSettings';
import { Await, useNavigate } from "react-router";

function Dashboard() {
  const owner = useSelector((state) => state.auth.userData?.user);
  const [videos, setVideos] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [updDetail, setUpdDetail] = useState({});
  const navigate = useNavigate();

  const fetchVideos = async () => {
    try {
      const data = await videoService.getAllUserVideo();
      setVideos(data);
    } catch (error) {
      console.error("Error fetching video data:", error);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const togglePublish = async (videoId) => {
    await videoService.togglePublish(videoId);
    fetchVideos();
  };

  const edit = (video) => {
    setUpdDetail(video);
    setShowEdit(!showEdit);
  };

  const deleteVideo = async (videoId) => {
    await videoService.deleteVideo({ videoId });
    fetchVideos();
  }

  // console.log(data);


  // console.log("hello")
  // console.log(videos)

  return (
    <>
      <div className="w-full">
        <div className="h-screen overflow-y-auto bg-[#121212] text-white">
          <Header />

          <div className="flex min-h-[calc(100vh-66px)] sm:min-h-[calc(100vh-82px)] ">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-y-6 px-4 py-8">
              <div className="flex flex-wrap justify-between gap-4">
                <div className="block">
                  <h1 className="text-2xl font-bold">
                    Welcome Back,{" "}
                    <span className="text-[#169976]">{owner?.username}</span>
                  </h1>
                  <p className="text-sm text-gray-300">
                    Seamless Video Management, Elevated Results.
                  </p>
                </div>
                <div className="block">
                  <button
                    className="inline-flex items-center gap-x-2 px-3 py-2 font-semibold"
                    onClick={() => navigate("/uploadVideo")}
                  >
                    <AddBoxIcon /> Upload video
                  </button>
                </div>
              </div>
              {videos && videos.length > 0 && <div className="w-full overflow-auto">
                <table className="w-full min-w-[1200px] border-collapse border border-[#169976] text-white">
                  <thead>
                    <tr>
                      <th className="border-collapse border-[#169976] border-b p-4">
                        Status
                      </th>
                      <th className="border-collapse border-[#169976] border-b p-4">
                        Status
                      </th>
                      <th className="border-collapse border-[#169976] border-b p-4">
                        Uploaded
                      </th>
                      <th className="border-collapse border-[#169976] border-b p-4">
                        Rating
                      </th>
                      <th className="border-collapse border-[#169976] border-b p-4">
                        Date uploaded
                      </th>
                      <th className="border-collapse border-[#169976] border-b p-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {videos?.map((video) => (
                      <tr
                        className=" group border border-[#169976]"
                        key={video._id}
                      >
                        <td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
                          <div className="flex justify-center">
                            <label
                              htmlFor={video._id}
                              className="relative inline-block w-12 cursor-pointer overflow-hidden"
                            >
                              <input
                                type="checkbox"
                                id={video._id}
                                className="peer sr-only"
                                checked={video.isPublished}
                                onChange={() => togglePublish(video._id)}
                              />
                              <span className="inline-block h-6 w-full rounded-2xl bg-gray-200 duration-200 after:absolute after:bottom-1 after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-black after:duration-200 peer-checked:bg-[#169976] peer-checked:after:left-7"></span>
                            </label>
                          </div>
                        </td>
                        <td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
                          <div className="flex justify-center">
                            {video.isPublished ? (
                              <span className="inline-block rounded-2xl border px-1.5 py-0.5 border-green-600 text-green-600">
                                Published
                              </span>
                            ) : (
                              <span className="inline-block rounded-2xl border px-1.5 py-0.5 border-red-500 text-red-600">
                                Unpublished
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
                          <div className="flex items-center gap-4">
                            <img
                              className="h-10 w-10 rounded-full"
                              src={video.thumbnail}
                              alt={video.title}
                            />
                            <h3 className="font-semibold">{video.title}</h3>
                          </div>
                        </td>
                        <td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
                          <div className="flex justify-center gap-4">
                            <span className="inline-block rounded-xl bg-green-200 px-1.5 py-0.5 text-green-700">
                              921 likes
                            </span>
                            <span className="inline-block rounded-xl bg-red-200 px-1.5 py-0.5 text-red-700">
                              49 dislikes
                            </span>
                          </div>
                        </td>
                        <td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
                          {video.createdAt.split("T")[0]}
                        </td>
                        <td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
                          <div className="flex gap-4">
                            <button className="h-5 w-5 p-0.5 flex justify-center items-center" onClick={(() => deleteVideo(video._id))}>
                              <DeleteSweepTwoToneIcon />
                            </button>
                            <button
                              className="h-5 w-5 p-0.5 flex justify-center items-center"
                              onClick={() => edit(video)}
                            >
                              <EditSquareIcon />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>}
              {videos.length == 0 && <div className="flex h-full items-center justify-center">
                <div className="w-full max-w-sm text-center">
                  <p className="mb-3 w-full">
                    <span className="inline-flex rounded-full bg-[#169976] p-2 text-black">
                      <VideoSettingsIcon />
                    </span>
                  </p>
                  <h5 className="mb-2 font-semibold text-[#169976]">No videos available</h5>
                  <p>You haven’t uploaded any videos yet. Please upload a video to view its status or try searching for something else.</p>
                </div>
              </div>}


            </div>
          </div>
        </div>
        <EditVideo show={showEdit} videoData={updDetail} />
      </div>
      {/* <UploadVideo /> */}
    </>
  );
}

export default Dashboard;
