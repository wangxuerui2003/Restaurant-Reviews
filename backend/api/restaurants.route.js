import express from "express"

// Routing in express
const router = express.Router();

// Demo route
router.route("/").get((req, res) => {
	res.send("Hello World!");
});

export default router;