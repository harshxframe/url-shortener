import { nanoid, urlAlphabet } from "nanoid";
import { isValidUrl } from "../utils/isUrlValid.js";
import { responseBody } from "../utils/responseBody.js";
import { calculateTTL } from "../utils/calculateTTL.js";
import { urlModel } from "../model/urlModel.js";
import { insertUrl } from "../utils/NedbInstance.js";

export async function urlService(url, expireDays, id) {
  try {
    if (!url || !isValidUrl(url)) {
      return false;
    }

    // create the nanoId
    // Save in DB
    const newUrl = url;
    const urlId = id;
    const ttl = calculateTTL(expireDays || 10);
    const payload = urlModel(id, urlId, newUrl, ttl);
    const isDbOpDone = await insertUrl(payload);
    if(isDbOpDone){
        return true;
    }

  } catch (e) {
    throw Error(e);
  }
}
