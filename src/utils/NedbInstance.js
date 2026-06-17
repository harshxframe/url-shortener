import Datastore from "@seald-io/nedb";

const db = new Datastore({ filename: "url.db", autoload: true });
db.ensureIndex({ fieldName: "expiresAt", expireAfterSeconds: 0 }, (err) => {
  if (err) console.error("TTL Index Setup Failed:", err);
  else console.log("⏳ TTL Index active on 'expiresAt' key!");
});

export const insertUrlService = async (payload) => {
  try {
    const newUser = await db.insertAsync(payload);
    return {
      success: true,
      message: "URL saved successfully",
      data: newUser,
    };
  } catch (e) {
    return {
      success: false,
      message: e || "DB Error",
      data: {},
    };
  }
};

export const readUrlService = async (id) => {
  try {
    const readUrl = await db.findOne({ _id: id });
    return {
      success: true,
      message: "URL fetched successfully",
      data: readUrl?.longUrl,
    };
  } catch (e) {
    return {
      success: false,
      message: e || "DB Error",
      data: {},
    };
  }
};
