import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import videoService from "../srvices/video.service";
import { useNavigate } from "react-router";

function EditVideo({ show, videoData }) {
  const [isShow, setIsShow] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [preImage, setPreImage] = useState(null);
  const navigate = useNavigate();
  const image = watch("thumbnail");

  useEffect(() => {
    show ? setIsShow(true) : setIsShow(false);
  }, [show]);

  useEffect(() => {
    if (image && image[0]) {
      const file = image[0];
      setPreImage(URL.createObjectURL(file));
    } else {
      setPreImage(null);
    }
  }, [image]);

  // console.log(image)

  const update = async (data) => {
    try {
      data.videoId = videoData._id;
      await videoService.updateVideo(data);
      setIsShow(false);
      navigate("/");
    } catch (error) {
      console.log("video upadate error || ", error);
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 top-[calc(66px)] z-10 flex flex-col bg-black/50 px-4 pb-[86px] pt-4 sm:top-[calc(82px)] sm:px-14 sm:py-8 ${
          isShow ? "visible" : "invisible "
        }`}
      >
        <div className="mx-auto w-full max-w-lg rounded-lg border border-gray-700 bg-[#121212] p-4 overflow-auto">
          <div className="mb-4 flex items-start justify-between">
            <h2 className="text-xl font-semibold">
              Edit Video
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
          <form onSubmit={handleSubmit(update)}>
            <label htmlFor="thumbnail" className="mb-1 inline-block">
              Thumbnail
              <sup>*</sup>
            </label>
            <label
              className="relative mb-4 block cursor-pointer border border-dashed p-2 after:absolute after:inset-0 after:bg-transparent hover:after:bg-black/10"
              htmlFor="thumbnail"
            >
              <input
                type="file"
                className="sr-only"
                defaultValue={videoData?.thumbnail}
                id="thumbnail"
                {...register("thumbnail", {
                  required: true,
                })}
              />
              <img
                src={preImage || videoData?.thumbnail}
                alt={videoData?.title}
              />
              {errors.thumbnail && errors.thumbnail.type === "required" && (
                <span className="text-red-400 mt-0.5" role="alert">
                  new thumbnail is required
                </span>
              )}
            </label>
            <div className="mb-6 flex flex-col gap-y-4">
              <div className="w-full">
                <label htmlFor="title" className="mb-1 inline-block">
                  Title
                  <sup>*</sup>
                </label>
                <input
                  id="title"
                  defaultValue={videoData?.title}
                  type="text"
                  className="w-full border bg-transparent px-2 py-1 outline-none"
                  {...register("title", {
                    required: true,
                  })}
                />
                {errors.title && errors.title.type === "required" && (
                  <span className="text-red-400" role="alert">
                    Title is required
                  </span>
                )}
              </div>
              <div className="w-full">
                <label htmlFor="desc" className="mb-1 inline-block">
                  Description
                  <sup>*</sup>
                </label>
                <textarea
                  id="desc"
                  className="h-40 w-full resize-none border bg-transparent px-2 py-1 outline-none"
                  defaultValue={videoData?.description}
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
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default EditVideo;
