import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import { useForm } from "react-hook-form";
import CoverImageUpd from "./CoverImageUpd";
import userService from "../../srvices/user.service";
import { useNavigate } from "react-router";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

function ChannelSetting() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const updateAvatar = async (data) => {
    try {
      await userService.updateAvatar(data);
      navigate("/MyContent")
      reset();
    } catch (error) {
      console.log("updating the avatar error => ", error);
    }
  };

  return (
    <>
      <div className="flex flex-wrap justify-center gap-y-4 py-4">
        <div className="w-full sm:w-1/2 lg:w-1/3 p-1.5">
          <h5 className="font-semibold">Channel Info</h5>
          <p className="text-gray-300">Update your Channel details here.</p>
        </div>
          <div className="w-full sm:w-1/2 lg:w-2/3 border border-[#1DCD9F] p-1.5 rounded-2xl">
            <div className="mb-1.5 rounded-lg   bg-[#141414]">
              <form onSubmit={handleSubmit(updateAvatar)}>
                <div className="flex flex-wrap gap-y-4 p-4  justify-between items-center">
                  <label htmlFor="coverImage" className="mb-1 inline-block">
                    Add Avatar
                  </label>
                  <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<CloudUploadIcon />}
                    sx={{
                      backgroundColor: "black",
                      margin: "10px",
                      padding: "15px",

                      "&:hover": { border: "1px solid #1DCD9F" },
                    }}
                  >
                    Upload Avatar
                    <VisuallyHiddenInput
                      id="coverImage"
                      type="file"
                      {...register("avatar", {
                        required: true,
                      })}
                      multiple
                    />
                  </Button>
                </div>
                  {errors.avatar && errors.avatar.type === "required" && (
                    <span className="text-red-400 mt-0.5" role="alert">
                      Avatar is required
                    </span>
                  )}
                <hr className="border border-[#1DCD9F]" />
                <div className="flex items-center justify-end gap-4 p-4">
                  <button
                    className="inline-block rounded-lg border px-3 py-1.5 bg-black"
                    onClick={() => reset()}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-block bg-black px-3 py-1.5 text-black"
                  >
                    Update Avatar
                  </button>
                </div>
              </form>
            </div>

            <CoverImageUpd/>
          </div>
      </div>
    </>
  );
}

export default ChannelSetting;
