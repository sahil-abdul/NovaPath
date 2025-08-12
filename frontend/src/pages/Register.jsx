import { Register as RegisterPage } from "../components/index";
import { useDispatch } from "react-redux";
import { userLogin, userLogout } from "../app/authSlice";
import { useEffect } from "react";
import authService from "../srvices/auth.service";

function Register() {
  const dispatch = useDispatch();
  useEffect(() => {
    authService.getUser().then((userData) => {
      // console.log(userData)
      if (userData) {
        dispatch(userLogin(userData.data));
      } else {
        dispatch(userLogout());
      }
    });
  }, []);
  return (
    <>
      <div className="flex justify-center">
        <RegisterPage />
      </div>
    </>
  );
}

export default Register;
