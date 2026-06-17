import express from "express";
import dotenv from "dotenv";
import generateUrlRouter from "./route/generateUrl.js";
import readUrlRouter from "./route/readUrl.js";
import { responseBody } from "./utils/responseBody.js";
import cors from "cors";
import { globalErrorHandler, publicCors, restrictedCors } from "./middleware.js";

dotenv.config();

export const initApp = () => {
  try {
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use("/app/v1", restrictedCors, generateUrlRouter);
    app.use("/", publicCors, readUrlRouter);
    app.get("/health", (req, res) => {
      res.send(responseBody(false, 200, "Health is Ok!", {}));
    });
    app.use("/", (req, res) => {
      res.send(responseBody(true, 404, "Route not found", {}));
    });
    app.use(globalErrorHandler);
    return app;
  } catch (e) {
    throw Error(e.message);
  }
};
