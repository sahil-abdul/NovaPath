import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import authService from "../srvices/auth.service";

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

function Register() {
  const { register, handleSubmit } = useForm();

  const signUp = async (data) => {
    try {
      await authService.registerUser(data);
    } catch (error) {
      console.log("registeration error")
    }
  };

  return (
    <>
      <div className="flex justify-center items-center w-2xl">
        <div className="mx-auto w-full max-w-lg rounded-xl p-10 border border-[#1DCD9F]">
          <h2 className="text-center text-2xl font-bold leading-tight">
            Create a new Account
          </h2>
          <p className="mt-2 text-center text-base">
            Already have an account?&nbsp;
            <Link
              to="/logIn"
              className="font-medium text-primary transition-all duration-200 hover:underline"
            >
              Login
            </Link>
          </p>
          <form
            onSubmit={handleSubmit(signUp)}
            className="mt-8 flex flex-col justify-between gap-1.5"
          >
            <div className="flex flex-col gap-1.5 p-4">
              <input
                className="m-2 w-full p-2 border-b-2 border-b-[#1DCD9F] focus:text-[#1DCD9F] "
                label="fullname: "
                placeholder="Enter you fullname"
                type="text"
                {...register("fullName", {
                  required: true,
                })}
              />
              <input
                className="m-2 w-full p-2 border-b-2 border-b-[#1DCD9F] focus:text-[#1DCD9F] "
                label="Email: "
                placeholder="Enter you email"
                type="email"
                {...register("email", {
                  required: true,
                  validate: {
                    matchPatern: (value) =>
                      /^([\w\.\-_]+)?\w+@[\w-_]+(\.\w+){1,}$/.test(value) ||
                      "Email address must be valid",
                  },
                })}
              />

              <input
                className="m-2 w-full p-2 border-b-2 border-b-[#1DCD9F] focus:text-[#1DCD9F] "
                label="username: "
                placeholder="Enter you username"
                type="text"
                {...register("username", {
                  required: true,
                })}
              />

              <input
                className="m-2 w-full p-2 border-b-2 border-b-[#1DCD9F] focus:text-[#1DCD9F] "
                label="Password: "
                placeholder="Enter your Password"
                type="password"
                {...register("password", {
                  required: true,
                })}
              />
            </div>

            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
              sx={{
                backgroundColor: "#1a1a1a",
                margin: "10px",
                padding: "10px",

                "&:hover": { border: "1px solid #1DCD9F" },
              }}
            >
              Upload Avatar
              <VisuallyHiddenInput
                type="file"
                {...register("avatar", {
                  required: true,
                })}
                multiple
              />
            </Button>

            <button type="submit" className="w-full text-[#169976]">
              SigUp
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Register;
