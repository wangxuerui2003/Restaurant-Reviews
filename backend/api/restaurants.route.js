import express from "express"
import RestaurantsCtrl from "./restaurants.controller.js"
import ReviewsCtrl from "./reviews.controller.js"

// Routing in express
const router = express.Router();

// Demo route
// router.route("/").get((req, res) => {
// 	res.send("Hello World!");
// });

// Get list of restaurants
router.route("/").get(RestaurantsCtrl.apiGetRestaurants);

// Get list of cuisines
router.route("/cuisines").get(RestaurantsCtrl.apiGetRestaurantCuisines);

// Get restaurant by id
router.route("/id/:id").get(RestaurantsCtrl.apiGetRestaurantById);


// POST, PUT, DELETE reviews
router.route("/review")
	.post(ReviewsCtrl.apiPostReview)
	.put(ReviewsCtrl.apiUpdateReview)
	.delete(ReviewsCtrl.apiDeleteReview);

export default router;