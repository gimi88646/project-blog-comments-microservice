const express = require("express");
const { randomBytes } = require("crypto");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();

const commentsByPostId = {};

app.use(bodyParser.json());

app.use(cors());

app.get("/posts/:id/comments", (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", (req, res) => {
  const id = randomBytes(4).toString("hex");

  const { content } = req.body;

  const comments = commentsByPostId[req.params.id] || [];

  comments.push({ id, content });

  commentsByPostId[req.params.id] = comments;

  axios.post("http://localhost:4005", {
    type: "commentCreated",
    data: {
      commentId: id,
      comment: content,
      postId: req.params.id,
    },
  });

  res.status(201).send(comments);
});

app.listen(4001, () => {
  console.log("listening on port 4001.");
});
