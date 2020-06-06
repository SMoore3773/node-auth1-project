const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session")
const knexSessionStore = require("connect-session-knex")(session);

const usersRouter = require('../api/users/usersRouter');
const authRouter = require('../api/auth/authRouter');
const restrictedMiddleware = require('../api/auth/restrictedMiddleware')
const server = express();

const sessionConfig = {
    name: 'sksession',
    secret: 'averyimportantone',
    cookie: {
      maxAge: 1000 * 60 * 60,
      secure: false,
      httpOnly: true
    },
    resave: false,
    saveUninitialized: false,
    store: new knexSessionStore(
      {
        knex: require('../database/db-config.js'),
        tablename: 'sessions',
        sidfieldname: 'sid',
        createtable: true,
        clearInterval: 1000 * 60 * 60
      }
    )
  }

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

server.use('/api/auth', authRouter);
server.use('/api/users', restrictedMiddleware, usersRouter);

server.get('/', (req,res)=>{
    res.json({api:'running'})
})

module.exports = server;