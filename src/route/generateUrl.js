import express from 'express';
import { generateUrl } from '../controller/generateUrl.js';

const generateUrlRouter = express.Router();

generateUrlRouter.post("/generateUrl",generateUrl);

export default generateUrlRouter;