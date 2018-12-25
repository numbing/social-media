const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const Post = require("../../models/Post");
const validatePostInput = require("../../validation/post");

const Profile = require("../../models/Profile");

// @route GET api/posts/test
// @access Public

router.get("/test", (req, res) =>
  res.json({
    msg: "posts works"
  })
);

// GET api/posts
// Public

router.get("/", (req, res) => {
  Post.find()
    .sort({
      date: -1
    })
    .then(post => res.json(post))
    .catch(err =>
      res.status(404).json({
        nopostfound: "No post found"
      })
    );
});

// GET api/posts/:id
// Public

router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err =>
      res.status(404).json({
        nopostfound: "No post found with that ID"
      })
    );
});

// @route POST api/posts
// @access Private

router.post(
  "/",
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });
    newPost.save().then(post => res.json(post));
  }
);

// DELETE api/posts:id
// Private
router.delete(
  "/:id",
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    Profile.findOne({
      user: req.user.id
    }).then(profile => {
      Post.findById(req.params.id).then(post => {
        //check for post owner
        if (post.user.toString() !== req.user.id) {
          return res.status(401).json({
            notauthorized: " user not authorized"
          });
        }

        post
          .remove()
          .then(() => {
            res.json({ success: true });
          })
          .catch(err =>
            res.status(404).json({ postnotfound: "No Post found" })
          );
      });
    });
  }
);

// DELETE api/posts/like/:id
// Private
router.delete(
  "/:id",
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    Profile.findOne({
      user: req.user.id
    }).then(profile => {
      Post.findById(req.params.id).then(post => {
        //check for post owner
        if (post.user.toString() !== req.user.id) {
          return res.status(401).json({
            notauthorized: " user not authorized"
          });
        }

        post
          .remove()
          .then(() => {
            res.json({ success: true });
          })
          .catch(err =>
            res.status(404).json({ postnotfound: "No Post found" })
          );
      });
    });
  }
);

module.exports = router;
