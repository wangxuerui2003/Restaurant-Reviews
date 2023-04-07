import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId;

let reviews;

export default class ReviewsDAO {
	/**
	 * Connect to the mongodb database and specifically the reviews collection
	 * If the database connection is already established, just return
	 */
	static async injectDB(conn) {
		if (reviews) {
			return ;
		}
		
		try {
			reviews = await conn.db(process.env.RESTREVIEWS_NS).collection("reviews");
		} catch (e) {
			console.error(`Unable to establish collection handles in reviewsDAO: ${e}`);
		}
	}

	/**
	 * Add a new review via POST http method.
	 * 
	 * @param {*} restaurantId restaurant_id with type Mongodb ObjectId
	 * @param {*} user user info object, contains { name, _id }
	 * @param {*} review review text
	 * @param {*} date time now
	 * @returns returns nothing if success
	 */
	static async addReview(restaurantId, user, review, date) {
		try {
			const reviewDoc = {
				name: user.name,
				user_id: user._id,
				date: date,
				text: review,
				restaurant_id: new ObjectId(restaurantId)
			}

			return await reviews.insertOne(reviewDoc);
		} catch (e) {
			console.error(`Unable to post review: ${e}`);
			return { error: e }; 
		}
	}

	/**
	 * Update a review via the PUT http method.
	 * 
	 * @param {*} reviewId review_id with type Mongodb ObjectId
	 * @param {*} userId user_id (number)
	 * @param {*} text new review text
	 * @param {*} date time now
	 * @returns returns nothing if success
	 */
	static async updateReview(reviewId, userId, text, date) {
		try {
			const updateResponse = await reviews.updateOne(
				{ user_id: userId, _id: new ObjectId(reviewId) },
				{ $set: { text: text, date: date } }
			);

			return updateResponse;
		} catch (e) {
			console.error(`Unable to update review: ${e}`);
			return { error: e }; 
		}
	}

	/**
	 * Delete a review via DELETE http method.
	 * 
	 * @param {*} reviewId review_id with type of mongodb ObjectId
	 * @param {*} userId user_id (number)
	 * @returns returns nothing if success
	 */
	static async deleteReview(reviewId, userId) {
		try {
			const deleteResponse = await reviews.deleteOne({
				_id: new ObjectId(reviewId),
				user_id: userId
			});

			return deleteResponse;
		} catch (e) {
			console.error(`Unable to delete review: ${e}`);
			return { error: e }; 
		}
	}
}