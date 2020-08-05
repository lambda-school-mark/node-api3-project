const express = require("express");

const router = express.Router();

const Users = require("../users/userDb");
const Posts = require("../posts/postDb");

router.post("/", validateUser, (req, res) => {
  Users.insert(req.body)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch(error);
});

router.post("/:id/posts", validateUser, validatePost, (req, res) => {
  const newPost = { ...req.body, user_id: req.headers.id };
  Posts.insert(newPost)
    .then((post) => {
      res.status(200).json(post);
    })
    .catch((error) => {
      res
        .status(500)
        .json({ message: "unable to submit data", error: error.message });
    });
});

router.get("/", validateUserId, (req, res) => {
  Users.get()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((error) => {
      res.status(500).json({ message: "cannot fetch users" });
    });
});

router.get("/:id", (req, res) => {
  Users.getById(req.params.id)
    .then((user) => {
      res.status(201).json(user);
    })
    .catch((error) => {
      res
        .status(500)
        .json({ message: "cannot fetch user", error: error.message });
    });
});

router.get("/:id/posts", (req, res) => {
  Users.getUserPosts(req.params.id)
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((error) => {
      res.status(404).json({
        message: `posts for ${req.params.id} not found`,
        error: error.message,
      });
    });
});

router.delete("/:id", validateUserId, (req, res) => {
  Users.remove(req.params.id)
    .then((deleted) => {
      status(201).json({ message: `deleted user ${req.params.id}` });
    })
    .catch((error) => {
      res
        .status(500)
        .json({ message: `unable to delete user ${req.params.id}` });
    });
});

router.put("/:id", validateUserId, validateUser, (req, res) => {
  Users.update(req.params.id, req.body)
    .then(res.status(200).json({ message: `updated user ${req.params.id}` }))
    .catch((error) => {
      res
        .status(500)
        .json({ message: `unable to update user ${req.params.id}` });
    });
});

//custom middleware

function validateUserId(req, res, next) {
  const id = req.params.id;
  if (req.headers.id === id) {
    next();
  } else {
    res.status(400).json({ message: "invalid user id" });
  }
}

function validateUser(req, res, next) {
  return function (req, res, next) {
    if (!req.body.name) {
      res.status(400).json({ message: "missing required name field" });
    } else if (!req.body) {
      res.status(400).json({ message: "missing user data" });
    } else {
      next();
    }
  };
}

function validatePost(req, res, next) {
  return function (req, res, next) {
    if (!req.body) {
      res.status(400).json({ message: "missing post data" });
    } else if (!req.body.name) {
      res.status(400).json({ message: "missing required text field" });
    } else {
      next();
    }
  };
}

module.exports = router;
