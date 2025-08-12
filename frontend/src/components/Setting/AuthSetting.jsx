import { useForm } from "react-hook-form";
import userService from "../../srvices/user.service";

function AuthSetting() {
   const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();


  const updatePass = async (data) => {
    try {
      await userService.resetPass(data);
      reset();
      console.log("password updated")
    } catch (error) {
      console.log("updating the pass error => ", error);
    }
  }
  return (
    <>
      <div className="flex flex-wrap justify-center gap-y-4 py-4">
        <div className="w-full sm:w-1/2 lg:w-1/3 p-1.5 ">
          <h5 className="font-semibold">Password</h5>
          <p className="text-gray-300">
            Please enter your current password to change your password.
          </p>
        </div>
        <div className="w-full sm:w-1/2 lg:w-2/3 bg-[#141414]">
          <div className="rounded-lg border border-[#1DCD9F]">
            <form onSubmit={handleSubmit(updatePass)}>
            <div className="flex flex-wrap gap-y-4 p-4">
              <div className="w-full">
                <label className="mb-1 inline-block" htmlFor="old-pwd">
                  Current password
                </label>
                <input
                  type="password"
                  className="w-full rounded-lg border bg-black px-2 py-1.5"
                  id="old-pwd"
                  placeholder="Current password"
                  {...register("oldPassword",{required:true})}
                />
                {errors.oldPassword && errors.oldPassword.type === "required" && (
                    <span className="text-red-400 mt-0.5" role="alert">
                      newPassword is required
                    </span>
                  )}
              </div>
              <div className="w-full">
                <label className="mb-1 inline-block" htmlFor="new-pwd">
                  New password
                </label>
                <input
                  type="password"
                  className="w-full rounded-lg border bg-black px-2 py-1.5"
                  id="new-pwd"
                  placeholder="New password"
                   {...register("newPassword",{required:true})}
                />
                {errors.newPassword && errors.newPassword.type === "required" && (
                    <span className="text-red-400 mt-0.5" role="alert">
                      newPassword is required
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
export default AuthSetting
