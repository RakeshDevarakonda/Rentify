import { ObjectId } from "mongodb";
import { propertycollections } from "../schemas/propertyschema.js";
import { usercollections } from "../schemas/userschema.js";
import sendMail from "../../nodemailer.js";


export const nodemailercontroller = async (req, res, next) => {
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
};
