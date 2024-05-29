import "dotenv/config";
import express from "express";
import bodyparser from "body-parser";
import cors from "cors";

import { mongoosedatabse } from "./mongooseconfig.js";
import AuthRouter from "./src/Routes/Auth.js";
import { jwtAuth } from "./jwt.js";
import { propertycollections } from "./src/schemas/propertyschema.js";
import propertiesRouter from "./src/Routes/properties.js";
import sendMail from "./nodemailer.js";
import { usercollections } from "./src/schemas/userschema.js";
import { ObjectId } from "mongodb";
import LikeRouter from "./src/Routes/LikeRouter.js";


const app = express();

app.use(
  cors({
    origin: [
      process.env.FRONTEND_SERVER_NAME
    ],
  })
);

app.use(bodyparser.urlencoded({ extended: true }));

app.use(bodyparser.json());

app.use(express.static("assets"));

app.get("/", (req, res) => {
  res.send("firstroute");
});

app.use("/api", AuthRouter);

app.use("/api", propertiesRouter);


app.use("/api",LikeRouter)



app.post("/routecheck", jwtAuth, (req, res, next) => {
  try {
    res.send("authorized");
  } catch (error) {
    console.log(error);
  }
});







app.post("/nodemailer", async (req, res, next) => {
  const { userid, postid } = req.body;
  const buyerdetails = await usercollections.findOne({
    _id: new ObjectId(userid),
  });
  const sellerdetails = await propertycollections
    .findOne({ _id: new ObjectId(postid) })
    .populate("userid");

  const buyeremail = buyerdetails.email;
  const buyername = buyerdetails.firstName + " " + buyerdetails.lastName;
  const buyernumber = buyerdetails.mobilenumber;

  const selleremail = sellerdetails.userid.email;
  const sellername =
    sellerdetails.userid.firstName + " " + sellerdetails.userid.lastName;
  const sellernumber = sellerdetails.userid.mobilenumber;

  sendMail({ send: "seller", buyeremail, buyername, buyernumber, selleremail });
  sendMail({
    send: "buyer",
    selleremail,
    sellername,
    sellernumber,
    buyeremail,
  });
});




app.use((err, req, res, next) => {
  if (err.customerror) {
    console.log(err.message, err.statusCode);
    res
      .status(err.statusCode || 500)
      .send(err.message || "Something Went Wrong");
  } else {
    res.status(500).send("Something Went Wrong");
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT + "!");
  mongoosedatabse();
});
