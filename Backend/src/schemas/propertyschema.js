import mongoose, { Schema } from "mongoose";
import { usercollections } from './userschema.js';




const propertySchema = new Schema({
  propertyname: { type: String, required: true },
  place: { type: String, required: true },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  squarefeet: { type: Number, required: true },
  type: { type: String, required: true },
  furnished: { type: String, required: true },
  bachelors: { type: String, required: true },
  rent: { type: Number, required: true },
  description: { type: String },
  likecount: { type: Number,  default: 0 },
  likedby: [{ type: mongoose.Schema.Types.ObjectId, ref: "usercollections" }],
  photos: {
    type: [String],
    required: true,
  },
  userid: { type: mongoose.Schema.Types.ObjectId, ref: "usercollections" },
});

export const propertycollections = mongoose.model(
  "propertycollections",
  propertySchema
);
