import React, { useEffect, useState } from "react";
import signin from "../Css/Signin.module.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

import { CheckUserLoggedInactions } from "../Redux/AuthStore.js";
import { useNavigate } from "react-router-dom";
import { sendPostRequest } from "./Privateroute.js";
import { ClipLoader } from "react-spinners";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setloading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const checkalreadyloggedin = async () => {
      const checking = await sendPostRequest();
      if (checking) {
        navigate("/");
      }
    };
    checkalreadyloggedin();
  }, [navigate]);

  const handlesubmit = (e) => {
    setloading(true)

    e.preventDefault();

    const formData = {
      email: email,
      password: password,
    };

    const headers = {
      "Content-Type": "application/json",
    };

    async function sendsigninrequest() {
      try {
        const response2 = await axios.post(
          `${process.env.REACT_APP_BACKENDSERVERNAME}/api/signin`,
          formData,
          { headers }
        );

        if (response2.data) {
          toast.success(response2.data);
          navigate("/")
        }

        toast.success(response2.data.response);

        localStorage.setItem("jwttoken", response2.data.token);
        localStorage.setItem("userid", response2.data.id);
        localStorage.setItem("email", response2.data.email);
        dispatch(CheckUserLoggedInactions.loginSuccess());
      } catch (error) {

        console.log(error.response.data);
        toast.error(error.response.data);
      }
      finally{
        setloading(true)
      }
    }

    sendsigninrequest();
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
      <div className={signin.signincomponent}>
        <div className={signin.container}>
          <form className={signin.loginform} onSubmit={handlesubmit}>
            <h2>Login</h2>
            <div className={signin.inputgroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                name="email"
                required
              />
            </div>
            <div className={signin.inputgroup}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                name="password"
                required
              />
            </div>
            <button className={signin.signinbutton} type="submit">
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
}
