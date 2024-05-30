import express from "express";
import { nodemailercontroller } from './../Controllers/NodemailerController.js';


const NodemailerRoute = express.Router();

NodemailerRoute.post("/nodemailer",nodemailercontroller)



export default NodemailerRoute