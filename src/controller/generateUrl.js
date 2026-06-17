import getUrlWithId from "../utils/getUrlWithId.js";
import { isValidUrl } from "../utils/isUrlValid.js";
import { insertUrlService } from "../utils/NedbInstance.js";
import { responseBody } from "../utils/responseBody.js";
import { nanoid } from "nanoid";
import { urlModel } from "../model/urlModel.js";
import { calculateTTL } from "../utils/calculateTTL.js";

export const generateUrl = async (req, res) => {
  try {
    const { url, expireInDays } = req.body || {};

    if (!url || !isValidUrl(url)) {
      return res.status(400).send(responseBody(true, 400, "Url not found", {}));
    }

    const id = nanoid();
    const ttl = calculateTTL(expireInDays || 10);
    const payload = urlModel(id, url, ttl);
    console.log(payload);

    const isSuccess = await insertUrlService(payload);
    if (isSuccess?.success) {
      return res.status(200).send(
        responseBody(false, 200, isSuccess?.message || "URL saved successfully", {
          url: getUrlWithId(req, id),
          expireInDays: expireInDays,
        }),
      );
    }
    return res
      .status(500)
      .send(responseBody(true, 500, isSuccess?.message || "Error while creating URL", {}));
  } catch (e) {
    res.status(500).send(responseBody(true, 500, e.message, {}));
  }
};
