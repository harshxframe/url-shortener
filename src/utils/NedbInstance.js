import Datastore from "@seald-io/nedb";

const db = new Datastore({ filename: "url.db", autoload: true });
db.ensureIndex({ fieldName: 'expiresAt', expireAfterSeconds: 0 }, (err) => {
    if (err) console.error("TTL Index Setup Failed:", err);
    else console.log("⏳ TTL Index active on 'expiresAt' key!");
});

export async function insertUrl(payload) {
  try {
    const newUser = await db.insertAsync(payload, (err,docs)=>{
        if(err){
            throw Error(err);
        }
        return true;
    });
  } catch (e) {
    throw Error(e);
  }
}
