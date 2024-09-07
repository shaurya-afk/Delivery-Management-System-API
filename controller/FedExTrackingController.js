import axios from 'axios';


const authFedEx = async() => {
	try {
		// input data
        const inputPayLoad = new URLSearchParams({
			grant_type:'client_credentials',
			client_id:process.env.FEDEX_API_KEY,
			client_secret:process.env.FEDEX_SECRET_KEY,
		});
        // headers
		const headers = {
			'Content-Type':'application/x-www-form-urlencoded'
		}
		const response = await axios.post(`${process.env.FEDEX_BASE_API_URL}/oauth/token`, inputPayLoad, {headers: headers});
		return response.data;
	} catch (error) {
		console.log(`error authenticating with fedex: ${error}`);
		throw new Error('Failed to connect with the FedEx API!!');
	}
}

class FedExTrackingController {
    static trackFedExTrackingShipment = async(req, res) => {
        try {
            const tracking_number = req.body.trackingNumber;        
            const authRes = await authFedEx();

            const inputPayLoad = {
                includeDetailedScans: true,
                trackingInfo: [
                    {
                        trackingNumberInfo: {
                            trackingNumber: tracking_number
                        }
                    }
                ]
            }

            const headers = {
                'Content-Type': 'application/json',
                'X-locale': 'en_US',
                'Authorization': `Bearer ${authRes.access_token}`
            };
            
            const response = await axios.post(`${process.env.FEDEX_BASE_API_URL}/track/v1/trackingnumbers`, inputPayLoad, { headers });

            console.log(JSON.stringify(response.data, null, 2));

            if (response.data && response.data.output && response.data.output.completeTrackResults) {
                const trackResult = response.data.output.completeTrackResults[0].trackResults[0];
                const senderDetails = trackResult.shipperInformation?.address || 'Sender address not available';
                const receiverDetails = trackResult.recipientInformation?.address || 'Receiver address not available';
                const pickupDate = trackResult.dateAndTimes?.find(dt => dt.type === "ACTUAL_PICKUP")?.dateTime || 'Pickup date not available';
                const deliveredDate = trackResult.dateAndTimes?.find(dt => dt.type === "ACTUAL_DELIVERY")?.dateTime || 'Not delivered yet';
                const deliveryStatus = trackResult.latestStatusDetail?.description || 'Status not available';

                res.json({ senderDetails, receiverDetails, pickupDate, deliveredDate, deliveryStatus });

                console.log(`Sender: ${JSON.stringify(senderDetails)}\nReceiver: ${JSON.stringify(receiverDetails)}\nPickup: ${pickupDate}\nDelivered: ${deliveredDate}\nStatus: ${deliveryStatus}`);
            } else {
                res.status(404).send(`Failed to track the FedEx Shipment. Invalid tracking number: ${tracking_number}`);
            }
        } catch (error) {
            console.error('Failed tracking the FedEx shipment: ', error);
            res.status(500).json({ error: `Failed to track the FedEx Shipment. Tracking number: ${tracking_number}`, details: error.message });
        }
    }
}

export default FedExTrackingController;