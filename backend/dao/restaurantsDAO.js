// Reference to the database
let restaurants;

export default class RestaurantsDAO {
	/**
	 * Connect to the mongodb database and specifically the restaurants collection
	 * If the database connection is already established, just return
	 */
	static async injectDB(conn) {
		if (restaurants) {
			return ;
		}
		try {
			restaurants = await conn.db(process.env.RESTREVIEWS_NS).collection('restaurants');
		} catch (e) {
			console.error(`Unable to establish a collection handle in restaurantsDAO: ${e}`)
		}
	}

	/**
	 * First get the filters (null if no filters provided) and init the mongodb query.
	 * Then try to find the data from the restaurants collection.
	 * Then skip certain pages and limit restaurantsPerPage according to the API request parameters.
	 * After all return the restaurantsList and totalNumRestaurants in a JSON format.
	 * If an error is occured in any step, log the error and return restaurantsList and totalNumRestaurants as empty and 0.
	 * 
	 * @param {*} param0 API request parameters
	 * @returns restaurantsList: Array, totalNumRestaurants: Int (in JSON)
	 */
	static async getRestaurants({
		filters = null,
		page = 0,
		restaurantsPerPage = 20
	} = {}) // function starts here
	{
		let query;
		let cursor;

		if (filters) {
			if ('name' in filters) {
				query = { $text: { $search: filters['name'] } };
			} else if ('cuisine' in filters) {
				query = { 'cuisine': { $eq: filters['cuisine'] } };
			} else if ('zipcode' in filters) {
				query = { 'address.zipcode': { $eq: filters['zipcode'] } };
			}
		}

		try {
			cursor = await restaurants
				.find(query);
		} catch (e) {
			console.error(e);
			return { restaurantsList: [], totalNumRestaurants: 0};
		}

		const displayCursor = cursor.limit(restaurantsPerPage).skip(restaurantsPerPage * page);

		try {
			const restaurantsList = await displayCursor.toArray();
			const totalNumRestaurants = await restaurants.countDocuments(query);

			return { restaurantsList, totalNumRestaurants };
		} catch (e) {
			console.error("Unable to convert cursor to array or problem counting documents, ", e);

			return { restaurantsList: [], totalNumRestaurants: 0};
		}
	}

}