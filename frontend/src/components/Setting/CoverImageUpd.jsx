import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import { useForm } from "react-hook-form";
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

function CoverImageUpd() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const updateCoverImage = async (data) => {
    try {
      // console.log({data})
      await userService.updateCoverImage(data)
      reset();
      navigate("/MyContent")
    } catch (error) {
      console.log("updating the coverImage error => ", error);
    }
  };
  return (
    <>
      <div className="rounded-lg bg-[#141414]">
        <form onSubmit={handleSubmit(updateCoverImage)}>
          <div className="flex flex-wrap gap-y-4 p-4  justify-between items-center">
            <label htmlFor="avatar" className="mb-1 inline-block">
              Add cover image
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
                id="avatar"
                type="file"
                {...register("coverImage", {
                  required: true,
                })}
                multiple
              />
            </Button>
          </div>
            {errors.coverImage && errors.coverImage.type === "required" && (
              <span className="text-red-400 mt-0.5" role="alert">
                coverImage is required
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
              Update CoverImage
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default CoverImageUpd
