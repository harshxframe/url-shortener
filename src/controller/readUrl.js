import { responseBody } from "../utils/responseBody.js";
import { readUrlService } from "../utils/NedbInstance.js";
import { htmlErrorBody } from "../utils/urlNotFound.js";

export const readUrl = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(404).send(htmlErrorBody(404));
    }
    const isSuccess = await readUrlService(id);
    if (isSuccess?.success && isSuccess.data) {
      return res.redirect(302, isSuccess?.data);
    }
    return res(404).status.send(htmlErrorBody(404));
  } catch (e) {
    return res.status(500).send(htmlErrorBody(500));
  }
};
