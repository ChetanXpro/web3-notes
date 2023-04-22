import User from "../models/User.js";
import Note from "../models/Note.js";
import Collection from "../models/Collection.js";
import asyncHandler from "express-async-handler";
import formatBytes from "../config/formateByte.js";

import { SpheronClient, ProtocolEnum } from "@spheron/storage";
import PublicNotes from "../models/PublicNotes.js";

// Create collection
const createCollection = asyncHandler(async (req, res) => {
  if (!req.id)
    return res
      .status(400)
      .json({ success: false, message: "Something went wrong" });
  const { collectionName } = req.body;
  if (!collectionName)
    return res.status(400).json({ success: false, message: "Invalid input" });
  const isCollectionAlreadyExist = await Collection.findOne({
    title: collectionName,
    user: req.id,
  });

  if (isCollectionAlreadyExist)
    return res
      .status(400)
      .json({ success: false, message: "Collection already exist" });

  await Collection.create({
    user: req.id,
    title: collectionName,
    totalNotesInside: 0,
  });

  res
    .status(200)
    .json({ success: true, message: `${collectionName} collection created` });
});

const getCollectionList = asyncHandler(async (req, res) => {
  const id = req.id;

  if (!id)
    return res
      .status(400)
      .json({ success: false, message: "Something went wrong" });

  const collectionFound = await Collection.find({
    user: id,
  }).lean();

  const arr = collectionFound.map((i) => {
    const obj = {
      id: i._id,
      label: i.title,
      value: i.title,
      totalNotesInside: i.totalNotesInside,
    };
    return obj;
  });

  res.status(200).json({ arr });
});

// Create notes

const createToken = asyncHandler(async (req, res) => {
  const bucketName = "example-browser-upload";
  const protocol = ProtocolEnum.IPFS;

  const client = new SpheronClient({
    token: process.env.SPHERON_TOKEN,
  });

  const { uploadToken } = await client.createSingleUploadToken({
    name: bucketName,
    protocol,
  });

  res.status(200).json({
    uploadToken,
  });
});

const createNotes = asyncHandler(async (req, res) => {
  const { collectionName, noteName, url, fileSize, blobName } = req.body;

  if (
    typeof (collectionName || noteName || url) !== "string" &&
    !fileSize &&
    !blobName
  )
    return res.status(400).json({ success: false, message: "Invalid data" });

  const size = formatBytes(fileSize);

  const collectionFound = await Collection.findOne({ title: collectionName });

  if (!collectionFound)
    return res.status(400).json({
      success: false,
      message: `${collectionName} Collection does not exist`,
    });

  await Note.create({
    name: noteName,
    userId: req.id,
    url,
    size,
    blobName,
    collectionID: collectionFound._id,
  });

  await collectionFound.updateOne({ $inc: { totalNotesInside: +1 } });

  res.status(200).json({ success: true, message: "Note Uploaded" });
});

const getNotes = asyncHandler(async (req, res) => {
  const { collectionID } = req.query;

  if (!collectionID || collectionID.length !== 24)
    return res.status(400).json({
      success: false,
      message: "Please provide a valid collection id",
    });

  const foundNotes = await Note.find({
    collectionID: collectionID,
  });

  const arr = foundNotes.map((i) => {
    const obj = {
      id: i._id,
      name: i.name,
      size: i.size,
      url: i.url,
    };
    return obj;
  });

  res.status(200).json({ arr });
});

const deleteNote = asyncHandler(async (req, res) => {
  const { noteID } = req.query;

  if (!noteID || noteID.length !== 24)
    return res.status(400).json({
      success: false,
      message: "Please provide a valid collection id",
    });

  const foundNote = await Note.findOne({ _id: noteID, userId: req.id });

  if (!foundNote)
    return res.status(400).json({ success: false, message: "No note found" });

  const collectionFound = await Collection.findById(foundNote.collectionID);

  await collectionFound.updateOne({ $inc: { totalNotesInside: -1 } });

  const cc = await foundNote.deleteOne();

  res.status(200).json({ success: true, message: "note deleted" });
});

const deleteCollection = asyncHandler(async (req, res) => {
  const { collectionID } = req.query;

  if (!collectionID || collectionID.length !== 24)
    return res.status(400).json({
      success: false,
      message: "Please provide a valid collection id",
    });

  const { acknowledged, deletedCount } = await Collection.deleteOne({
    _id: collectionID,
    user: req.id,
  });

  if (!deletedCount)
    return res.status(400).json({ success: false, message: "No folder found" });

  const notes = await Note.find({ collectionID, userId: req.id });

  const resol = await Promise.allSettled(promise);

  await deleteMany({ collectionID, userId: req.id });

  res.status(200).json({ success: true, message: "Folder deleted" });
});

export default {
  createCollection,

  deleteNote,
  getCollectionList,
  createNotes,
  deleteCollection,
  getNotes,
  createToken,
};
