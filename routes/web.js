import express from 'express';
import FedExTrackingController from '../controller/FedExTrackingController.js'
const router = express.Router();

router.get('/', (req, res) => {
	res.render("tracking");
})

router.post("/track", FedExTrackingController.trackFedExTrackingShipment)

export default router