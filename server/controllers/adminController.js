import { PublicNotes as PpublicNote, User } from "../config/dbConnecton.js";

import asyncHandler from "express-async-handler";

import { v4 as uuid } from "uuid";

// Create notes
export const createNotes = asyncHandler(async (req, res) => {
  const { university, subject, name, url, fileSize } = req.body;

  if (!university || !subject || !name || !url || !fileSize) {
    res.json({ message: "Please provide all inputs" });
  }

  console.log(fileSize);
  await PpublicNote.create([
    uuid(),
    university,
    name,
    subject,
    url,
    fileSize,
    req.id,
  ])
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });

  res.status(200).json({ success: true, message: "Note Uploaded" });
});

export const addAdmin = asyncHandler(async (req, res) => {
  await User.record("c3165664-a03b-4e8e-92c5-70d03d8b76aa")
    .call("setRoles", ["Admin"])
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });

  res.status(200).json({ success: true, message: "Admin Added" });
});
