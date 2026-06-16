import { urlService } from "../service/urlService.js";
import getUrlWithId from "../utils/getUrlWithId.js";
import { isValidUrl } from "../utils/isUrlValid.js";
import { responseBody } from "../utils/responseBody.js";
import { nanoid } from "nanoid";

export const generateUrl = async (req,res) =>{
    try{

        const {url, expireInDays} = req.body || {}

        if(!url || !isValidUrl(url)){
            return res.status(400).send(responseBody(true, 400, "Url not found", {}));
        }

        const id = nanoid()
        const isSuccess = await urlService(url, expireInDays, id);
        if(isSuccess){
            return res.status.send(responseBody(false, 200, "URL saved successfully", {url:getUrlWithId(req,id), expireInDays: expireInDays}));
        }

        return res.status(500).send(responseBody(true, 500, "Error while creating URL", {}));

    }catch(e){
        res.status(500).send(responseBody(true, 500, e.message, {}));
    }
}