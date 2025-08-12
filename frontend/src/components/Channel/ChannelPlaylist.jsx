import { useEffect, useState } from "react";
import playlistService from "../../srvices/playlist.service";
import images from "../../assets/images.jpeg";
import QueuePlayNextIcon from "@mui/icons-material/QueuePlayNext";
import { Link, useParams } from "react-router";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";

function ChannelPlaylist() {
  const [playlists, setPlaylists] = useState([]);
  const { userId } = useParams();
//   console.log(userId)

  const fetchPlaylists = async () => {
    try {
      const data = await playlistService.getUserPlaylist({userId});

      if (data) {
        setPlaylists(data);
      }
    } catch (error) {
      console.log("playlist fetching error => ", error);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);
  return (
    <>
      <div className="pt-2 flex w-full flex-wrap gap-4 justify-start sm:justify-start">
        {playlists && playlists.length > 0 ? (
          playlists.map((playlist) => (
            <Link to={`/playlist/${playlist._id}`} key={playlist._id}>
              <div className="w-full max-w-[400px] min-w-[400px] ">
                <div className="relative mb-2 w-full pt-[56%] ">
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
          <div className="w-full flex justify-center p-4">
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

export default ChannelPlaylist;
