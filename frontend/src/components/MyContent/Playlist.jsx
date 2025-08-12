import { useEffect, useState } from "react";
import playlistService from "../../srvices/playlist.service";
import images from "../../assets/images.jpeg";
import QueuePlayNextIcon from "@mui/icons-material/QueuePlayNext";
import { Link } from "react-router";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";


function Playlist() {
  const [playlists, setPlaylists] = useState([]);
  const [isShow, setIsShow] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

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

  const createPlaylist = async (data) => {
    try {
      await playlistService.createPlayList(data);
      setIsShow(false);
      fetchPlaylists();
    } catch (error) {
      console.log("creating playlist error => ", error);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  return (
    <>
    {}
      <button
        className="bg-gray-600 m-1.5 hover:bg-black"
        onClick={() => setIsShow(true)}
      >
        create playlist
      </button>
      <div
        className={`fixed inset-0 top-[calc(66px)] z-10 flex flex-col bg-black/50 px-4 pb-[86px] pt-4 sm:top-[calc(82px)] sm:px-14 sm:py-8 ${
          isShow ? "visible" : "invisible "
        }`}
      >
        <div className="mx-auto w-full max-w-lg rounded-lg border border-gray-700 bg-[#121212] p-4 overflow-auto">
          <div className="mb-4 flex items-start justify-between">
            <h2 className="text-xl font-semibold">
              create playlist
              <span className="block text-sm text-gray-300">
                Share where you&#x27;ve worked on your profile.
              </span>
            </h2>
            <button
              className="h-6 w-6 flex justify-center items-center"
              onClick={() => setIsShow(false)}
            >
              <CloseIcon />
            </button>
          </div>
          <form onSubmit={handleSubmit(createPlaylist)}>
            <div className="mb-6 flex flex-col gap-y-4">
              <div className="w-full">
                <label htmlFor="name" className="mb-1 inline-block">
                  Playlist Name
                  <sup>*</sup>
                </label>
                <input
                  id="name"
                  type="text"
                  className="w-full border bg-transparent px-2 py-1 outline-none"
                  {...register("name", {
                    required: true,
                  })}
                />
                {errors.name && errors.name.type === "required" && (
                  <span className="text-red-400" role="alert">
                    Playlist Name is required
                  </span>
                )}
              </div>
              <div className="w-full">
                <label htmlFor="desc" className="mb-1 inline-block">
                  Description
                  <sup>*</sup>
                </label>
                <textarea
                  id="description"
                  className="h-40 w-full resize-none border bg-transparent px-2 py-1 outline-none"
                  //   defaultValue={videoData?.description}
                  {...register("description", { required: true })}
                />
                {errors.description &&
                  errors.description.type === "required" && (
                    <span className="text-red-400" role="alert">
                      description is required
                    </span>
                  )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button
                className="border px-4 py-3"
                onClick={() => setIsShow(false)}
              >
                Cancel
              </button>
              <button type="submit" className=" px-4 py-3 text-black">
                create
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="pt-2 flex flex-wrap gap-4 justify-start sm:justify-start">
        {playlists && playlists.length > 0 ? (
          playlists.map((playlist) => (
            <Link to={`/playlist/${playlist._id}`} key={playlist._id}>
              <div className="w-full max-w-[400px] min-w-[400px]">
                <div className="relative mb-2 w-full pt-[56%]">
                  <div className="absolute inset-0 rounded-2xl overflow-hidden">
                    <img
                      src={playlist.videos[0]?.thumbnail || images}
                      alt="React Mastery"
                      className="h-full w-full"
                    />
                    <div className="absolute inset-x-0 bottom-0">
                      <div className="relative border-t bg-white/30 p-4 text-white backdrop-blur-sm before:absolute before:inset-0 before:bg-black/40">
                        <div className="relative z-[1]">
                          <p className="flex justify-between">
                            <span className="inline-block">Playlist</span>
                            <span className="inline-block">
                              {playlist.videos.length} videos
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <h6 className="mb-1 font-semibold">{playlist.name}</h6>
                <p className="flex text-sm text-gray-200">
                  {playlist?.description}
                </p>
              </div>
            </Link>
          ))
        ) : (
          <div className="flex justify-center p-4">
            <div className="w-full max-w-sm text-center">
              <p className="mb-3 w-full">
                <span className="inline-flex rounded-full bg-[#169976] p-2 text-black">
                  <span className="inline-block w-6">
                    <QueuePlayNextIcon />
                  </span>
                </span>
              </p>
              <h5 className="mb-2 font-semibold">No playlist created</h5>
              <p>There are no playlist created on this channel.</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Playlist;
