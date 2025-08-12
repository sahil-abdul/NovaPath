import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { userLogin } from "../app/authSlice";
import authService from "../srvices/auth.service";
import { useDispatch } from "react-redux";

function Login() {
  const { register, handleSubmit } = useForm("");
  const dispatch = useDispatch();

  const login = async (data) => {
    const userData = await authService.login(data);
    // console.log(userData)
    if (userData) {
      const user = await authService.getUser();
      if (user) {
        console.log(user);
        dispatch(userLogin(userData.data.data));
      }
    }
  };

  return (
    <>
      <div className="flex justify-center items-center w-full">
        <div className="mx-auto w-full max-w-lg rounded-xl p-10 border border-[#1DCD9F]">
          <h2 className="text-center text-2xl font-bold leading-tight">
            SignIn to your account
          </h2>
          <p className="mt-2 text-center text-base">
            Don&apos;t have an account?&nbsp;
            <Link
              to="/register"
              className="font-medium text-primary transition-all duration-200 hover:underline"
            >
              SignUp
            </Link>
          </p>
          <form
            onSubmit={handleSubmit(login)}
            className="mt-8 flex flex-col justify-between gap-1.5"
          >
            <div className="flex flex-col gap-1.5 p-4">
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
            <button type="submit" className="w-full text-[#169976]">
              SigIn
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
