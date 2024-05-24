import Jwt from "jsonwebtoken";

//in middleware
export const jwtAuth = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).send("Unauthorized");
  }

  try {
    const payload = Jwt.verify(token, process.env.JWTTOKEN);

    req.universalemail = payload.email;
    req.universalid = payload.id;

    next();
  } catch (err) {
    console.log(err);
    return res.status(401).send("Unauthorized");
  }
};
