import User from "../models/User.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

import { ethers } from "ethers";

const walletLogin = asyncHandler(async (req, res) => {
  const cookies = req.cookies;

  const { address, signature, message } = req.body;

  if (!address || !signature || !message) {
    res.status(400).json({ message: "All field are required" });
  }

  const foundUser = await User.findOne({ address }).exec();

  if (!foundUser || !foundUser.active) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const recoveredAdrr = ethers.verifyMessage(message, signature);

  if (recoveredAdrr.toLowerCase() !== foundUser.address.toLowerCase()) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const accessToken = jwt.sign(
    {
      id: foundUser.id,
      role: foundUser.roles,
    },
    process.env.ACCESS_TOKEN_SECRET || "dfdfdfdfd",
    { expiresIn: "24h" }
  );

  if (cookies?.jwt) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
  }

  res.json({
    role: foundUser.roles,
    accessToken,
  });
});

// !Refresh

//Logout

const logout = asyncHandler(async (req, res) => {
  const cookies = req.cookies;
  const refreshToken = cookies?.jwt;
  console.log(`Cookie logout ${refreshToken}`);

  if (!refreshToken) return res.sendStatus(204);

  const foundUser = await User.findOne({ refresh: refreshToken });

  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
  }

  foundUser.refresh = foundUser.refresh.filter((r) => r !== refreshToken);
  await foundUser.save();

  res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });

  res.status(204).json({ message: "Logout" });
});

export default {
  walletLogin,

  logout,
};
