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
import LikeRouter from "./src/Routes/LikeRouter.js";

import RouteCheck from "./src/Routes/Routecheck.js";
import NodemailerRoute from "./src/Routes/NodemailerRoute.js";
import { ObjectId } from "mongodb";

import { createServer } from "http";
import { Server } from "socket.io";

const app = express();

app.use(
  cors({
    origin: [process.env.FRONTEND_SERVER_NAME],
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

app.use("/api", LikeRouter);

app.use("/api", RouteCheck);

app.use("/api", NodemailerRoute);

const server = createServer(app);



const io = new Server(server, {
  cors: {
    origin:[process.env.FRONTEND_SERVER_NAME] ,
    methods: ['GET', 'POST', "PUT", "DELETE"],
  },
});

io.on("connection", (socket) => {
  // console.log('Connection successful');

  socket.on("likebuttoncliked", async (e) => {
    const { postdata, userliked } = e;
    const { userid, propertyid } = postdata;


    try {
      if (userliked === "likepost") {
        await propertycollections.updateOne(
          { _id: new ObjectId(propertyid) },
          {
            $addToSet: { likedby: new ObjectId(userid) },
            $inc: { likecount: 1 },
          }
        );
        console.log("Like added successfully");

      } else if (userliked === "unlikepost") {
        await propertycollections.updateOne(
          { _id: new ObjectId(propertyid) },
          {
            $pull: { likedby: new ObjectId(userid) },
            $inc: { likecount: -1 },
          }
        );
        console.log("Like removed successfully");
      }
    } catch (error) {
      console.error("Error updating likes:", error);
    }


  });

  socket.on("disconnect", () => {
    // console.log('User disconnected');
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
server.listen(PORT, () => {
  console.log("Example app listening on port " + PORT + "!");
  mongoosedatabse();
});
