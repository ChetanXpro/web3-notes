import { Polybase } from "@polybase/client";

import { ethPersonalSign } from "@polybase/eth";
import { decodeFromString } from "@polybase/util";

const PRIVATE_KEY = process.env.PRIVATE_KEY ?? "";

const db = new Polybase({
  baseURL: `https://testnet.polybase.xyz/v0`,
  defaultNamespace: process.env.NAMESPACE,

  signer: async (data) => {
    const privateKey = Buffer.from(
      decodeFromString(process.env.PRIVATE_KEY, "hex")
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
