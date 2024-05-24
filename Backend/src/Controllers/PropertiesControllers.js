import express from "express";
import { jwtAuth } from "../../jwt.js";

import { propertycollections } from "../schemas/propertyschema.js";
import { ObjectId } from "mongodb";
import { usercollections } from "../schemas/userschema.js";
import fs from "fs";

export const UpdateDataController = async (req, res, next) => {
  const { userid, postid } = req.params;

  try {
    const { tempimages, likedby, likecount, ...otherdata } = req.body;

    console.log(otherdata);

    const photos = req.files.map((file) => file.filename);

    const tempimages2 = JSON.parse(tempimages);

    const PropertyDetails = await propertycollections.findOne({
      _id: new ObjectId(postid),
      userid: new ObjectId(userid),
    });

    const PhotosFromMongo = PropertyDetails.photos;

    let deleteExtraPhotos = PhotosFromMongo.filter(
      (item) => !tempimages2.includes(item)
    );
    console.log(deleteExtraPhotos);

    deleteExtraPhotos.forEach((item) => {
      console.log(item);
      const dis = `./assets/rentimages/${item}`;

      fs.unlink(dis, (err) => {
        if (err) console.log(err);
        else console.log("File is deleted");
      });
    });

    const updateProperty = await propertycollections.findOneAndUpdate(
      { _id: new ObjectId(postid), userid: new ObjectId(userid) },
      {
        $addToSet: { photos: { $each: photos } },
      },
      { new: true, upsert: true }
    );

    const updateProperty2 = await propertycollections.findOneAndUpdate(
      { _id: new ObjectId(postid), userid: new ObjectId(userid) },
      {
        $pull: { photos: { $nin: tempimages2 } },
      },
      { new: true, upsert: true }
    );

    const updateProperty3 = await propertycollections.findOneAndUpdate(
      { _id: new ObjectId(postid), userid: new ObjectId(userid) },
      {
        $addToSet: { photos: { $each: photos } },
      },
      { new: true, upsert: true }
    );

    const updateProperty4 = await propertycollections.findOneAndUpdate(
      { _id: new ObjectId(postid), userid: new ObjectId(userid) },
      otherdata,
      { new: true }
    );

    res.status(200).send("property updated successfully");
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const AddPropertyController = async (req, res, next) => {
  try {
    const photos = req.files.map((file) => file.filename);

    if (!photos || photos.length === 0) {
      const err = new Error();

      err.statusCode = 409;
      err.message = "please add atleast one image";
      err.customerror = true;
      throw err;
    }

    const newProperty = {
      propertyname: req.body.propertyname,
      place: req.body.place,
      bedrooms: req.body.bedrooms,
      bathrooms: req.body.bathrooms,
      squarefeet: req.body.squarefeet,
      type: req.body.type,
      furnished: req.body.furnished,
      bachelors: req.body.bachelors,
      rent: req.body.rent,
      description: req.body.description,
      photos: photos,
      userid: req.universalid,
    };

    const addproperty = new propertycollections(newProperty);
    await addproperty.save();

    res.status(200).send("Property Added successfully");
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const GetAllProperties = async (req, res, next) => {
  try {
    const getallproperties = await propertycollections.find({});

    res.send(getallproperties);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const GetSingleProperty = async (req, res, next) => {
  const { id } = req.params;

  try {
    const getoneproduct = await propertycollections.findOne({
      _id: new ObjectId(id),
    });
    const getoneproduct2 = await propertycollections
      .findOne({ _id: new ObjectId(id) })
      .populate("userid");

    console.log(getoneproduct2)

    
    const sellerdetails = {
      name: getoneproduct2.userid.firstName + getoneproduct2.userid.lastName,
      email: getoneproduct2.userid.email,
      mobilenumber: getoneproduct2.userid.mobilenumber,
    };

    res.json({ productdetails: getoneproduct, sellerdetails });
  } catch (error) {
    console.log(error);

    next(error);
  }
};

export const GetUserProperties = async (req, res, next) => {
  const { userid } = req.params;
  try {
    const userproducts = await propertycollections.find({
      userid: new ObjectId(userid),
    });
    res.send(userproducts);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const GetEditPostDetails = async (req, res, next) => {
  const { userid, postid } = req.params;
  try {
    const editproductdata = await propertycollections.findOne({
      userid: new ObjectId(userid),
      _id: new ObjectId(postid),
    });
    const { photos, ...Formdata } = editproductdata.toObject();
    res.send({ Formdata, photosdata: photos });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const DeleteProperty = async (req, res, next) => {
  const { userid, postid } = req.params;
  console.log(userid, postid);
  try {
    const getpropertyphotos = await propertycollections.findOne({
      _id: new ObjectId(postid),
      userid: new ObjectId(userid),
    });

    const photosarray = getpropertyphotos.photos;

    photosarray.forEach((e) => {
      const dis = `./assets/rentimages/${e}`;

      fs.unlink(dis, (err) => {
        if (err) console.log(err);
        else console.log("File is deleted");
      });
    });

    const deleteproperty = await propertycollections.deleteOne({
      _id: new ObjectId(postid),
      userid: new ObjectId(userid),
    });
    console.log(deleteproperty);
    res.send("property deleted successfully");
  } catch (error) {
    console.log(error);
    next(error);
  }
};
