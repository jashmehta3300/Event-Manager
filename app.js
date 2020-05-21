const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const {buildSchema} = require('graphql');

const app = express();

app.use(bodyParser.json());

app.use('/graphql',graphqlHttp({
	schema: buildSchema(`
		type rootQuery {
			events: [String!]!
		}
		type rootMutation {
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


