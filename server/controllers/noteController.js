import asyncHandler from "express-async-handler";
import formatBytes from "../config/formateByte.js";

import { SpheronClient, ProtocolEnum } from "@spheron/storage";

import { Collection, Note } from "../config/dbConnecton.js";
import { v4 as uuid } from "uuid";

// Create collection
const createCollection = asyncHandler(async (req, res) => {
  if (!req.id)
    return res
      .status(400)
      .json({ success: false, message: "Something went wrong" });

  const { collectionName } = req.body;
  if (!collectionName)
    return res.status(400).json({ success: false, message: "Invalid input" });

  const isCollectionAlreadyExistt = await Collection.get();

  const isCollectionAlreadyExist = isCollectionAlreadyExistt.data.filter(
    (res) => res.data.user === req.id && res.data.title === collectionName
  );

  if (isCollectionAlreadyExist.length > 0)
    return res
      .status(400)
      .json({ success: false, message: "Collection already exist" });

  const id = uuid();

  await Collection.create([id, collectionName, req.id, 0]);

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

  const collectionFound = await Collection.where("user", "==", id).get();

  let data;
  if (collectionFound.data.length === 0) {
    data = [];
  } else {
    data = collectionFound.data.map((i) => {
      if (i?.data) {
        return {
          id: i.data.id,
          title: i.data.title,
          totalNotesInside: i.data.totalNotesInside,
          user: i.data.user,
        };
      }
    });
  }

  const arr = data.map((i) => {
    const obj = {
      id: i.id,
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

  // const collectionFound = await Collection.findOne({ title: collectionName });

  const isCollectionAlreadyExistt = await Collection.get();

  const isCollectionAlreadyExist = isCollectionAlreadyExistt.data.filter(
    (res) => res.data.user === req.id && res.data.title === collectionName
  );

  if (isCollectionAlreadyExist.length === 0)
    return res.status(400).json({
      success: false,
      message: `${collectionName} Collection does not exist`,
    });

  const data = isCollectionAlreadyExist[0].data;
  const id = uuid();

  const note = await Note.create([
    id,
    data.id,
    noteName,
    req?.id,
    url,
    size,
    blobName,
  ]);
  // .catch((err) => console.log(err));

  // console.log(note);

  const dd = await Collection.record(data.id).call("updateTotalNotesInside", [
    "+",
  ]);

  res.status(200).json({ success: true, message: "Note Uploaded" });
});

const getNotes = asyncHandler(async (req, res) => {
  const { collectionID } = req.query;

  if (!collectionID)
    return res.status(400).json({
      success: false,
      message: "Please provide a valid collection id",
    });

  const notes = await Note.where("collectionID", "==", collectionID).get();

  let arr;
  if (notes.data.length === 0) {
    arr = [];
  } else {
    arr = notes.data.map((i) => {
      if (i?.data) {
        return {
          id: i.data.id,
          name: i.data.name,
          size: i.data.size,
          url: i.data.url,
        };
      }
    });
  }

  res.status(200).json({ arr });
});

const deleteNote = asyncHandler(async (req, res) => {
  const { noteID } = req.query;

  if (!noteID)
    return res.status(400).json({
      success: false,
      message: "Please provide a valid note id",
    });

  const isUsersNote = await Note.where("id", "==", noteID)
    .where("userId", "==", req.id)
    .get();

  const { data } = await Note.record(isUsersNote.data[0].data.id).call("del");

  await Collection.record(isUsersNote.data[0].data.collectionID).call(
    "updateTotalNotesInside",
    ["-"]
  );

  res.status(200).json({ success: true, message: "note deleted" });
});

const deleteCollection = asyncHandler(async (req, res) => {
  const { collectionID } = req.query;

  if (!collectionID)
    return res.status(400).json({
      success: false,
      message: "Please provide a valid collection id",
    });

  const isUsersCollection = await Collection.where("id", "==", collectionID)
    .where("user", "==", req.id)
    .get();
  console.log(isUsersCollection.data[0].data.id);
  const { data } = await Collection.record(
    isUsersCollection.data[0].data.id
  ).call("del");

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
