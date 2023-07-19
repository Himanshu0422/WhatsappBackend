import app from "./app.js";
import logger from "./configs/logger.config.js";
import mongoose from "mongoose";
import { Server } from "socket.io";
import SocketServer from "./SocketServer.js";

const { DATABASE_URL } = process.env;
const PORT = process.env.PORT || 8000;

mongoose.connection.on("error", (err) => {
  logger.error(`Mongodb connection error: ${err}`);
  process.exit(1);
});

if (process.env.NODE_ENV !== "production") {
  mongoose.set("debug", true);
}

mongoose
  .connect(DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    logger.info("Connected to Mongodb");
  });

let server = app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

const io = new Server(server, {
  pingTimeout: 60000,
	cors: {
    origin: process.env.CLIENT_ENDPOINT
	}
});

io.on('connection', (socket) => {
  logger.info("socket connection established");
  SocketServer(socket, io);
});

const exitHandler = () => {
  if (server) {
    logger.info("Server closed");
    process.exit(1);
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  if (server) {
    logger.info("Server closed");
    process.exit(1);
  }
});
