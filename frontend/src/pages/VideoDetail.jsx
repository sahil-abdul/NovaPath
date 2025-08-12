import { useParams } from "react-router";
import { Header, Video } from "../components";
import SideNav from "../components/SideNav";
import videoService from "../srvices/video.service";
import { useState, useEffect } from "react";
import { useLocation } from "react-router";
import Comments from "../components/Comments";
import authService from "../srvices/auth.service";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { userLogin } from "../app/authSlice";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";

import subService from "../srvices/SubscriptionService";
import likeService from "../srvices/likes.service";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import playlistService from "../srvices/playlist.service";
import Channel from "../components/Channel/Channel";

function VideoDetail() {
  const [flashMessage, setFlashMessage] = useState("");
  const { videoId } = useParams();
  const [playlists, setPlaylists] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [likes, setLikes] = useState([]);
  const [video, setVideo] = useState({});

  

  const triggerFlashMessage = (msg) => {
    incViews();
    setFlashMessage(msg);
    setTimeout(() => setFlashMessage(""), 3000); // hide after 3s
  };

  const addToPlayList = async ({ playlistId, videoId }) => {
    try {
      const done = await playlistService.addVideoToPlayList({
        playlistId,
        videoId,
      });
      if (done) {
        triggerFlashMessage("video added to playlist");
      }
    } catch (error) {
      console.log("adding video to playlist => ", error);
    }
  };

  const fetchPlaylists = async () => {
    try {
      const data = await playlistService.getOwnersPlaylist();
      if (data) {
        setPlaylists(data);
      }
    } catch (error) {
      console.log("playlist fetching error => ", error);
    }
  };

  const toggleVideoLike = async () => {
    await likeService.toggleVideoLike({ videoId });
    fetchVideoLike();
  };

  const fetchVideoLike = async () => {
    try {
      const likes = await likeService.getVideoLikes({ videoId });
      if (likes) {
        setLikes(likes);
      }
    } catch (error) {
      console.error("Error fetching vide like data:", error);
    }
  };

  // console.log(isSubscribed);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const userData = await authService.getUser();

        if (userData) {
          dispatch(userLogin(userData.data.data));
        } else {
          dispatch(userLogout());
          navigate("/login");
          return;
        }

        const data = await videoService.getVideo({ videoId });
        setVideo(data);
        fetchVideoLike();
        fetchPlaylists();
      } catch (error) {
        console.error("Error fetching video data:", error);
      }
    };

    fetchVideos();
  }, [videoId, dispatch, navigate, location]);

  return (
    <>
      <div className="h-screen overflow-y-auto bg-[#121212] text-white">
        <Header />
        {flashMessage && (
          <div className="w-full flex justify-center items-center">
            <div className="mb-4 bg-green-600 px-3 py-2 text-2xl absolute z-50 w-1/3 border rounded-2xl p-4  text-white">
              {flashMessage}
            </div>
          </div>
        )}
        <div className="flex min-h-[calc(100vh-66px)] sm:min-h-[calc(100vh-82px)]">
          <aside className="group fixed inset-x-0 bottom-0 z-40 w-full shrink-0 border-t border-[#1DCD9F] bg-[#121212] px-2 py-2 sm:absolute sm:inset-y-0 sm:max-w-[70px] sm:border-r sm:border-t-0 sm:py-6 sm:hover:max-w-[250px]">
            <SideNav isDetail={true} />
          </aside>
          <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0">
            <div className="flex w-full flex-wrap gap-4 p-4 lg:flex-nowrap">
              <div className="col-span-12 w-full">
                <div className="relative mb-4 w-full pt-[56%]">
                  <div className="absolute inset-0">
                    {video && video?.videoFile && (
                      <video
                        key={video._id}
                        className="h-full w-full"
                        controls={true}
                        autoPlay={true}
                        muted={true}
                      >
                        <source src={video?.videoFile} type="video/mp4" />
                      </video>
                    )}
                  </div>
                </div>
                <div
                  className="group mb-4 w-full bg-[#ffffff1A] rounded-lg p-4 duration-200 hover:bg-white/5 focus:bg-white/5"
                  role="button"
                  tabIndex="0"
                >
                  {/* vide detail */}
                  <div className="flex flex-wrap gap-y-2">
                    <div className="w-full md:w-1/2 lg:w-full xl:w-1/2">
                      <h1 className="text-lg font-bold">{video.title}</h1>
                      <p className="flex text-sm text-gray-200">
                        {video.views} Views · createdAt :{" "}
                        {video.createdAt?.split("T")[0]}
                      </p>
                    </div>

                    {/* like buttons */}
                    <div className="w-full md:w-1/2 lg:w-full xl:w-1/2">
                      <div className="flex items-center justify-between gap-x-4 md:justify-end lg:justify-between xl:justify-end">
                        <div className="flex rounded-lg gap-1.5">
                          <button
                            className="group/btn flex items-center gap-x-2 border-r border-gray-700 px-4 py-1.5  hover:bg-white/10 "
                            onClick={toggleVideoLike}
                          >
                            <span className="inline-block w-5 group-focus/btn:text-[#169976] ">
                              <ThumbUpAltIcon />
                            </span>
                            {likes?.length}
                          </button>
                        </div>
                        <div className="relative block">
                          <button className="peer flex items-center gap-x-2 rounded-lg px-4 py-1.5 text-black">
                            <span className="inline-block w-5">
                              <BookmarkAddIcon />
                            </span>
                            Save
                          </button>
                          <div className="absolute right-0 top-full z-10 hidden w-64 overflow-hidden rounded-lg bg-[#121212] p-4 shadow shadow-slate-50/30 hover:block peer-focus:block">
                            <h3 className="mb-4 text-center text-lg font-semibold">
                              Save to playlist
                            </h3>

                            <ul className="mb-4">
                              {playlists &&
                                playlists.length > 0 &&
                                playlists.map((playlist) => (
                                  <li
                                    className="mb-2 last:mb-0 flex justify-between items-center"
                                    key={playlist._id}
                                  >
                                    <span>{playlist.name}</span>
                                    <button
                                      onClick={() =>
                                        addToPlayList({
                                          playlistId: playlist._id,
                                          videoId: video._id,
                                        })
                                      }
                                    >
                                      add
                                    </button>
                                  </li>
                                ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* logo and subscriber */}
                  <Channel video={video} />

                  <hr className="my-4 border-white" />
                  {/* description */}
                  <div className="h-5 overflow-hidden group-focus:h-auto">
                    <p className="text-sm">{video?.description}</p>
                  </div>
                </div>
                <button className="peer w-full rounded-lg border p-4 text-left duration-200 hover:bg-white/5 focus:bg-white/5 sm:hidden">
                  <h6 className="font-semibold"> Comments...</h6>
                </button>

                <Comments videoId={video._id} />
              </div>
              <div className="col-span-12 flex w-full shrink-0 flex-col gap-3 lg:w-[350px] xl:w-[400px]">
                <Video />
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default VideoDetail;
