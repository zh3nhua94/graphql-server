const express = require("express");
const colors = require("colors");
const expressPlayground = require("graphql-playground-middleware-express").default;
const { createHandler } = require("graphql-http/lib/use/express");
require("dotenv").config();
const connectDB = require("./config/db");
const port = process.env.PORT || 8800;
const schema = require("./schema/schema");
const cors = require("cors");

const app = express();

//Connect to database
connectDB();

app.use(cors());

// Create a express instance serving all methods on `/graphql`
app.all("/graphql", createHandler({ schema }));

if (process.env.NODE_ENV === "development") {
	app.get("/playground", expressPlayground({ endpoint: "/graphql" }));
}

app.listen(port, () => {
	console.log("Backend server is running!");
});
