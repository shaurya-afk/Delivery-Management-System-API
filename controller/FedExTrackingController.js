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

// const tracking_number = "377101283611590";
// "122816215025810"

// class FedExTrackingController{
// 	static trackFedExTrackingShipment = async(req, res) => {
// 		try {
// 			const tracking_number = req.body.trackingNumber;		
// 			const authRes = await authFedEx();
// 			// input data
// 			const inputPayLoad = {
// 				includeDetailedScans:true,
// 				trackingInfo:[
// 					{
// 						trackingNumberInfo:{
// 							trackingNumber:tracking_number
// 						}
// 					}
// 				]

// 			}
// 			const headers = {
// 				'Content-Type':'application/json',
// 				'X-locale':'en_US',
// 				'Authorization': `Bearer ${authRes.access_token}`
// 			};
            
// 			const response = await axios.post(`${process.env.FEDEX_BASE_API_URL}/track/v1/trackingnumbers`, inputPayLoad, {headers:headers});
			
// 			console.log(JSON.stringify(response.data, null, 2));
			
//             // const trackingDetails = response.data.output.completeTrackResults;

//             if (response.data && response.data.output && response.data.output.completeTrackResults) {
// 				const trackResult = response.data.output.completeTrackResults[0].trackResults[0];

//                 // Extract the required information
//                 const senderDetails = trackResult.shipperInformation.address;
//                 const receiverDetails = trackResult.recipientInformation.address;
//                 const pickupDate = trackResult.dateAndTimes.find(dt => dt.type === "ACTUAL_PICKUP").dateTime;
//                 const deliveredDate = trackResult.dateAndTimes.find(dt => dt.type === "DELIVERED")?.dateTime || 'Not delivered yet';
//                 const deliveryStatus = trackResult.latestStatusDetail.description;

//                 // Render the EJS template with the extracted data
//                 res.render('tracking', { senderDetails, receiverDetails, pickupDate, deliveredDate, deliveryStatus });
// 				// res.json(trackResult); // changed from send -> json
// 			} else {
// 				res.status(404).send(`Failed to track the FedEx Shipment. Invalid tracking number: ${tracking_number}`);
// 			}
//         }
//         catch (error) {
//             console.error('failed tracking the fedex shipment: ', error);
// 			res.status(500).json({error: `Failed to track the FedEx Shipment\nInvalid tracking number: ${tracking_number}`})
//             // res.status(500).send(`Failed to track the FedEx Shipment\nInvalid tracking number: ${tracking_number}`)
// 		}
// 	}
// }

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

            // Log the entire response for debugging purposes
            console.log(JSON.stringify(response.data, null, 2));

            if (response.data && response.data.output && response.data.output.completeTrackResults) {
                const trackResult = response.data.output.completeTrackResults[0].trackResults[0];

                // Extract the required information
                const senderDetails = trackResult.shipperInformation.address;
                const receiverDetails = trackResult.recipientInformation.address;
                const pickupDate = trackResult.dateAndTimes.find(dt => dt.type === "ACTUAL_PICKUP").dateTime;
                const deliveredDate = trackResult.dateAndTimes.find(dt => dt.type === "DELIVERED")?.dateTime || 'Not delivered yet';
                const deliveryStatus = trackResult.latestStatusDetail.description;

                // Render the EJS template with the extracted data
                res.render('tracking', { senderDetails, receiverDetails, pickupDate, deliveredDate, deliveryStatus });
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
