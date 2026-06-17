import cors from "cors";
import dotenv from "dotenv";
import { responseBody } from "./utils/responseBody.js";

dotenv.config();

// Fix: Use fallback values to prevent crashes if the .env variable is missing
const allowedHost = process.env.ALLOWED_HOST || "";
const allowedOrigins = [allowedHost];

console.log("Configured CORS Whitelist:", allowedOrigins);

export const restrictedCors = cors({
  origin: function (origin, callback) {
    // Allows Postman/cURL/Server-to-server requests.
    // Delete "!origin" if you want to block EVERYTHING except your exact frontend.
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
});

export const publicCors = cors({
  origin: "*",
});

export const globalErrorHandler = (err, req, res, next) => {
  console.error("Global Error Caught:", err.message);
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  return res
    .status(statusCode)
    .send(
      responseBody(true, statusCode, message, {
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
      }),
    );
};
