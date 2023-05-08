const Joi = require('joi')
const express = require('express')
const app = express();

// convert all incoming body to JSON
app.use(express.json())

// when you request a GET at /tshirts
// request is incoming data
// response is what we send back
app.get("/tshirt", (request, response) => {
    // if the response is okay
    response.status(200).send({
        tshirt: "SHIRT",
        size: "Large"
    })

})

const tracking_submission_schema = Joi.object({
    brightstores_site_url: Joi.string().required(),
    brightstores_order_id: Joi.number().required(),
    brightstores_shipping_method: Joi.string().required(),
    brightstores_line_item_id: Joi.number().required(),
    shipment_quantity: Joi.number().required(),
    ship_date: Joi.string().required(),
    tracking_number: Joi.string().required(),
})

//const result = schema.validate(request.body, schema)

//console.log(result);



// potential api routes
//api/brightsites/shipping/bulk-update/tracking
//api/brightsites/shipping/single-update/:order-number/tracking
//api/orderdesk/shipping/bulk-update/tracking
//api/orderdesk/shipping/single-update/:order-number/tracking

app.post("/api/brightsites/shipping/bulk-update/tracking", (request, response) => {

    const {error, value} = tracking_submission_schema.validate(request.body, {abortEarly: false})

    if (error) {
        console.log(error)
        response.status(422).send(error.details)
    }
    // set data from the request. 
    // "/:id is dynamic request URL as request.params"
    //const { id } = request.params

    const { data } = request.body


    let good_format
    let error_received


    // if data
//     if (data) {

//         console.log(data);

//         // if data in correct format
//         if (good_format = true){
//             // if no error with api communication 
//             if (error_received = false ){
//                 response.status(200).send({
//                     Message: "Data processed without error!"
//                 })
//             }
//             // if error with api communication 
//             if (error_received = true ){
//                 response.status(422).send({
//                     Message: "Request looks good but the end API returned an error!"
//                 })
//             }
//         }
//         // if data in wrong format
//         if (good_format = false){
//             response.status(400).send({
//                 Message: "Request is in the wrong format."
//             })
//         }
//     }

//     // in no data 
//     if (!data) {

//         console.log(data);

//         response.status(400).send({
//             Message: "No data received in body of request."
//         })
//     }

 })

const port = process.env.PORT || 8080;

//initialize server 
app.listen(port, () => {
    console.log(`its alive on http://localhost:${port}`)
})