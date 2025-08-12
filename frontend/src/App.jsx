import { useEffect } from "react";
import "./App.css";

import authService from "./srvices/auth.service";

import { useDispatch } from "react-redux";
import { userLogin, userLogout } from "./app/authSlice";
import Home from "./pages/Home";
import { useNavigate } from "react-router";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    authService.getUser().then((userData) => {
      // console.log(userData)
      if (userData) {
        dispatch(userLogin(userData.data.data));
      } else {
        dispatch(userLogout());
        navigate("/login")
      }
    });
  }, []);

  return (
    <>
      <Home />
    </>
  );
}

export default App;
