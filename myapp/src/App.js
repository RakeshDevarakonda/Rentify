import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Signin from "./Components/Signin";
import Signup from "./Components/Signup";
import Navbar from "./Components/Navbar";
import RentList from "./Components/RentList";
import Addproperty from "./Components/Addproperty";

import "./App.css";

import PrivateRoute from "./Components/Privateroute.js";
import ErrorElement from "./Components/ErrorElement.js";
import PropertyDetailpage from "./Components/PropertyDetailpage.js";

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Navbar />,
      errorElement: <ErrorElement />,

      children: [
        { index: true, element: <RentList editmode={false} /> },
        { path: "Signin", element: <Signin /> },
        { path: "Signup", element: <Signup /> },
        {
          path: "singleproperty/:postid",
          element: <PropertyDetailpage interested={true} />,
        },

        {
          path: "myads/:userid",
          children: [
            {
              index: true,
              element: (
                <PrivateRoute>
                  <RentList editmode={true} />
                </PrivateRoute>
              ),
            },
            {
              path: "editpost/:editpostid",
              element: (
                <PrivateRoute>
                  <Addproperty editpost={true} />
                </PrivateRoute>
              ),
            },
            {
              path: "singleproperty/:postid",
              element: (
                <PrivateRoute>
                  <PropertyDetailpage interested={false} />
                </PrivateRoute>
              ),
            },
          ],
        },

        {
          path: "addproperty",
          element: (
            <PrivateRoute>
              <Addproperty editpost={false} />
            </PrivateRoute>
          ),
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}
