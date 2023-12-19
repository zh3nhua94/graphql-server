const { GraphQLObjectType, GraphQLString, GraphQLID } = require("graphql");
const ClientType = require("./ClientType");
// const { clients } = require("../../sampleData");
const Client = require("../../models/Client");

//Client type, function that returns an object
const ProjectType = new GraphQLObjectType({
	name: "Project",
	fields: () => ({
		id: { type: GraphQLID },
		clientId: { type: GraphQLID },
		name: { type: GraphQLString },
		description: { type: GraphQLString },
		status: { type: GraphQLString },
		client: {
			type: ClientType,
			resolve(parent, args) {
				return Client.findById(parent.clientId);
			},
		},
	}),
});

module.exports = ProjectType;
