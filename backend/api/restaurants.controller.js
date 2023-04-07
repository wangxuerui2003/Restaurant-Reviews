import RestaurantsDAO from "../dao/restaurantsDAO.js"

export default class RestaurantsController {
	/**
	 * Parse the API request and init the filters, page and restaurantsPerPage variables.
	 * Then pass them into the getRestaurants method and assign the response to 
	 * restaurantsList and totalNumRestaurants.
	 * Use the res function passed in by Express and send json data as response.
	 * 
	 * @param {*} req 
	 * @param {*} res 
	 * @param {*} next 
	 */
	static async apiGetRestaurants(req, res, next) {
		const restaurantsPerPage = req.query.restaurantsPerPage ? parseInt(req.query.restaurantsPerPage, 10) : 20;
		const page = req.query.page ? parseInt(req.query.page, 10) : 0

		let filters = {};
		if (req.query.cuisine) {
			filters.cuisine = req.query.cuisine;
		} else if (req.query.zipcode) {
			filters.zipcode = req.query.zipcode;
		} else if (req.query.name) {
			filters.name = req.query.name;
		}

		const { restaurantsList, totalNumRestaurants } = await RestaurantsDAO.getRestaurants({
			filters,
			page,
			restaurantsPerPage
		});

		// The json data that is going to be responsed.
		let response = {
			restaurants: restaurantsList, // The restaurants
			page: page,
			filters: filters,
			entries_per_page: restaurantsPerPage,
			total_results: totalNumRestaurants
		}
		res.json(response);
	}

	/**
	 * Get the restaurant info by it's id.
	 * Extract the restaurant_id from req.params (e.g. /:id)
	 * and get the restaurant info by calling the getRestaurantByID method in the RestaurantsDAO class
	 * 
	 * @param {*} req 
	 * @param {*} res 
	 * @param {*} next 
	 * @returns 
	 */
	static async apiGetRestaurantById(req, res, next) {
		try {
			let id = req.params.id || {};
			let restaurant = await RestaurantsDAO.getRestaurantByID(id);
			if (!restaurant) {
				res.status(404).json({ error: "Not found" });
				return ;
			}
			res.json(restaurant);
		} catch (e) {
			console.log(`api, ${e}`);
			res.status(500).json({ error: e });
		}
	}

	/**
	 * Get all cuisines.
	 * By calling the getCuisines method in the RestaurantsDAO class.
	 * 
	 * @param {*} req 
	 * @param {*} res 
	 * @param {*} next 
	 */
	static async apiGetRestaurantCuisines(req, res, next) {
		try {
			let cuisines = await RestaurantsDAO.getCuisines();
			res.json(cuisines);
		} catch (e) {
			console.log(`api, ${e}`);
			res.status(500).json({ error: e });
		}
	}
}