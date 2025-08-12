import { useForm } from "react-hook-form";
import { useState } from "react";
import videoService from "../srvices/video.service";
import { TrophySpin } from "react-loading-indicators";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import { useNavigate } from "react-router";

function UploadVideo() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [vidData, setVidData] = useState();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const uploadVideo = async (data) => {
    setVidData(data);
    setLoading(true);
    await videoService.uploadVideo(data);
    setLoading(false);
    navigate("/");
  };

  return loading ? (
    <div className="absolute inset-x-0 top-0 z-10 flex h-[calc(100vh-66px)] items-center justify-center bg-black/50 px-4 pb-[86px] pt-4 sm:h-[calc(100vh-82px)] sm:px-14 sm:py-8">
      <div className="w-full max-w-lg overflow-auto rounded-lg border border-gray-700 bg-[#121212] p-4">
        <div className="mb-4 flex items-start justify-between">
          <h2 className="text-xl font-semibold">
            Uploading Video...
            <span className="block text-sm text-gray-300">
              Track your video uploading process.
            </span>
          </h2>
        </div>

        <div className="mb-6 flex gap-x-2 border rounded-2xl border-[#169976] p-3">
          <div className="w-8 shrink-0">
            <span className="inline-block w-full rounded-full bg-[#169976] p-1 text-black">
              <OndemandVideoIcon />
            </span>
          </div>

          <div className="flex flex-col">
            <h6>{vidData.title}.mp4</h6>
            <p className="text-sm">
              {Math.floor(vidData?.videoFile[0]?.size / (1024 * 1024))} Mb
            </p>
            <div className="mt-2 flex justify-center items-center">
              <TrophySpin color="#169976" size="small" text="" textColor="" />
              <div className="ml-1.5">Uploading</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <>
      <div className="absolute inset-0 z-10 bg-black/50 px-4 pb-[86px] pt-4 sm:px-14 sm:py-8 flex justify-end items-center">
        <div className="h-[90%] overflow-auto border rounded-2xl bg-[#121212] lg:w-3/4 md:w-2/3 border-[#1DCD9F]">
          <form onSubmit={handleSubmit(uploadVideo)}>
            <div className="flex items-center justify-between border-b p-4">
              <h2 className="text-xl font-semibold">Upload Videos</h2>
              <button
                type="submit"
                className="group/btn mr-1 flex w-auto items-center gap-x-2 bg-black px-3 py-2 text-center font-bold text-black shadow-[5px_5px_0px_0px_#169976] transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e]"
              >
                Upload
              </button>
            </div>
            <div className="mx-auto flex w-full max-w-3xl flex-col gap-y-4 p-4">
              <div className="w-full border-2 border-[#169976] border-dashed px-4 py-12 text-center">
                <span className="mb-4 inline-block w-24 rounded-full bg-[#169976] p-4 text-black">
                  logo
                </span>
                <h6 className="mb-2 font-semibold">
                  Drag and drop video files to upload
                </h6>
                <p className="text-gray-400">
                  Your videos will be private untill you publish them.
                </p>
                <label
                  htmlFor="upload-video"
                  className="group/btn mt-4 inline-flex w-auto cursor-pointer items-center gap-x-2 bg-[#169976] px-3 py-2 text-center font-bold text-black shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e]"
                >
                  <input
                    type="file"
                    id="upload-video"
                    className="sr-only"
                    {...register("videoFile", { required: true })}
                  />
                  Select Files
                </label>
              </div>
              {errors.videoFile && errors.videoFile.type === "required" && (
                <span className="text-red-500" role="alert">
                  Upload the video file
                </span>
              )}
              <div className="w-full">
                <label htmlFor="thumbnail" className="mb-1 inline-block">
                  Thumbnail<sup>*</sup>
                </label>
                <input
                  id="thumbnail"
                  type="file"
                  {...register("thumbnail", { required: true })}
                  className="w-full rounded-2xl bg-[#222222] p-1 file:mr-4 file:border-none file:bg-[#169976] file:px-3 file:py-1.5"
                />
                {errors.thumbnail && errors.thumbnail.type === "required" && (
                  <span className="text-red-500" role="alert">
                    Upload the thumbnail
                  </span>
                )}
              </div>
              <div className="w-full">
                <label htmlFor="title" className="mb-1 inline-block">
                  Title<sup>*</sup>
                </label>
                <input
                  id="title"
                  type="text"
                  {...register("title", { required: true })}
                  className="w-full rounded-2xl bg-[#222222] px-2 py-1 outline-none"
                />
                {errors.title && errors.title.type === "required" && (
                  <span className="text-red-500" role="alert">
                    Add a title
                  </span>
                )}
              </div>
              <div className="w-full">
                <label htmlFor="desc" className="mb-1 inline-block">
                  Description<sup>*</sup>
                </label>
                <textarea
                  id="description"
                  {...register("description", { required: true })}
                  className="h-40 w-full resize-none rounded-2xl bg-[#222222] px-2 py-1 outline-none"
                />
                {errors.description &&
                  errors.description.type === "required" && (
                    <span className="text-red-500" role="alert">
                      Add a description
                    </span>
                  )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default UploadVideo;
