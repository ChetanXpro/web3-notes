import { User } from "../config/dbConnecton.js";

export const verifyAdmin = async (req, res, next) => {
  const id = req.id;
  if (!id) return res.status(400).json({ message: "Something went wrong" });

  console.log(id);

  const foundUser = await User.record(id).get();

  console.log(foundUser.data);

  if (foundUser.data.roles !== "Admin") {
    return res.status(400).json({ message: "Unauthorized" });
  } else {
    next();
  }
};
