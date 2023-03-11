const express = require('express');
const apiRouter = express.Router();
const postsRouter = require('./posts');
const usersRouter = require('./users');
const tagsRouter = require('./tags');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { getUserById } = require('../db');
const { JWT_SECRET } = process.env;                                                             //importing files


apiRouter.use(async (req, res, next) => {                                                   //function to route routers, async so program doesn't wait for it
    const prefix = 'Bearer ';                                                           //this will be the token prefix that will be sliced, space included
    const auth = req.header('Authorization');                                            //this is requesting the header to send the authorization

    if (!auth) {                                                                        //if there is no authorization header, move on
        next();                                                                         //moves on
    } else if (auth.startsWith(prefix)) {                                               //otherwise, if auth starts with bearer  , do below
        const token = auth.slice(prefix.length);                                        //assigns token with the bearer sliced off, leaving only token

        try {                                                                           
            const { id } = jwt.verify(token, JWT_SECRET);                              //assigns an object called id to the jwt verify function

            if (id) {                                                               //if that id is true, 
                req.user = await getUserById(id);                                   //request the imported function getuserbyid with the id as an arguement
                next();                                                         //move on
            }
        } catch ({ name, message }) {                                             //
            next({ name, message });
        }
    }   else {
        next({
            name: 'AuthorizationHeaderError',
            message: `Authorization token must start with ${ prefix }`
        });
    }
});

apiRouter.use((req, res, next) => {                                                 //THIS FINALLY WORKED

    if (req.user) {
        console.log("User is set:", req.user);
    }
    next();
});


apiRouter.use('/users', usersRouter);
apiRouter.use('/posts', postsRouter);
apiRouter.use('/tags', tagsRouter);



apiRouter.use((error, req, res, next) => {
    console.log('start');
    res.send({
      name: error.name,
      message: error.message
    });
    console.log('end', error.message);
  });





module.exports = apiRouter;