import React, { useEffect, useState } from "react";
import signup from "../Css/signup.module.css";
import axios from "axios";
import { sendPostRequest } from "./Privateroute";
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
export default function Signup() {
  const navigate=useNavigate()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobilenumber: "",
    password: "",
    confirmpassword: "",
  });


  useEffect(() => {
    const checkalreadyloggedin = async () => {
      const checking = await sendPostRequest();
      if (checking){
        navigate("/")
      }
    };
    checkalreadyloggedin()
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmpassword) {
      toast.error("password not match");
      return;
    }

    if (formData.mobilenumber.length > 10 || formData.mobilenumber.length < 10) {
      toast.error("please enter 10 digit number");
      return;
    }

    const sendformData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      mobilenumber: formData.mobilenumber,
      password: formData.password,
    };

    const headers = {
      "Content-Type": "application/json",
    };
    async function sendPostRequest() {
      try {
        const response2 = await axios.post(
          `${process.env.REACT_APP_BACKENDSERVERNAME}/api/signup`,
          sendformData,
          { headers }
        );
        console.log("Response:", response2.data);
        navigate("/signin")
        toast.success(response2.data);
      } catch (error) {
        console.log(error.response.data);
        toast.error(error.response.data);
      }
    }

    sendPostRequest();
  };
  return (
    <>
      <div className={signup.signupcomponent}>
        <div className={signup.container}>
          <form className={signup.signupform} onSubmit={handleSubmit}>
            <h2>Sign Up</h2>
            <div className={signup.inputgroup}>
              <label htmlFor="first-name">First Name</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                id="first-name"
                name="firstName"
                required
              />
            </div>
            <div className={signup.inputgroup}>
              <label htmlFor="last-name">Last Name</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                id="last-name"
                name="lastName"
                required
              />
            </div>
            <div className={signup.inputgroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={handleChange}
                id="email"
                name="email"
                required
              />
            </div>
            <div className={signup.inputgroup}>
              <label htmlFor="mobilenumber">Mobile Number</label>
              <input
                type="number"
                value={formData.phonenumber}
                onChange={handleChange}
                id="mobilenumber"
                name="mobilenumber"
                required
              />
            </div>
            <div className={signup.inputgroup}>
              <label htmlFor="password">Password</label>
              <input
                autoComplete="on"
                type="password"
                value={formData.password}
                onChange={handleChange}
                id="password"
                name="password"
                required
              />
            </div>

            <div className={signup.inputgroup}>
              <label htmlFor="confirmpassword1">Confirm Password</label>
              <input
                autoComplete="on"
                type="password"
                value={formData.confirmpassword}
                onChange={handleChange}
                id="confirmpassword1"
                name="confirmpassword"
                required
              />
            </div>
            <button className={signup.submitbutton} type="submit">
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

