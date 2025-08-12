import EmailIcon from "@mui/icons-material/Email";
import { useForm } from "react-hook-form";
import userService from "../../srvices/user.service";
import { useNavigate } from "react-router";

function PersonalInfo() {
  const { register, handleSubmit, reset, formState: { errors },} = useForm();
  const navigate = useNavigate();

  const updateUserDetail = async (data) => {
    try {
     const val =  await userService.updateDetail(data)
     reset();
     navigate("/MyContent")
    } catch (error) {
      console.log("updating the user detail error => ", error);
    }
  };

  return (
    <>
      <div className="flex flex-wrap justify-center gap-y-4 py-4 px-1.5">
        <div className="w-full sm:w-1/2 lg:w-1/3">
          <h5 className="font-semibold">Personal Info</h5>
          <p className="text-gray-300">
            Update  personal details.
          </p>
        </div>
        <div className="w-full sm:w-1/2 lg:w-2/3 bg-[#141414]">
          <div className="rounded-lg border border-[#1DCD9F]">
            <form onSubmit={handleSubmit(updateUserDetail)}>
              <div className="flex flex-wrap gap-y-4 p-4">
                <div className="w-full lg:w-1/2 lg:pr-2 ">
                  <label htmlFor="fullName" className="mb-1 inline-block">
                    fullname
                  </label>

                  <input
                    type="text"
                    className="w-full rounded-lg border bg-black px-2 py-1.5 pr-2"
                    id="fullName"
                    placeholder="Enter first name"
                    {...register("fullName", {
                      required: true,
                    })}
                  />
                  {errors.fullName && errors.fullName.type === "required" && (
                    <span className="text-red-400 mt-0.5" role="alert">
                      Fullname is required
                    </span>
                  )}
                </div>

                <div className="w-full">
                  <label htmlFor="lastname" className="mb-1 inline-block">
                    Email address
                  </label>
                  <div className="relative flex items-center justify-center">
                    <div className="absolute flex items-center justify-center left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-300">
                      <EmailIcon />
                    </div>
                    <input
                      type="email"
                      className="w-full rounded-lg border bg-black py-1.5 pl-10 pr-2"
                      id="lastname"
                      placeholder="Enter email address"
                      {...register("email", {
                        required: true,
                      })}
                    />
                  </div>
                    {errors.fullName && errors.fullName.type === "required" && (
                    <span className="text-red-400 mt-0.5" role="alert">
                      Eamil is required
                    </span>
                  )}
                </div>
              </div>
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
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default PersonalInfo;
