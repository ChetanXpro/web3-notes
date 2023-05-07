import asyncHandler from "express-async-handler";

import { v4 as uuid } from "uuid";
import { university } from "../data/university.js";

import {
  Favourite as Pfav,
  PublicNotes as PpublicNote,
} from "../config/dbConnecton.js";

// Create notes
// Need admin right
export const getUniversity = asyncHandler(async (req, res) => {
  const universityName = [];
  for (const key in university) {
    universityName.push({ id: key, label: key, value: key });
  }

  res.status(200).json({ universityName });
});

export const getCourse = asyncHandler(async (req, res) => {
  const { selectedUniversity } = req.body;

  if (!selectedUniversity)
    return res.status(400).json({ message: "please provide valid inputs" });
  const course = university[selectedUniversity]?.course.map((c) => {
    return { label: c, value: c };
  });
  if (!course || !semester || !subject) {
    return res.status(400).json({ message: "university not found" });
  }

  res.status(200).json({ course });
});

export const getUniversityDetails = asyncHandler(async (req, res) => {
  const { selectedUniversity } = req.body;

  if (!selectedUniversity)
    return res.status(400).json({ message: "please provide valid inputs" });

  const subject = university[selectedUniversity]?.subject.map((s) => {
    return { label: s, value: s };
  });
  if (!subject) {
    return res.status(400).json({ message: "university not found" });
  }

  res.status(200).json({ subject });
});

export const searchNotes = asyncHandler(async (req, res) => {
  const {
    selectedUniversity,

    selectedSubject,
  } = req.body;

  if (!selectedUniversity || !selectedSubject) {
    return res.status(400).json({ message: "Please provide all details" });
  }

  // const foundNotes = await PublicNotes.find({
  //   university: selectedUniversity,

  //   subject: selectedSubject,
  // });

  const foundNotes = await PpublicNote.get();

  const allNotes = foundNotes.data.filter(
    (res) =>
      res.data.university === selectedUniversity &&
      res.data.subject === selectedSubject
  );

  console.log(allNotes);

  const notes = allNotes.map((i) => {
    if (!i.data) return;
    return {
      id: i.data.id,
      name: i.data.name,
      url: i.data.url,
      size: i.data.size,
      uploadedBy: i.data.uploadedBy,
    };
  });
  res.status(200).json({ notes });
});

export const addToFav = asyncHandler(async (req, res) => {
  const { noteId } = req.body;
  if (!noteId) return res.status(200).json({ messag: "Provide valid input" });

  const foundNote = await PpublicNote.record(noteId).get();

  console.log(foundNote.data);

  const getAll = await Pfav.get();

  const foundInFav = getAll.data.filter(
    (res) => res.data.parentNoteId === noteId && res.data.userId === req.id
  );

  if (foundInFav.length > 0) {
    return res.status(400).json({ message: "Already in favourite list" });
  }
  console.log("pass");
  const id = uuid();

  console.log(
    id,
    foundNote.name,
    noteId,
    foundNote.url,
    foundNote.size,
    req.id
  );

  const { data } = await Pfav.create([
    id,
    foundNote.data.name,
    noteId,

    foundNote.data.url,
    foundNote.data.size,
    req.id,
  ]);

  res.status(200).json({ message: "Added to favourite" });
});

export const removeFav = asyncHandler(async (req, res) => {
  const { noteId } = req.body;

  await Pfav.record(noteId).call("del");

  res.status(200).json({ message: "Removed from favourite list" });
});

export const getFavList = asyncHandler(async (req, res) => {
  if (!req.id) return res.status(400).json({ message: "Something went wrong" });
  const favlistt = await (await Pfav.where("userId", "==", req.id).get()).data;

  const favlist = favlistt.map((i) => {
    if (!i.data) return;
    return {
      id: i.data.id,
      name: i.data.name,
      url: i.data.url,
      size: i.data.size,
      userId: i.data.userId,
      parentNoteId: i.data.parentNoteId,
    };
  });

  res.status(200).json({ favlist });
});
