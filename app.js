const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const colors = require('colors');

const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');

//load env vars
dotenv.config({
  path: './config/config.env'
});

//Connect to database
connectDB();

const app = express();

app.use(bodyParser.json());

app.use(
  '/graphql',
  graphqlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true,
  })
);

//access env vars
const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `\nThe server is running on port ${PORT}`
      .brightBlue.bold
  )
);
