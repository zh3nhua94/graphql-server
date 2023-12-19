const { GraphQLObjectType, GraphQLString, GraphQLID } = require("graphql");

//Client type, function that returns an object
const ClientType = new GraphQLObjectType({
	name: "Client",
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		email: { type: GraphQLString },
		phone: { type: GraphQLString },
	}),
});

module.exports = ClientType;
