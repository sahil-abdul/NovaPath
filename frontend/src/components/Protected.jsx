import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router";

export const Protected = ({ children, autheticated = true }) => { 
  const authStatus = useSelector((state) => state.auth.status);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  useEffect(() => {
    
   
    if (autheticated && authStatus !== autheticated) {
      console.log("redireted to login")
        //if you are not login and route are protected the you sre send to login page
      navigate("/login");
    } else if (!autheticated && authStatus !== autheticated) {
       console.log("redireted to home page")
      // if you are login and you are tring to scces login page then you trow to home page
      navigate("/");
    }

    setLoading(false);
  }, [navigate, authStatus, autheticated]);

  return loading ? <div>Loading...</div> : <div className="w-full h-full overflow-auto ">{children}</div>;
};
