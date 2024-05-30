import { ObjectId } from "mongodb";
import { propertycollections } from "../schemas/propertyschema.js";

export const likepost = async (req, res, next) => {

    const {userid,propertyid}=req.body
    console.log(req.body)
  try {
    const update = await propertycollections.updateOne(
      { _id: new ObjectId(propertyid) },
      {
        $addToSet: { likedby: new ObjectId(userid) },
        $inc: { likecount: 1 },
      }
    );

    console.log("liked")

    res.send("like added succesfully");
  } catch (error) {
    console.error("Error updating likes:", error);
  }
};



export const unlikepost = async (req, res, next) => {
    const {userid,propertyid}=req.body

  try {
    const update = await propertycollections.updateOne(
        { _id: new ObjectId(propertyid) },
        {
          $pull: { likedby: new ObjectId(userid) },
          $inc: { likecount: -1 },
        }
    );

    console.log("unliked")

    res.send("like deleted succesfully");

  } catch (error) {
    console.error("Error updating likes:", error);
  }
};
