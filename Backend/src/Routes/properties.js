import express from "express";
import { jwtAuth } from "../../jwt.js";
import { upload } from "../multer/multer.js";
import { propertycollections } from "./../schemas/propertyschema.js";
import { ObjectId } from "mongodb";
import fs from "fs";
import { AddPropertyController, DeleteProperty, GetAllProperties, GetEditPostDetails, GetSingleProperty, GetUserProperties, UpdateDataController } from "../Controllers/PropertiesControllers.js";

const propertiesRouter = express.Router();



propertiesRouter.get("/myads/:userid", GetUserProperties);

propertiesRouter.get( "/myads/:userid/editpost/:postid", GetEditPostDetails );

propertiesRouter.get("/singleproperty/:id", GetSingleProperty);

propertiesRouter.get("/getallproperies", GetAllProperties);

propertiesRouter.post( "/addproperty", jwtAuth, upload.array("image"), AddPropertyController );

propertiesRouter.put("/myads/:userid/editpost/:postid", upload.array("image"),UpdateDataController);

propertiesRouter.delete("/myads/:userid/:postid", DeleteProperty);

export default propertiesRouter;
