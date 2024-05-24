import express from "express";

import { SigninController, SignupController } from "../Controllers/Authcontrollers.js";

const AuthRouter = express.Router();

AuthRouter.post("/signup", SignupController);

AuthRouter.post("/signin", SigninController);





export default AuthRouter;
