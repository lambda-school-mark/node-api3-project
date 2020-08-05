const express = require("express");

const usersRouter = require("./users/userRouter");

const server = express();

server.use(express.json());
server.use("/users/", usersRouter);

server.get("/", logger, (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware
function logger(req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
}

module.exports = server;
