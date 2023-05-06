import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import {
  requestAccounts,
  sign,
  ethPersonalSignRecoverPublicKey,
} from "@polybase/eth";

import { User } from "../config/dbConnecton.js";

const walletLogin = asyncHandler(async (req, res) => {
  const { address, signature, message } = req.body;

  if (!address || !signature || !message) {
    res.status(400).json({ message: "All field are required" });
  }

  const pkWithPrefix = await ethPersonalSignRecoverPublicKey(
    signature,
    message
  );
  const publicKey = "0x" + pkWithPrefix.slice(4);

  // const foundUser = await User.findOne({ address }).exec();

  const foundUser = await User.where("publicKey", "==", publicKey).get();

  if (foundUser.data.length < 0) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!foundUser.data[0]?.data?.active) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const data = foundUser.data[0].data;

  // const recoveredAdrr = ethers.verifyMessage(message, signature);

  if (publicKey.toLowerCase() !== data.publicKey.toLowerCase()) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const accessToken = jwt.sign(
    {
      id: data.id,
      role: data.roles,
    },
    process.env.ACCESS_TOKEN_SECRET || "dfdfdfdfd",
    { expiresIn: "24h" }
  );

  res.json({
    role: data.roles,
    accessToken,
  });
});

// !Refresh

//Logout

export default {
  walletLogin,
};
