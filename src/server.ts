import { Server } from "http";
import app from "./app";
import config from "./config";

let server: Server;

async function main() {
  try {
    server = app.listen(config.port, () => {
      console.log("Server is running on port", config.port);
    });
  } catch (error) {
    console.log(error);
  }
}

main();

process.on("unhandledRejection", () => {
  console.log(`😈 unhandledRejection is detected, shutting down...`);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("uncaughtException", () => {
  console.log(`😈 uncaughtException is detected, shutting down...`);
  process.exit(1);
});
