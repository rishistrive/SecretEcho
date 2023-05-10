require("dotenv").config();
const PORT = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== "production";
const { dbConnect } = require("./config/dbConnect");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const next = require("next");
const app = next({ dev });
const handle = app.getRequestHandler();

const server = express();

server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(cors());
server.use(helmet());
server.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
server.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self'", "'unsafe-eval'"],
    },
  })
);

dbConnect();

app.prepare().then(() => {
  server.all("*", (req, res) => {
    return handle(req, res);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
