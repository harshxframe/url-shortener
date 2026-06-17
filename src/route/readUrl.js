import express from "express";
import { readUrl } from "../controller/readUrl.js";


const readUrlRouter = express.Router();


readUrlRouter.get("/:id", readUrl);


export default readUrlRouter;