import express from "express"
import cors from "cors" // Cross-Origin Resources Sharing, in my opinion some kind of security for send/receive data between different origins (domains)
import restaurants from "./api/restaurants.route.js"

const app = express();

app.use(cors());
app.use(express.json());


/**
 * The API route
 * General API route format: /api/<version>/<api_name>
 */
app.use("/api/v1/restaurants", restaurants);

// All other routes will show error
app.use("*", (req, res) => {
	res.status(404).json({error: "API not found"});
});

/**
 * Export the app as a module
 * the file accessing the database will be able to import the app
 */
export default app;