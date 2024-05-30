import React, { useEffect, useRef, useState } from "react";
import rentList from "../Css/Rentlist.module.css";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import filter from "../Css/filter.module.css";
import { sendPostRequest } from "./Privateroute";

import { io } from 'socket.io-client';

export default function RentList({ editmode }) {

  var socket = io(process.env.REACT_APP_BACKENDSERVERNAME);
  const [filters, setFilters] = useState({
    type: "",
    bedrooms: "",
    bathrooms: "",
    rent: "",
    FurnishedStatus: "",
    bachelors: "",
    squarefeet: "",
  });

  const useridfromlocalstorage = localStorage.getItem("userid");

  const [showDropdown, setShowDropdown] = useState(false);

  const [dropdownIndex, setDropdownIndex] = useState(null);

  const [applyfilters, setapplyfilter] = useState([]);

  const [allproperties, setallproperties] = useState([]);

  const [activePage, setActivePage] = useState(1);

  const [showFilters, setShowFilters] = useState(false);

  const [currentpage, setcurrentpage] = useState(1);

  const [postsperpage] = useState(4);

  const [pagenumbers, setpagenumbers] = useState([]);

  const [loading, setloading] = useState(true);

  const { userid } = useParams();

  const dropdownRef = useRef(null);

  const navigate = useNavigate();

  // const [tobeshownproperties, settobeshownproperties] = useState([]);

  let lastindex = currentpage * postsperpage;
  let firstindex = lastindex - postsperpage;

  let tobeshownproperties = applyfilters.slice(firstindex, lastindex);

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const resetFilters = () => {
    setFilters({
      type: "",
      bedrooms: "",
      bathrooms: "",
      rent: "",
      FurnishedStatus: "",
      bachelors: "",
      squarefeet: "",
    });
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [id]: value,
    }));
  };

  useEffect(() => {
    let filtered = allproperties.filter((e) => {
      return (
        (filters.type === "" || filters.type === e.type) &&
        (filters.bedrooms === "" ||
          (parseInt(filters.bedrooms) === e.bedrooms &&
            e.bedrooms === parseInt(filters.bedrooms)) ||
          (filters.bedrooms === "3+" && e.bedrooms >= 3)) &&
        (filters.bathrooms === "" ||
          (parseInt(filters.bathrooms) === e.bathrooms &&
            e.bathrooms === parseInt(filters.bathrooms)) ||
          (filters.bathrooms === "3+" && e.bathrooms >= 3)) &&
        (filters.rent === "" ||
          (filters.rent === "0-5000" && e.rent >= 0 && e.rent <= 5000) ||
          (filters.rent === "5001-8000" && e.rent >= 5001 && e.rent <= 8000) ||
          (filters.rent === "8001-10000" &&
            e.rent >= 8001 &&
            e.rent <= 10000) ||
          (filters.rent === "10001-15000" &&
            e.rent >= 10001 &&
            e.rent <= 15000) ||
          (filters.rent === "15001+" && e.rent >= 15001)) &&
        (filters.FurnishedStatus === "" ||
          filters.FurnishedStatus === e.furnished) &&
        (filters.bachelors === "" || filters.bachelors === e.bachelors) &&
        (filters.squarefeet === "" ||
          (filters.squarefeet === "0-500" &&
            e.squarefeet >= 0 &&
            e.squarefeet <= 500) ||
          (filters.squarefeet === "501-1000" &&
            e.squarefeet >= 501 &&
            e.squarefeet <= 1000) ||
          (filters.squarefeet === "1001-1500" &&
            e.squarefeet >= 1001 &&
            e.squarefeet <= 1500) ||
          (filters.squarefeet === "1501-2000" &&
            e.squarefeet >= 1501 &&
            e.squarefeet <= 2000) ||
          (filters.squarefeet === "2001+" && e.squarefeet >= 2001))
      );
    });

    setapplyfilter(filtered);
    setcurrentpage(1);
    setActivePage(1);
  }, [filters]);

  useEffect(() => {
    const numbers = [];
    for (let i = 1; i <= Math.ceil(applyfilters.length / postsperpage); i++) {
      numbers.push(i);
    }
    setpagenumbers(numbers);
  }, [allproperties, applyfilters, postsperpage]);

  const paginate = (num) => {
    setcurrentpage(num);
    setActivePage(num);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        if (editmode) {
          const response = await axios.get(
            `${process.env.REACT_APP_BACKENDSERVERNAME}/api/myads/${userid}`
          );
          console.log("Edit mode Response:", response.data);
          setallproperties(response.data);
          setapplyfilter(response.data);
        } else {
          const response = await axios.get(
            `${process.env.REACT_APP_BACKENDSERVERNAME}/api/getallproperies`
          );
          setallproperties(response.data);

          setapplyfilter(response.data);
        }
      } catch (error) {
        console.log(error);
        console.error(
          "Error fetching data:",
          error.response ? error.response.data : error.message
        );
      } finally {
        setloading(false);
      }
    }

    fetchData();
  }, [editmode, userid]);

  useEffect(() => {
    const editdata = () => {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    };
    if (editmode) {
      editdata();
    }
  }, [showDropdown, dropdownIndex, editmode]);

  const handleButtonClick = (index, event) => {
    event.preventDefault();
    event.stopPropagation();

    setDropdownIndex(index);
    setShowDropdown(true);
    console.log("else");
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      event.stopPropagation();

      setShowDropdown(false);
      console.log("outside");
    }
  };

  const deletedata = (e, id, index) => {
    setShowDropdown(false);

    const headers = {
      "Content-Type": "application/json",
      //'Authorization': 'Bearer your_access_token'
    };

    async function sendPostRequest() {
      try {
        const response = await axios.delete(
          `${process.env.REACT_APP_BACKENDSERVERNAME}/api/myads/${userid}/${id}`,
          {},
          { headers }
        );
        console.log("Response:", response.data);
        setallproperties(allproperties.filter((e, i) => i !== index));
        setapplyfilter(applyfilters.filter((e, i) => i !== index));

        toast.success(response.data);
      } catch (error) {
        toast.success(error.response.data);

        console.error(
          "Error posting data:",
          error.response ? error.response.data : error.message
        );
      }
    }

    sendPostRequest();
  };

  const likebutton = async (propertyid, checkuseralreadyliked) => {

    const checklogin = await sendPostRequest();

    if (!checklogin) {
      navigate("/signin");
      return;
    }

    let userliked;

    if (!checkuseralreadyliked) {
      userliked = "likepost";

      const updatedtempProperties = allproperties.map((property) => {
        if (property._id === propertyid) {
          return {
            ...property,
            likecount: property.likecount + 1,
            likedby: [...property.likedby, useridfromlocalstorage],
          };
        }
        return property;
      });

      console.log("likedpost ");

      setallproperties(updatedtempProperties);
      setapplyfilter(updatedtempProperties);
    } else {
      userliked = "unlikepost";
      const updatedtempProperties = allproperties.map((property) => {
        if (property._id === propertyid) {
          return {
            ...property,
            likecount: property.likecount - 1,
            likedby: property.likedby.filter(
              (id) => id !== useridfromlocalstorage
            ),
          };
        }
        return property;
      });
      console.log("unlike post ");

      setallproperties(updatedtempProperties);
      setapplyfilter(updatedtempProperties);
    }



    const postdata = {
      userid: useridfromlocalstorage,
      propertyid: propertyid,
    };

    socket.emit("likebuttoncliked",{postdata,userliked})


    // async function SendLikeRequest(userliked) {
    //   console.log(userliked);
    //   try {
    //     const response = await axios.put(
    //       `${process.env.REACT_APP_BACKENDSERVERNAME}/api/${userliked}`,
    //       postdata,
    //       { headers }
    //     );
    //     console.log(response.data);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // }

    // SendLikeRequest(userliked);
  };

  if (loading) {
    return (
      <div className="loader d-flex flex-column ">
        <p>
          Backend is currently hosted on{" "}
          <strong>Render.com's (free tier)</strong>, which means it might take a
          1-2 minutes to load initially.
        </p>
        <p>Please wait.... </p>
        <ClipLoader color="#36d7b7" />
      </div>
    );
  }

  return (
    <>
      <div className={rentList.entirerentdata}>
        <div className={rentList.container}>
          <div className={rentList.filtercomponent}>
            <div>
              <button className={filter.toggleFilters} onClick={toggleFilters}>
                Filters
              </button>

              <div
                className={filter.filterList}
                style={{ display: showFilters ? "flex" : "none" }}
              >
                {showFilters && (
                  <button
                    className={filter.resetFilters}
                    onClick={resetFilters}
                  >
                    Reset
                  </button>
                )}

                <select
                  id="type"
                  className={filter.mySelect}
                  value={filters.type}
                  onChange={handleChange}
                >
                  <option value="">Type</option>
                  <option value="appartment">Appartment</option>
                  <option value="building">Building</option>
                  <option value="villa">Villa</option>
                  <option value="house">House</option>
                </select>

                <select
                  id="bedrooms"
                  className={filter.mySelect}
                  value={filters.bedrooms}
                  onChange={handleChange}
                >
                  <option value="">Bedrooms</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3+">3+</option>
                </select>

                <select
                  id="bathrooms"
                  className={filter.mySelect}
                  value={filters.bathrooms}
                  onChange={handleChange}
                >
                  <option value="">Bathrooms</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3+">3+</option>
                </select>

                <select
                  id="rent"
                  className={filter.mySelect}
                  value={filters.rent}
                  onChange={handleChange}
                >
                  <option value="">price</option>
                  <option value="0-5000">0 - 5000</option>
                  <option value="5001-8000">5001 - 8000</option>
                  <option value="8001-10000">8001 - 10000</option>
                  <option value="10001-5000">10001 - 15000</option>
                  <option value="15001+">15001+</option>
                </select>

                <select
                  id="FurnishedStatus"
                  className={filter.mySelect}
                  value={filters.furnished}
                  onChange={handleChange}
                >
                  <option value="">Furnished Status</option>

                  <option value="fully_furnished">Fully Furnished</option>
                  <option value="semi_furnished">Semi Furnished</option>
                  <option value="not_furnished">Not Furnished</option>
                </select>

                <select
                  className={filter.mySelect}
                  value={filters.bachelors}
                  id="bachelors"
                  onChange={handleChange}
                >
                  <option value="">Bachelors</option>
                  <option value="not_allowed">Not Allowed</option>
                  <option value="allowed">Allowed</option>
                </select>

                <select
                  id="squarefeet"
                  className={filter.mySelect}
                  value={filters.squarefeet}
                  onChange={handleChange}
                >
                  <option value="">SqFt</option>
                  <option value="0-500">0 - 500 sqft</option>
                  <option value="501-1000">501 - 1000 sqft</option>
                  <option value="1001-1500">1001 - 1500 sqft</option>
                  <option value="1501-2000">1501 - 2000 sqft</option>
                  <option value="2001+">2001+ sq ft</option>
                </select>
              </div>
            </div>
          </div>

          <div className={rentList.propertiesdata}>
            {tobeshownproperties.length <= 0 && (
              <div>
                <h1>No Properties to show</h1>
              </div>
            )}
            {tobeshownproperties &&
              tobeshownproperties.length > 0 &&
              tobeshownproperties.map((property, index) => (
                <div className={rentList.rentdata} key={property._id}>
                  <div className={rentList.rentimage}>
                    {property.photos[0] && (
                      <>
                        {editmode ? (
                          <Link
                            className={rentList.imageanchoretag}
                            to={`singleproperty/${property._id}`}
                          >
                            <img
                              src={`${process.env.REACT_APP_BACKENDSERVERNAME}/rentimages/${property.photos[0]}`}
                              alt=""
                            />
                          </Link>
                        ) : (
                          <Link
                            className={rentList.imageanchoretag}
                            to={`/singleproperty/${property._id}`}
                          >
                            <img
                              src={`${process.env.REACT_APP_BACKENDSERVERNAME}/rentimages/${property.photos[0]}`}
                              alt=""
                            />
                          </Link>
                        )}
                      </>
                    )}

                    {editmode && (
                      <i
                        className={`fa-solid fa-pen-to-square ${rentList.settingsbutton}`}
                        onClick={(event) => handleButtonClick(index, event)}
                      ></i>
                    )}
                    {showDropdown && dropdownIndex === index && (
                      <div ref={dropdownRef} className={rentList.tooltip}>
                        <Link to={`editpost/${property._id}`}>edit post</Link>
                        <button
                          onClick={(event) =>
                            deletedata(event, property._id, index)
                          }
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>

                  <div className={rentList.rentdetails}>
                    <div className=" mb-4 d-flex justify-content-evenly ">
                      <button
                        onClick={() =>
                          likebutton(
                            property._id,
                            property.likedby.includes(useridfromlocalstorage)
                          )
                        }
                        className={` ${
                          useridfromlocalstorage &&
                          property.likedby.includes(useridfromlocalstorage)
                            ? rentList.userliked
                            : rentList.usernotliked
                        }`}
                      >
                        <i
                          style={{ fontSize: "20px" }}
                          class="fa-regular fa-thumbs-up me-3"
                        ></i>
                        {useridfromlocalstorage &&
                        property.likedby.includes(useridfromlocalstorage)
                          ? "Liked"
                          : "Like"}
                      </button>
                      <p className="w-50 text-end me-2">
                        {property.likecount} Likes
                      </p>
                    </div>
                    <div className={rentList.rentprice}>
                      <p>
                        <i class="fa-solid fa-indian-rupee-sign me-2"></i>
                        {property.rent}
                      </p>
                    </div>
                    <div className={rentList.rentpropertydetails}>
                      <p>
                        {property.bedrooms} <span></span>Bds -{" "}
                        {property.bathrooms} Ba
                      </p>
                    </div>
                    <div className={rentList.rentlocation}>
                      <p>
                        <i class="fa-solid fa-location-dot me-2"></i>
                        {property.place}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      <ul className={rentList.pagination}>
        {pagenumbers.map((number) => (
          <li
            key={number}
            className={`${rentList.pageitem} ${
              activePage === number ? rentList.activepage : ""
            }`}
            onClick={() => paginate(number)}
          >
            <NavLink className={rentList.pagelink}>{number}</NavLink>
          </li>
        ))}
      </ul>
    </>
  );
}
