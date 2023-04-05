import app from "./server.js"
import mongodb from "mongodb"
import dotenv from "dotenv"

// Load the env vars
dotenv.config();

// set port to the port in .env file, if error then set to 8000
const port = process.env.PORT || 8000;

// Connect to mongodb
const MongoClient = mongodb.MongoClient;
MongoClient.connect(
		process.env.RESTREVIEWS_DB_URI,
		{
			maxPoolSize: 50, // Max 50 ppl can connect
			wtimeoutMS: 2500, // timeout after 2500 ms
			useNewUrlParser: true
		}
	)
	.catch(err => {
		console.error(err.stack);
		process.exit(1);
	})
	.then(async client => {
		// Start the web app and listen on the port load before
		app.listen(port, () => {
			console.log(`listening on port ${port}`);
		});
	});
