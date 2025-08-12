import { useEffect, useState } from "react";
import playlistService from "../srvices/playlist.service";
import { useParams } from "react-router";
import images from "../assets/images.jpeg";
import { Link } from "react-router";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

function PlayListVideo() {
  const playlistId = useParams();
  const [playlistVideo, setPlaylistvideo] = useState([]);
  const [playlist, setPlaylist] = useState();
  const userData = useSelector((state) => state.auth.userData);
  const userId = userData?.user._id;
  const navigate = useNavigate();

  const fetchPlaylist = async () => {
    try {
      const data = await playlistService.getPlayList(playlistId);
      if (data) {
        setPlaylist(data);
        setPlaylistvideo(data.videos);
      }
    } catch (error) {
      console.log("error in fetching the playlist video => ", error);
    }
  };

  const removeVideo = async (videoId, playlistId) => {
    try {
      await playlistService.removeVideoFromPlaylist({ videoId, playlistId });
      fetchPlaylist();
    } catch (error) {
      console.log("remove video from playlist error => ", error);
    }
  };

  const deletePlaylist = async () => {
    try {
      await playlistService.deletePlaylist(playlistId);
      navigate("/myContent/playlist");
    } catch (error) {
      console.log("deleting playlist error => ", error);
    }
  };

  useEffect(() => {
    fetchPlaylist();
  }, []);

  return (
    <>
      <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0 h-full justify-start bg-black">
        <div className="flex flex-wrap gap-x-4 gap-y-10 p-4 xl:flex-nowrap">
          <div className="w-full shrink-0 sm:max-w-md xl:max-w-sm">
            <div className="relative mb-2 w-full pt-[56%]">
              <div className="absolute inset-0 rounded-2xl overflow-hidden">
                <img
                  src={playlistVideo?.[0]?.thumbnail || images}
                  alt="React Mastery"
                  className="h-full w-full"
                />
                <div className="absolute inset-x-0 bottom-0">
                  <div className="relative border-t bg-white/30 p-4 text-white backdrop-blur-sm before:absolute before:inset-0 before:bg-black/40">
                    <div className="relative z-[1]">
                      <p className="flex justify-between">
                        <span className="inline-block">Playlist</span>
                        <span className="inline-block">
                          {playlistVideo.length}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <h6 className="mb-1 font-semibold">{playlist?.name}</h6>
            <p className="flex text-sm text-gray-200">
              {playlist?.description}
            </p>
            <div className="mt-6 flex items-center gap-x-3">
              <div className="h-16 w-16 shrink-0">
                <img
                  src={playlist?.owner.avatar}
                  alt="React Patterns"
                  className="h-full w-full rounded-full"
                />
              </div>
              <div className="w-full">
                <h6 className="font-semibold">{playlist?.owner.username}</h6>
              </div>
              {playlist?.owner._id == userId && (
                <button
                  className="bg-[#222222] hover:bg-black"
                  onClick={deletePlaylist}
                >
                  delete
                </button>
              )}
            </div>
          </div>
          <div className="flex w-full flex-col gap-y-4">
            {playlistVideo && playlistVideo.length > 0 ? (
              playlistVideo.map((video) => (
                <div
                  key={video._id}
                  className="border rounded-2xl p-1.5 border-[#1DCD9F]"
                >
                  <Link to={`/video/${video._id}`}>
                    <div className="w-full max-w-3xl gap-x-4 sm:flex">
                      <div className="relative mb-2 w-full sm:mb-0 sm:w-5/12">
                        <div className="w-full pt-[56%]">
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
                      </div>
                      <div className="flex gap-x-2 px-2 sm:w-7/12 sm:px-0">
                        {/* <div className="h-10 w-10 shrink-0 sm:hidden">
                          <img
                            src="https://images.pexels.com/photos/3532545/pexels-photo-3532545.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                            alt="codemaster"
                            className="h-full w-full rounded-full"
                          />
                        </div> */}
                        <div className="w-full">
                          <h6 className="mb-1 font-semibold sm:max-w-[75%]">
                            {video.title}
                          </h6>
                          <p className="flex text-sm text-gray-200 sm:mt-3">
                            {video.views} Views · createdAt :{" "}
                            {video.createdAt.split("T")[0]}
                          </p>
                          <div className="flex items-center gap-x-4">
                            <div className="mt-2 hidden h-10 w-10 shrink-0 sm:block">
                              <img
                                src={video.owner.avatar}
                                alt={video.owner.username}
                                className="h-full w-full rounded-full"
                              />
                            </div>
                            <p className="text-sm text-gray-200">
                              {video.owner.username}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                  {playlist?.owner._id == userId && (
                    <button
                      className="mt-2 bg-gray-900 hover:bg-black"
                      onClick={() => removeVideo(video._id, playlist._id)}
                    >
                      Remove from playlist
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div>
                <h1> no videos avalable in this playlist</h1>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default PlayListVideo;
