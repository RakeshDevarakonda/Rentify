import React, { useEffect,  useState } from "react";
import axios from "axios";
import rental from "../Css/SellProperty.module.css";
import {  useNavigate, useParams } from "react-router-dom";

import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

export default function Addproperty({ editpost }) {
  const { editpostid, userid } = useParams();

  const navigator = useNavigate();
  const [loading, setloading] = useState(false);

  const userid2 = localStorage.getItem("userid");
  const [formdata, setformdata] = useState({
    propertyname: "",
    place: "",
    bedrooms: "",
    bathrooms: "",
    squarefeet: "",
    type: "",
    furnished: "",
    bachelors: "",
    rent: "",
    description: "",
  });

  const [photos, setPhotos] = useState([]);
  const [previewimage, setpreviewimage] = useState([]);
  const [temporaryimages, settemporaryimages] = useState([]);

  useEffect(() => {
    console.log(temporaryimages);
  }, [temporaryimages]);

  

  useEffect(() => {
    async function fetchData() {
      try {
        if (editpost) {
          const response = await axios.get(
            `${process.env.REACT_APP_BACKENDSERVERNAME}/api/myads/${userid}/editpost/${editpostid}`
          );

          setformdata(response.data.Formdata);
          settemporaryimages([...response.data.photosdata]);
          console.log(response.data.photosdata);

        }
      } catch (error) {
        console.log(error.response);
      }
      
    }

    if (editpost) {
      fetchData();
    }
  }, [editpost,editpostid,userid]);

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);

    if (files && files.length > 0) {
      const newPhoteos = [...photos, ...files];
      setPhotos(newPhoteos);
      const newImageURLs = files.map((file) => URL.createObjectURL(file));
      setpreviewimage((prevImages) => [...prevImages, ...newImageURLs]);
      console.log(photos);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setformdata({ ...formdata, [name]: value });
  };

  const handleRemoveImage = (index) => {
    const updatedPhotos = [...photos];
    updatedPhotos.splice(index, 1);
    setPhotos(updatedPhotos);

    const updatedPreviews = [...previewimage];
    updatedPreviews.splice(index, 1);
    setpreviewimage(updatedPreviews);
  };

  const handletempimage = (index) => {
    const updatedtempimgs = [...temporaryimages];
    updatedtempimgs.splice(index, 1);
    settemporaryimages(updatedtempimgs);
  };

  const handlekey = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const handleSubmit = (e) => {
    setloading(true)
    const datatosend = new FormData();
    e.preventDefault();

    if (!editpost) {
      for (const key in formdata) {
        datatosend.append(key, formdata[key]);
      }
      for (let index = 0; index < photos.length; index++) {
        const element = photos[index];
        datatosend.append("image", element);
      }
    } else {
      for (const key in formdata) {
        datatosend.append(key, formdata[key]);
      }
      for (let index = 0; index < photos.length; index++) {
        const element = photos[index];
        datatosend.append("image", element);
      }
      datatosend.append("tempimages", JSON.stringify(temporaryimages));
    }

    const token = localStorage.getItem("jwttoken");
    const headers = {
      "Content-Type": "'multipart/form-data",
      Authorization: token,
    };

    async function sendPostRequest() {
      let response;
      try {
        if (!editpost) {
          response = await axios.post(
            `${process.env.REACT_APP_BACKENDSERVERNAME}/api/addproperty`,
            datatosend,
            { headers }
          );
          console.log("Response:", response.data);
          toast.success(response.data);

          navigator(`/myads/${userid2}`);
        } else {
          response = await axios.put(
            `${process.env.REACT_APP_BACKENDSERVERNAME}/api/myads/${userid}/editpost/${editpostid} `,
            datatosend,
            { headers }
          );
          toast.success(response.data);
          console.log(response.data);
          navigator(`/myads/${userid2}`);
        }
      } catch (error) {
        toast.error(error.response.data);

        console.log(error.response.data);
      }
     
    }

    sendPostRequest();
    setloading(false)

  };

  if (loading) {
    return (
      <div className="loader">
        <ClipLoader color="#36d7b7" />
      </div>
    );
  }



  if (!loading){
    return (
    <>
      <div className={rental.sellpropertycomponent}>
        <div className={rental.container}>
          <h2 className={rental.formname}>Rent Your Property</h2>
          <form
            action="#"
            className={rental.sellpropertyform}
            method="post"
            encType="multipart/form-data"
            onSubmit={handleSubmit}
            onKeyDown={handlekey}
          >
            <div className={rental.formGroup}>
              <label htmlFor="propertyname">Name of the property</label>
              <input
                onChange={handleChange}
                type="text"
                id="propertyname"
                name="propertyname"
                required
                value={formdata.propertyname}
              />
            </div>

            <div className={rental.formGroup}>
              <label htmlFor="place">Place/Area:</label>
              <input
                onChange={handleChange}
                type="text"
                id="place"
                name="place"
                required
                value={formdata.place}
              />
            </div>
            <div className={rental.formGroup}>
              <label htmlFor="bedrooms">Number of Bedrooms:</label>
              <input
                onChange={handleChange}
                type="number"
                id="bedrooms"
                name="bedrooms"
                min="1"
                required
                value={formdata.bedrooms}
              />
            </div>
            <div className={rental.formGroup}>
              <label htmlFor="bathrooms">Number of Bathrooms:</label>
              <input
                onChange={handleChange}
                type="number"
                id="bathrooms"
                name="bathrooms"
                min="1"
                required
                value={formdata.bathrooms}
              />
            </div>
            <div className={rental.formGroup}>
              <label htmlFor="squarefeet">Square Feet Size:</label>
              <input
                onChange={handleChange}
                type="number"
                id="squarefeet"
                name="squarefeet"
                min="1"
                value={formdata.squarefeet}
                required
              />
            </div>
            <div className={rental.formGroup}>
              <label htmlFor="type">Type:</label>
              <select
                id="type"
                name="type"
                value={formdata.type}
                onChange={handleChange}
                required
              >
                <option value="">Select Type</option>
                <option value="building">Building</option>
                <option value="appartment">Apartment</option>
                <option value="house">House</option>
                <option value="villa">Villa</option>
              </select>
            </div>
            <div className={rental.formGroup}>
              <label htmlFor="furnished">Furnished:</label>
              <select
                value={formdata.furnished}
                id="furnished"
                name="furnished"
                onChange={handleChange}
                required
              >
                <option value="">Select Furnished Status</option>
                <option value="fully_furnished">Fully Furnished</option>
                <option value="semi_furnished">Semi-furnished</option>
                <option value="not_furnished">Not furnished</option>
              </select>
            </div>
            <div className={rental.formGroup}>
              <label htmlFor="bachelors">Bachelors Allowed:</label>
              <select
                required
                value={formdata.bachelors}
                id="bachelors"
                name="bachelors"
                onChange={handleChange}
              >
                <option value="">Select Option</option>
                <option value="allowed">Allowed</option>
                <option value="not_allowed">Not Allowed</option>
              </select>
            </div>
            <div className={rental.formGroup}>
              <label htmlFor="rent">Price:</label>
              <input
                onChange={handleChange}
                type="number"
                id="rent"
                name="rent"
                min="1"
                required
                value={formdata.rent}
              />
            </div>
            <div className={rental.formGroup}>
              <label htmlFor="description">Description:</label>
              <textarea
                value={formdata.description}
                onChange={handleChange}
                className={rental.descriptionarea}
                id="description"
                name="description"
                rows="4"
              ></textarea>
            </div>
            <div className={rental.formGroup}>
              <label htmlFor="photos">Upload Photos:</label>
              <input
                className={rental.addimages}
                type="file"
                id="photos"
                name="imageurl"
                accept="image/*"
                multiple
                onChange={handlePhotoChange}
                required={
                  editpost
                    ? temporaryimages.length === 0 && previewimage.length === 0
                    : previewimage.length === 0
                    ? true
                    : false
                }
              />
              <div className={rental.previewimage}>
                <ul>
                  {temporaryimages &&
                    temporaryimages.length > 0 &&
                    temporaryimages.map((temp, tempindex) => (
                      <li key={tempindex}>
                        <img alt="property_image" src={`${process.env.REACT_APP_BACKENDSERVERNAME}/rentimages/${temp}`} />
                        <i
                          onClick={() => handletempimage(tempindex)}
                          className={`fa-solid fa-x ${rental.tempimgremove}`}
                        ></i>
                      </li>
                    ))}
                  {previewimage &&
                    previewimage.length > 0 &&
                    previewimage.map((e, index) => (
                      <li key={index}>
                        <img alt="preview_image" src={e} />
                        <i
                          onClick={() => handleRemoveImage(index)}
                          className={`fa-solid fa-x ${rental.tempimgremove}`}
                        ></i>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
            {editpost ? (
              <input type="submit" value="Update" />
            ) : (
              <input type="submit" value="Submit" />
            )}
          </form>
        </div>
      </div>
    </>
  );
}
}
