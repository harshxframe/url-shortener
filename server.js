import { initApp } from "./src/app.js";

const port = process.env.PORT || 2020;
const app = await initApp();

async function startServer(port) {
  try {
    app.listen(port, () => {
      console.log("Server started at port: " + port);
    });
  } catch (e) {
    console.log("Failed to start server error: " + e.message);
  }
}

startServer(port);
