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

const tracking_number = "039813852990618";

class FedExTrackingController{
	static trackFedExTrackingShipment = async(req, res) => {
		try {
            const tracking_number = req.body.trackingNumber; // get the number from the request body
			const authRes = await authFedEx();
			// input data
			const inputPayLoad = {
				includeDetailedScans:true,
				trackingInfo:[
					{
						trackingNumberInfo:{
							trackingNumber:tracking_number
						}
					}
				]

			}
			const headers = {
				'Content-Type':'application/json',
				'X-locale':'en_US',
				'Authorization': `Bearer ${authRes.access_token}`
			};
            
			const response = await axios.post(`${process.env.FEDEX_BASE_API_URL}/track/v1/trackingnumbers`, inputPayLoad, {headers:headers});
			
            if (response.data && response.data.output && response.data.output.completeTrackResults) {
				res.send(response.data.output.completeTrackResults);
			} else {
				res.status(404).send(`Failed to track the FedEx Shipment. Invalid tracking number: ${tracking_number}`);
			}
        }
        catch (error) {
            console.error('failed tracking the fedex shipment: ', error);
            res.status(500).send(`Failed to track the FedEx Shipment\nInvalid tracking number: ${tracking_number}`)
		}
	}
}

export default FedExTrackingController;