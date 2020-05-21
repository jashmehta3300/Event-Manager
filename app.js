const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const {buildSchema} = require('graphql');

const app = express();

app.use(bodyParser.json());

app.use('/graphql',graphqlHttp({
	schema: buildSchema(`
		// this is how my event object will look like
		type Event {
			_id: ID!
			title: String!
			description: String!
			price: Float!
			date: String!
		}
		type RootQuery {
			events: [String!]!
		}
		type RootMutation {
			createEvent(name: String): String
		}
		schema {
			query: rootQuery,
			mutation: rootMutation
		}
	`),
	//bundle of all resolvers
	rootValue: {
		//controller functions(same name as written in type)
		events: () => {
			return ['Cooking','Sailing','coding'];
		},
		createEvent: (args) => {
			const eventName = args.name;
			return eventName;
		}
	},
	//default ui by graphql (like dev tools)
	graphiql: true
}));

app.listen(3000);


