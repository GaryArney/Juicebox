const express = require('express');
const postsRouter = express.Router();
const { getAllPosts, createPost } = require('../db');
const { requireUser } = require('./utils');

postsRouter.post('/', requireUser, async (req, res, next) => {
   const { title, content, tags = "" } = req.body;

   const tagArr = tags.trim().split(/\s+/)
   const postData = {};

   if (tagArr.length) {
    postData.tags = tagArr;
   }

   try {
//add
    postData.authorId = req.user.id
    postData.title = title
    postData.content = content
    console.log('content', postData.content);
    const post = await createPost(postData);
    if (post) {
        res.send({ post });
    } else {
        next({
            name: 'PostERROR',
            message: 'Nothing posted.'
          });
    }
   } catch ({ name, message }) {
    next({ name, message });
   }
});

postsRouter.use((req, res, next) => {
    console.log("Request made to posts");

    next();
});

postsRouter.get('/', async (req, res) => {
    const posts = await getAllPosts();

    res.send({
        posts
    });
});

module.exports = postsRouter;