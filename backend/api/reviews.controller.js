import ReviewsDAO from "../dao/reviewsDAO.js"

export default class ReviewsController {
	/**
	 * Controller for posting review.
	 * Extract the json data from req.body and add review by calling the addReview method in ReviewsDAO class.
	 * 
	 * @param {*} req 
	 * @param {*} res 
	 * @param {*} next 
	 */
	static async apiPostReview(req, res, next) {
		try {
			const restaurantId = req.body.restaurant_id;
			const review = req.body.text;
			const userInfo = {
				name: req.body.name,
				_id: req.body.user_id
			}
			const date = new Date();

			const reviewResponse = await ReviewsDAO.addReview(
				restaurantId,
				userInfo,
				review,
				date
			);

			let { error } = reviewResponse;
			if (error) {
				res.status(400).json({ error });
			}

			res.json({ status: "success" });
		} catch (e) {
			res.status(500).json({ error: e.message });
		}
	}

	/**
	 * Controller for updating review.
	 * Extract the json data from req.body and update review by calling the updateReview method in ReviewsDAO class.
	 * 
	 * @param {*} req 
	 * @param {*} res 
	 * @param {*} next 
	 */
	static async apiUpdateReview(req, res, next) {
		try {
			const reviewId = req.body.review_id;
			const text = req.body.text;
			const date = new Date();

			const reviewResponse = await ReviewsDAO.updateReview(
				reviewId,
				req.body.user_id,
				text,
				date
			)

			let { error } = reviewResponse;
			if (error) {
				res.status(400).json({ error });
			}

			if (reviewResponse.modifiedCount === 0) {
				throw new Error(
					"Unable to update review"
				);
			}

			res.json({ status: "success" });
		} catch (e) {
			res.status(500).json({ error: e.message });
		}
	}

	/**
	 * Controller for deleting review.
	 * Extract the json data from req.body and delete review by calling the deleteReview method in ReviewsDAO class.
	 * 
	 * @param {*} req 
	 * @param {*} res 
	 * @param {*} next 
	 */
	static async apiDeleteReview(req, res, next) {
		try {
			const reviewId = req.query.id;
			const userId = req.body.user_id;
			
			const reviewResponse = await ReviewsDAO.deleteReview(
				reviewId,
				userId
			);

			res.json({ status: "success" });
		} catch (e) {
			res.status(500).json({ error: e.message });
		}	
	}
}