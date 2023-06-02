// TO DO
// uptime monitoring by UPTimeRobot - done 

// When API error, send error email to wmitchell@centricitynow.com with Sendgrid
// whitelist Sendgrid emails, test emails being held
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://wmitchell:${process.env.MONGO_DB_PW}@cluster0.pbglcpz.mongodb.net/?retryWrites=true&w=majority`;
const Joi = require('joi')
const express = require('express')
const app = express();

const sengrid = require('./sendgrid');
const brightsites_stores = require('./brightsites_stores')

//console.log(brightsites_stores);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });
  async function connect_to_MongoDB() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }
  connect_to_MongoDB().catch(console.dir);

// convert all incoming body to JSON
app.use(express.json())

const tracking_submission_schema = Joi.object({
    brightstores_site_url: Joi.string().required(),
    brightstores_order_id: Joi.number().required(),
    brightstores_shipping_method: Joi.string().required(),
    brightstores_line_item_id: Joi.number().required(),
    shipment_quantity: Joi.number().required(),
    ship_date: Joi.string().required(),
    tracking_number: Joi.string().required(),
})

// Mongo DB UN: wmitchell
// 

let incoming_data
let validation_error = []
let formatted_data
let brightsites_response
let response_from_brightsites

const format_request_to_brightsites = (incoming_data) => {
    formatted_data = incoming_data
    return formatted_data
}

const update_brightsites = (formatted_data) => {

    if (formatted_data) {
        brightsites_response = "OKAY"
    }
    if (!formatted_data) {
        brightsites_response = "NOT OKAY"
    }
    return brightsites_response
}

const update_database = (request_history) => {
    console.log(request_history);
}   

app.post("/brightsites/shipping/tracking/single-order/single-item/", (request, response) => {

    let request_history = {
        "incoming_data": incoming_data,
        "validation_response": validation_error,
        "formatted_data": formatted_data,
        "response_from_brightsites": response_from_brightsites,
    }

    incoming_data = request.body
    // TO DO: Log Data

    const {error, value} = tracking_submission_schema.validate(incoming_data, {abortEarly: false})

    // if validation error 
    if (error) {
        error.details.forEach(detail => {
            validation_error.push(detail.message)
        });
        response.status(400).send(validation_error)
    }

    // if no validation error 
    if(!error){
        // format data 
        formatted_request_to_brightsites = format_request_to_brightsites(incoming_data)
        // send request
        brightsites_response = update_brightsites(formatted_request_to_brightsites)
        // if response is okay
        if (brightsites_response === "OKAY"){
            response.status(200).send("API request received and pressed OKAY!")
        }
        // if response is not okay
        if (brightsites_response !== "OKAY"){
            response.status(400).send("API request received okay, but fail to pressed")
        }
    }

    update_database(request_history)

 })

const port = process.env.PORT || 8080;

//initialize server 
app.listen(port, () => {
    console.log(`its alive on http://localhost:${port}`)
})

