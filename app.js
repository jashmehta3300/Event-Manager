const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors')
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Event = require('./models/event')

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
    schema: buildSchema(`
        type Event {
          _id: ID!
          title: String!
          description: String!
          price: Float!
          date: String!
        }
        input EventInput {
          title: String!
          description: String!
          price: Float!
          date: String!
        }
        type RootQuery {
            events: [Event!]!
        }
        type RootMutation {
            createEvent(eventInput: EventInput): Event
        }
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
      events: () => {
        return Event.find()
          .then((events) => {
            return events.map((event) => {
              return { ...event._doc, _id: event.id };
            });
          })
          .catch((err) => {
            throw err;
          });
      },
      createEvent: (args) => {
        const event = new Event({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: new Date(args.eventInput.date),
        });
        return event
          .save()
          .then((result) => {
            console.log(result);
            return { ...result._doc, _id: result._doc._id.toString() };
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });
      },
    },
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
