import asyncHandler from "express-async-handler";

import { db } from "../config/dbConnecton.js";
import { ethPersonalSignRecoverPublicKey } from "@polybase/eth";

import { v4 as uuid } from "uuid";

// @ Create new user
const createNewUser = asyncHandler(async (req, res) => {
  const { address, signature, message, name } = req.body;

  if (!signature || !address || !message || !name) {
    return res.status(400).json({ message: "All fields are require" });
  }

  const pkWithPrefix = await ethPersonalSignRecoverPublicKey(
    signature,
    message
  );
  const publicKey = "0x" + pkWithPrefix.slice(4);

  // console.log(publicKey);
  const id = uuid();

  const duplicate = await db
    .collection("User")
    .where("publicKey", "==", publicKey)
    .get();

  if (duplicate.data.length > 0) {
    return res.status(409).json({
      message: "Account already exist",
    });
  }

  const user = await db.collection("User").create([id, publicKey, name, true]);

  res.status(201).json({ message: `New user ${name} created` });
});

const getUserById = asyncHandler(async (req, res) => {
  const id = req.id;

  if (!id) {
    return res
      .sendStatus(500)
      .json({ success: false, message: "something went wrong" });
  }

  // const foundUser = await User.findById(id);

  const foundUser = await db.collection("User").where("id", "==", id).get();

  if (foundUser.data.length < 0)
    return res
      .status(400)
      .json({ success: false, message: "No user found with this id" });

  const data = foundUser.data[0].data;

  const userInfo = {
    name: data.name,
    role: data.roles,
  };

  res.status(200).json(userInfo);
});

export default {
  createNewUser,
  getUserById,
};
