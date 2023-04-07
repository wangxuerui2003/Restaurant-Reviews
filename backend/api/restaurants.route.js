import express from "express"
import RestaurantsCtrl from "./restaurants.controller.js"

// Routing in express
const router = express.Router();

// Demo route
// router.route("/").get((req, res) => {
// 	res.send("Hello World!");
// });

router.route("/").get(RestaurantsCtrl.apiGetRestaurants);

export default router;