// initialize data validation framework
const Joi = require('joi')

// JOI validation schema
const tracking_submission_schema = Joi.object({
    brightstores_site_url: Joi.string().required(),
    brightstores_order_id: Joi.number().required(),
    brightstores_shipping_method: Joi.string().required(),
    brightstores_line_item_id: Joi.number().required(),
    shipment_quantity: Joi.number().required(),
    ship_date: Joi.string().required(),
    tracking_number: Joi.string().required(),
})


// validate body with Joi 
    const {validate_error, value} = tracking_submission_schema.validate(inputData, {abortEarly: false})


    // if validation error 
    if (validate_error) {
        // for each erorr
        error.details.forEach(detail => {
            // update error object
            validation_response.push(detail.message)
        });
        // respond to request with request history 
        response.status(400).send(request_history)
    }

    // if no validation error 
    if(!validate_error){
        //set validation to okay
        validation_response = "Formatted Okay"
        // format data 
        formatted_data = format_request_to_brightsites(inputData)
        // send request
        response_from_brightsites = update_brightsites(formatted_data)
        // if response is okay
        if (brightsites_response === "OKAY"){
            response.status(200).send("API request received and pressed OKAY!")
        }
        // if response is not okay
        if (brightsites_response !== "OKAY"){
            response.status(400).send("API request received okay, but fail to Presses")
        }
    }

    // after validation, format data 
    const format_request_to_brightsites = (inputData) => {
        formatted_data = inputData
        return formatted_data
    }
    
    // history of post interaction 
    let request_history = {
        "timestamp": current_date_formatted,
        "inputData": inputData,
        "validation_response": validation_response,
        "formatted_data": formatted_data,
        "response_from_brightsites": response_from_brightsites,
    }


    // make request to brightsites
    const update_brightsites = (formatted_data) => {
        if (formatted_data) {
            response_from_brightsites = "OKAY"
        }
        if (!formatted_data) {
            response_from_brightsites = "NOT OKAY"
        }
        return response_from_brightsites
    }