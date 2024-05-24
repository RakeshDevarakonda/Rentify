import React, {  useEffect, useState } from "react";

import Navbarcss from "../Css/Navbar.module.css";

import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  CheckUserLoggedInSelector,
  CheckUserLoggedInactions,
} from "./../Redux/AuthStore";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";


const Navbar = () => {

  const dispatch = useDispatch();


  const userid = localStorage.getItem("userid");
  const [sidebarvisible, setsidebarvisible] = useState(false);
  const [loading, setloading] = useState(true);

  const islogin = useSelector(CheckUserLoggedInSelector);
  

  const checkLoginStatus = () => async (dispatch) => {
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

      dispatch(CheckUserLoggedInactions.loginSuccess());
    } catch (error) {
      dispatch(CheckUserLoggedInactions.loginFailure());
    }
  };

  useEffect(() => {
    dispatch(checkLoginStatus());
    setloading(false);
  }, [islogin, dispatch]);

  const navigate = useNavigate();
  const displaysidebar = () => {
    setsidebarvisible(!sidebarvisible);
  };

  const logout = () => {
    localStorage.removeItem("jwttoken");
    localStorage.removeItem("email");
    localStorage.removeItem("userid");
    navigate("/");
    dispatch(CheckUserLoggedInactions.loginFailure());
    toast.success("logout successfull");
  };

  if (loading) {
    return (
      <div className="loader">
        <ClipLoader color="#36d7b7" />
      </div>
    );
  }

  if (!loading) {
    return (
      <>
        <div className={Navbarcss.NavbarContainer}>
          <div className={Navbarcss.Navbar}>
            <div className={Navbarcss.navbarleft}>
              <li
                to=""
                className={Navbarcss.hamburgerlistitem}
                onClick={displaysidebar}
              >
                <i className={`fa-solid fa-bars ${Navbarcss.hamburger}`}></i>
              </li>

              <Link to="/" className={Navbarcss.navbarlogo}>
                <h1>Rentify</h1>
              </Link>
            </div>
            <div
              className={`${
                sidebarvisible ? Navbarcss.displaysidebarcss : ""
              } ${Navbarcss.navbarright}`}
            >
              <li
                onClick={displaysidebar}
                className={`${Navbarcss.navitem} ${Navbarcss.xmark}`}
              >
                <i className="fa-solid fa-xmark"></i>
              </li>

              {!islogin.loggedIn && (
                <>
                  <NavLink
                    to="/addproperty"
                    className={({ isActive }) =>
                      isActive ? `${Navbarcss.activenav}` : ""
                    }
                  >
                    sellproperty
                  </NavLink>
                  <NavLink
                    to="/signup"
                    className={({ isActive }) =>
                      isActive ? `${Navbarcss.activenav}` : ""
                    }
                  >
                    Sign Up
                  </NavLink>

                  <NavLink
                    to="/signin"
                    className={({ isActive }) =>
                      isActive ? `${Navbarcss.activenav}` : ""
                    }
                  >
                    Sign In
                  </NavLink>
                </>
              )}

              {islogin.loggedIn && (
                <>
                  <NavLink
                    to="/addproperty"
                    className={({ isActive }) =>
                      isActive ? `${Navbarcss.activenav}` : ""
                    }
                  >
                    sellproperty
                  </NavLink>

                  <NavLink
                    to={`/myads/${userid}`}
                    className={({ isActive }) =>
                      isActive ? `${Navbarcss.activenav}` : ""
                    }
                  >
                    Myads
                  </NavLink>
                  <p
                    onClick={logout}
                    className={`${Navbarcss.navitem} ${Navbarcss.logoutbtn}`}
                  >
                    Logout
                  </p>
                </>
              )}
            </div>
          </div>

          <Outlet />
        </div>
      </>
    );
  }
};

export default Navbar;
