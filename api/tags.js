const express = require('express');
const tagsRouter = express.Router();
const { getAllTags, getPostsByTagName } = require('../db');


tagsRouter.use((req, res, next) => {
  console.log("A request is being made to /tags");

  next();
});
//starting tagsRouter section, everything works up to this point.
tagsRouter.get('/', async (req, res) => {
    const tags = await getAllTags();

    res.send({
        tags
    });
});

tagsRouter.get('/:tagName/posts', async (req, res, next) => {
  const tagName = req.params.tagName;
console.log('first tagname log', tagName);

  try {
    const posts = await getPostsByTagName(tagName)

   res.send({
       posts: posts
      })
      console.log("Posts should populate:", posts);
  } catch ({ name, message }) {
      next({ 
        name: "didn't get the posts",
        message: "Not great" });
  }
});

module.exports = tagsRouter;