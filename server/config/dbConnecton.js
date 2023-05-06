import { set, connect } from "mongoose";
import logger from "./logger.js";
// import { info, error as _error } from "./logger";

// const logger = require("./logger");

const connectDB = async () => {
  try {
    set("strictQuery", false);
    await connect(process.env.DATABASE_URI, () => {
      logger.info("Database connected");
    });
  } catch (error) {
    logger.error(error);
  }
};

import { Polybase } from "@polybase/client";

import { ethPersonalSign } from "@polybase/eth";
import { decodeFromString } from "@polybase/util";

const PRIVATE_KEY = process.env.PRIVATE_KEY ?? "";

const db = new Polybase({
  baseURL: `https://testnet.polybase.xyz/v0`,
  defaultNamespace:
    "pk/0x30dd37d78888d4ba3c26ac0ba5dc09eb01869e547444df1b419618521a4ebe10668d339496e76d30344e8461a2037af1abb13154baa5ec4bf2db28cbaf2103c9/test",

  signer: async (data) => {
    const privateKey = Buffer.from(
      decodeFromString(
        "5d82fcb21470b5afa3bef64d6502e6182fb23d1131bd489db57982858c6e1f48",
        "hex"
      )
    );
    return { h: "eth-personal-sign", sig: ethPersonalSign(privateKey, data) };
  },
});

const User = db.collection("User");
const Collection = db.collection("Collection");
const Note = db.collection("Note");
const PublicNotes = db.collection("PublicNotes");
const Favourite = db.collection("Favourite");

export { db, User, Collection, Note, PublicNotes, Favourite };
export default connectDB;
