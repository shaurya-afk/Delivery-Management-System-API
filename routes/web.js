import express from 'express';
import FedExTrackingController from '../controller/FedExTrackingController.js'
const router = express.Router();

router.get('/', (req, res) => {
	res.render("tracking");
})

// made the line below to post from get
router.post("/track", FedExTrackingController.trackFedExTrackingShipment)

export default router