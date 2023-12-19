// const { projects, clients } = require("../sampleData");
const {
	GraphQLSchema,
	GraphQLObjectType,
	GraphQLString,
	GraphQLID,
	GraphQLList,
	GraphQLNonNull,
	GraphQLEnumType,
} = require("graphql");
const ClientType = require("./TypeDefs/ClientType");
const ProjectType = require("./TypeDefs/ProjectType");
//Mongoose model
const Project = require("../models/Project");
const Client = require("../models/Client");

//When doing a query, pass in object
const RootQuery = new GraphQLObjectType({
	name: "RootQueryType",
	fields: {
		//GET all project
		projects: {
			type: new GraphQLList(ProjectType),
			resolve(parent, args) {
				return Project.find();
			},
		},
		//GET specific project
		project: {
			type: ProjectType,
			args: { id: { type: GraphQLID } }, //where passing in an id as argument for query
			resolve(parent, args) {
				return Project.findById(args.id);
			},
		},
		//GET all client
		clients: {
			type: new GraphQLList(ClientType),
			resolve(parent, args) {
				return Client.find();
			},
		},
		//GET specific client
		client: {
			type: ClientType,
			args: { id: { type: GraphQLID } }, //where passing in an id as argument for query
			resolve(parent, args) {
				return Client.findById(args.id);
			},
		},
	},
});

//Mutations
const mutation = new GraphQLObjectType({
	name: "Mutation",
	fields: {
		//Add Client
		addClient: {
			type: ClientType,
			args: {
				name: { type: GraphQLNonNull(GraphQLString) },
				email: { type: GraphQLNonNull(GraphQLString) },
				phone: { type: GraphQLNonNull(GraphQLString) },
			},
			resolve(parent, args) {
				const client = new Client({
					name: args.name,
					email: args.email,
					phone: args.phone,
				});
				return client.save();
			},
		},
		//Delete Client
		deleteClient: {
			type: ClientType,
			args: {
				id: { type: GraphQLNonNull(GraphQLID) },
			},
			resolve(parent, args) {
				return Client.findByIdAndDelete(args.id);
			},
		},
		//Add Project
		addProject: {
			type: ProjectType,
			args: {
				name: { type: GraphQLNonNull(GraphQLString) },
				description: { type: GraphQLNonNull(GraphQLString) },
				status: {
					type: new GraphQLEnumType({
						name: "ProjectStatus",
						values: {
							new: { value: "Not Started" },
							progress: { value: "In Progress" },
							completed: { value: "Completed" },
						},
					}),
					defaultValue: "Not Started",
				},
				clientId: { type: GraphQLNonNull(GraphQLID) },
			},
			resolve(parent, args) {
				const project = new Project({
					name: args.name,
					description: args.description,
					status: args.status,
					clientId: args.clientId,
				});
				return project.save();
			},
		},
		//Delete Project
		deleteProject: {
			type: ProjectType,
			args: {
				id: { type: GraphQLNonNull(GraphQLID) },
			},
			resolve(parent, args) {
				return Project.findByIdAndDelete(args.id);
			},
		},
		//Update Project
		updateProject: {
			type: ProjectType,
			args: {
				id: { type: GraphQLNonNull(GraphQLID) },
				name: { type: GraphQLString },
				description: { type: GraphQLString },
				status: {
					type: new GraphQLEnumType({
						name: "ProjectStatusUpdate",
						values: {
							new: { value: "Not Started" },
							progress: { value: "In Progress" },
							completed: { value: "Completed" },
						},
					}),
				},
			},
			resolve(parent, args) {
				return Project.findByIdAndUpdate(
					args.id,
					{
						$set: {
							name: args.name,
							description: args.description,
							status: args.status,
						},
					},
					{ new: true } //new meaning if it doesn't exist, create it
				);
			},
		},
	},
});

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: mutation,
});
