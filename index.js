// TO DO
// uptime monitoring by UPTimeRobot - done 
// require authentication via API key in header of request
// When API error, send error email to wmitchell@centricitynow.com with Sendgrid
// whitelist Sendgrid emails, test emails being held
// define mongo dp lookup ID 

// import keys 
require('dotenv').config()

// initialize express app 
const express = require('express')
const app = express();

//get updateOrder
const updateOrder = require("./update_order")

// get sendgrid 
const sengrid = require('./sendgrid');

// get URL mapping of BS 
const brightsites_stores = require('./brightsites_stores')

// convert incoming body of requests to JSON
app.use(express.json())

var current_date = new Date(); 
var current_date_formatted = current_date.getFullYear() +
"-" + (current_date.getMonth()+1) +
"-" + current_date.getDate() +
" "  + current_date.getHours() +
":"  + current_date.getMinutes() +
":" + current_date.getSeconds();

// Express post method
app.post("/brightsites/shipping/tracking/mailparser/order-items/", async (request, response) => {

  // set body object 
  inputData = request.body

  // date of data sent to mailparser
  let date_received = inputData.received_at

  // items to upload
  let items = inputData.mail_attachments

  // get all tracking codes
  let all_tracking_codes = []
  
  // insert all tracking codes into all_tracking_codes
  items.forEach((item) => {
    all_tracking_codes.push(item.tracking_number)
  });
  
  // find unique tracking codes
  let unique_tracking_numbers = [...new Set(all_tracking_codes)];
  
  // For each unique code
  for (let index = 0; index < unique_tracking_numbers.length; index++) {

    // Item in shipment
    let items_in_shipment = []
  
    // For each item received
    items.forEach(item => {
  
          // if item tracking matched this tracking number
          if (item.tracking_number === unique_tracking_numbers[index]){
          
            //add item to shipment list 
            items_in_shipment.push(item)
          }
  
          // for each key 
          brightsites_stores.store_key.forEach(key => {
  
          //if the URLS match the item 
          if (item.order_metadata_brightstores_site_url === key.URL){
            // add the key to the items
            item["api_key"] = key.API_Key

          }
          });
          
          // Get and format the item ship date
          let unformatted_ship_date = item.ship_date;
          let [month, day, year] = unformatted_ship_date.split("/");
          let formatted_ship_date = `${year}-${month}-${day}`;
          item["formatted_ship_date"] = formatted_ship_date       
  
    })
  
  
    let items_in_shipment_minified = []
    
    items_in_shipment.forEach(item => {
      items_in_shipment_minified.push({
               id: Number(`${item.order_items_brightstores_line_item_id}`),
               quantity: Number(`${item.shipment_quantity.replace(",", "")}`),
        })
    });
    
    let updateOrderPayload = JSON.stringify({
        shipment: {
        tracking_number: unique_tracking_numbers[index],
        send_shipping_confirmation: true,
        ship_date: items_in_shipment[0].formatted_ship_date,
        note: `Updated From Centricity API on ${current_date_formatted} from data received ${date_received}`,
        shipping_method: items_in_shipment[0].brightstores_shipping_method,
        line_items: items_in_shipment_minified,
        },
    });  

    request_history = await updateOrder.updateOrder(items_in_shipment, updateOrderPayload)
    
    // if error
    if (typeof request_history["error"] === "undefined" ){
      // respond to request with error
      response.status(400).send("Bad Request", request_history)
    }
    // if no error 
    if (typeof request_history["error"] !== "undefined" ) {
      response.status(200).send("Request Compleat")
      await update_database.update_database(request_history).catch(console.error)
    }
  }
})
 
const port = process.env.PORT || 8080;

//initialize server 
app.listen(port, () => {
    console.log(`its alive on http://localhost:${port}`)
})



