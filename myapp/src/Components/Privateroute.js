import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { ClipLoader } from "react-spinners";

export const sendPostRequest = async () => {
  const token = localStorage.getItem("jwttoken");
  const headers = {
    "Content-Type": "application/json",
    Authorization: token,
  };
  
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_BACKENDSERVERNAME}/routecheck`,
      {},
      { headers }
    );
    console.log(response)
    return true;
  } catch (error) {

    console.error(
      "Error posting data:",
      error.response ? error.response.data : error.message
    );
    return false;
  }
};



const PrivateRoute = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticated = await sendPostRequest();
        setIsLoggedIn(authenticated);
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="loader">
        <ClipLoader color="#36d7b7" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default PrivateRoute;
