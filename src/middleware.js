import cors from "cors";
import dotenv from "dotenv";

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
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
});

export const publicCors = cors({
  origin: '*'
});
