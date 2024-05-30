import propertydetail from "../Css/PropertyDetailpage.module.css";

import React, { useEffect, useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Pagination, Navigation } from "swiper/modules";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { Button } from "react-bootstrap";

import { sendPostRequest } from "./Privateroute";
import ModalComponent from "./Modal";

export default function PropertyDetailpage({ interested }) {
  
  const navigate = useNavigate();

  const [modalShow, setModalShow] = React.useState(false);

  const [userdetails, setuserdetails] = useState(null);

  const { postid } = useParams();

  const [property, setproperty] = useState(null);
  const [loading, setloading] = useState(true);

  const checkmodal = async () => {
    setloading(true);

    const result = await sendPostRequest();

    if (result) {
      setModalShow(true);

      
      const headers = {
        'Content-Type': 'application/json',
         //'Authorization': 'Bearer your_access_token'
      };
      const postData={
        userid:localStorage.getItem('userid'),
        postid:postid
      }
      
      
      async function nodemailerrequest() {
        try {
          const response = await axios.post(`${process.env.REACT_APP_BACKENDSERVERNAME}/api/nodemailer`, postData, { headers });
          console.log('Response:', response.data);
        } catch (error) {
          console.error('Error posting data:', error.response ? error.response.data : error.message);
        }
      }
      
      nodemailerrequest();
      setloading(false);


    } else {
      navigate("/signin");
    }
  };

  useEffect(() => {
    if (postid) {
      async function fetchData() {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_BACKENDSERVERNAME}/api/singleproperty/${postid}`
          );
          setproperty(response.data.productdetails);
          setuserdetails(response.data.sellerdetails);
          console.log(response.data.sellerdetails);
        } catch (error) {
          console.log(error);
          navigate("/ErrorElement");
        } finally {
          setloading(false);
        }
      }

      fetchData();
    }
  }, [postid,navigate]);

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
        <div className={propertydetail.propertydetaislcontainer}>
          <div className={propertydetail.absolutuepost}>
            {/* <button>
            <i className="fa-solid fa-pen-to-square"></i>Edit Post
          </button> */}
          </div>
          <div className={propertydetail.container}>
            <div className={propertydetail.images}>
              <div className={propertydetail.mainimage}>
                <div className={propertydetail.swiperwidth}>
                  {property && property.photos.length > 0 && (
                    <Swiper
                      style={{ "--swiper-navigation-size": "25px" }}
                      slidesPerView={1}
                      spaceBetween={30}
                      loop={true}
                      pagination={{ clickable: true }}
                      navigation={true}
                      modules={[Pagination, Navigation]}
                      className="mySwiper"
                    >
                      {property.photos.map((e, index) => (
                        <SwiperSlide
                          key={index}
                          className={propertydetail.swidercenter}
                        >
                          <img
                            src={`${process.env.REACT_APP_BACKENDSERVERNAME}/rentimages/${e}`}
                            alt=""
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  )}
                </div>
              </div>
            </div>

            <div className={propertydetail.interesteddiv}>
              {interested && (
                <Button variant="primary" onClick={checkmodal}>
                  Iam Interested
                </Button>
              )}

              <ModalComponent
                sellerdetails={userdetails}
                show={modalShow}
                onHide={() => setModalShow(false)}
              />
            </div>

            <div className={`${propertydetail.details} mb-5  `}>
              <table>
                
                <thead>
                  <tr>
                    <th colSpan="2">
                      <h2>Property Details</h2>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {property.propertyname && (
                    <tr>
                      <td>Property Name</td>
                      <td>{property.propertyname}</td>
                    </tr>
                  )}
                  {property.place && (
                    <tr>
                      <td>Location</td>
                      <td>{property.place}</td>
                    </tr>
                  )}
                  {property.rent && (
                    <tr>
                      <td>Price</td>
                      <td>{property.rent}</td>
                    </tr>
                  )}
                  {property.bedrooms && (
                    <tr>
                      <td>Bedrooms</td>
                      <td>{property.bedrooms}</td>
                    </tr>
                  )}
                  {property.type && (
                    <tr>
                      <td>Type</td>
                      <td>{property.type}</td>
                    </tr>
                  )}
                  {property.bathrooms && (
                    <tr>
                      <td>Bathrooms</td>
                      <td>{property.bathrooms}</td>
                    </tr>
                  )}
                  {property.squarefeet && (
                    <tr>
                      <td>Area</td>
                      <td>{property.squarefeet} sqft</td>
                    </tr>
                  )}
                  {property.furnished && (
                    <tr>
                      <td>Furnishing</td>
                      <td>{property.furnished}</td>
                    </tr>
                  )}
                  {property.bachelors && (
                    <tr>
                      <td>Bachelors</td>
                      <td>{property.bachelors}</td>
                    </tr>
                  )}
                  {property.description && (
                    <tr>
                      <td colSpan="2" className="text-start">
                        <h5 className="mt-3 mb-3">Description</h5>
                        <p className="mb-5">{property.description}</p>
                      </td>
                    </tr>
                  )}
                </tbody>


              </table>
            </div>
          </div>
        </div>
      </>
    );
  }
}
