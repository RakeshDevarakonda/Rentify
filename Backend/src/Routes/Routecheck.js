import express from "express";
import { jwtAuth } from "../../jwt.js";
import { routecheckcontoller } from "../Controllers/RouteCheckController.js";


const RouteCheck = express.Router();


RouteCheck.post("/routecheck",jwtAuth,routecheckcontoller)


export default RouteCheck