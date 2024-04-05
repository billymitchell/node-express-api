// TO DO
// require authentication via API key in header of request
// When API error, send error email to wmitchell@centricitynow.com with Sendgrid
// whitelist Sendgrid emails, test emails being held
// define mongo dp lookup ID 



//let zapier_data = ""
//console.log(JSON.parse(zapier_data));


let run_test = false

let testing_data = `
{"id":"36ca0d09c9daa9eb4a7426353be2b801","received_at":"2024-04-05 02:49:27","processed_at":"2024-04-05 02:49:30","mail_attachments":[{"brightstores_order_id":"100359","order_metadata_brightstores_site_url":"https:\/\/ftg-shop.mybrightsites.com","brightstores_shipping_method":"UPS Worldwide Expedited","order_items_brightstores_line_item_id":"28212494","order_items_code":"121998-16-ac-str5-24","order_items_name":"Indoor Award Plaque","shipment_quantity":"1.00","ship_date":"4\/4\/2024","tracking_number":"1Z52499E6754407960"},{"brightstores_order_id":"100363","order_metadata_brightstores_site_url":"https:\/\/ftg-shop.mybrightsites.com","brightstores_shipping_method":"UPS Ground","order_items_brightstores_line_item_id":"28215514","order_items_code":"121998-16-ac-str5-24","order_items_name":"Indoor Award Plaque","shipment_quantity":"1.00","ship_date":"4\/4\/2024","tracking_number":"1Z52499E0352309136"},{"brightstores_order_id":"100375","order_metadata_brightstores_site_url":"https:\/\/ftg-shop.mybrightsites.com","brightstores_shipping_method":"UPS Worldwide Expedited","order_items_brightstores_line_item_id":"28250731","order_items_code":"121998-16-ac-str5-24","order_items_name":"Indoor Award Plaque","shipment_quantity":"1.00","ship_date":"4\/4\/2024","tracking_number":"1Z52499E6753289582"},{"brightstores_order_id":"1045","order_metadata_brightstores_site_url":"https:\/\/ftg-redemption.mybrightsites.com","brightstores_shipping_method":"Free Shipping","order_items_brightstores_line_item_id":"28213683","order_items_code":"121998-16-ac-str5-24","order_items_name":"2024 Partner Redemption Award","shipment_quantity":"1.00","ship_date":"4\/4\/2024","tracking_number":"1Z52499E6754755978"},{"brightstores_order_id":"1050","order_metadata_brightstores_site_url":"https:\/\/ftg-redemption.mybrightsites.com","brightstores_shipping_method":"Free Shipping","order_items_brightstores_line_item_id":"28220632","order_items_code":"121998-16-ac-str5-24","order_items_name":"2024 Partner Redemption Award","shipment_quantity":"1.00","ship_date":"4\/4\/2024","tracking_number":"1Z52499E0353148540"},{"brightstores_order_id":"1052","order_metadata_brightstores_site_url":"https:\/\/ftg-redemption.mybrightsites.com","brightstores_shipping_method":"Free Shipping","order_items_brightstores_line_item_id":"28221959","order_items_code":"121998-16-ac-str5-24","order_items_name":"2024 Partner Redemption Award","shipment_quantity":"1.00","ship_date":"4\/4\/2024","tracking_number":"1Z52499E0352540153"},{"brightstores_order_id":"1054","order_metadata_brightstores_site_url":"https:\/\/ftg-redemption.mybrightsites.com","brightstores_shipping_method":"Free Shipping","order_items_brightstores_line_item_id":"28233027","order_items_code":"121998-16-ac-str5-24","order_items_name":"2024 Partner Redemption Award","shipment_quantity":"1.00","ship_date":"4\/4\/2024","tracking_number":"1Z52499E6753593878"},{"brightstores_order_id":"1056","order_metadata_brightstores_site_url":"https:\/\/ftg-redemption.mybrightsites.com","brightstores_shipping_method":"Free Shipping","order_items_brightstores_line_item_id":"28239097","order_items_code":"121998-16-ac-str5-24","order_items_name":"2024 Partner Redemption Award","shipment_quantity":"1.00","ship_date":"4\/4\/2024","tracking_number":"1Z52499E6752687868"},{"brightstores_order_id":"1057","order_metadata_brightstores_site_url":"https:\/\/ftg-redemption.mybrightsites.com","brightstores_shipping_method":"Free Shipping","order_items_brightstores_line_item_id":"28239187","order_items_code":"121998-16-ac-str5-24","order_items_name":"2024 Partner Redemption Award","shipment_quantity":"1.00","ship_date":"4\/4\/2024","tracking_number":"1Z52499E6754024089"},{"brightstores_order_id":"1058","order_metadata_brightstores_site_url":"https:\/\/ftg-redemption.mybrightsites.com","brightstores_shipping_method":"Free Shipping","order_items_brightstores_line_item_id":"28237234","order_items_code":"121998-16-ac-rec-24","order_items_name":"2024 Partner Redemption Award","shipment_quantity":"1.00","ship_date":"4\/4\/2024","tracking_number":"1Z52499E0352142495"},{"brightstores_order_id":"1073","order_metadata_brightstores_site_url":"https:\/\/ftg-redemption.mybrightsites.com","brightstores_shipping_method":"Free Shipping","order_items_brightstores_line_item_id":"28273186","order_items_code":"121998-16-ac-str5-24","order_items_name":"2024 Partner Redemption Award","shipment_quantity":"1.00","ship_date":"4\/4\/2024","tracking_number":"1Z52499E6754917990"},{"brightstores_order_id":"1074","order_metadata_brightstores_site_url":"https:\/\/ftg-redemption.mybrightsites.com","brightstores_shipping_method":"Free Shipping","order_items_brightstores_line_item_id":"28273806","order_items_code":"redemption-121998-16-ac-str5-24-str5-24","order_items_name":"2024 Partner Redemption Award","shipment_quantity":"1.00","ship_date":"4\/4\/2024","tracking_number":"1Z52499E6753495411"},{"brightstores_order_id":"1076","order_metadata_brightstores_site_url":"https:\/\/ftg-redemption.mybrightsites.com","brightstores_shipping_method":"Free Shipping","order_items_brightstores_line_item_id":"28274004","order_items_code":"121998-16-ac-str5-24","order_items_name":"2024 Partner Redemption Award","shipment_quantity":"1.00","ship_date":"4\/4\/2024","tracking_number":"1Z52499E6753478609"},{"brightstores_order_id":"1077","order_metadata_brightstores_site_url":"https:\/\/ftg-redemption.mybrightsites.com","brightstores_shipping_method":"Free Shipping","order_items_brightstores_line_item_id":"28281984","order_items_code":"121998-16-ac-str5-24","order_items_name":"2024 Partner Redemption Award","shipment_quantity":"1.00","ship_date":"4\/4\/2024","tracking_number":"1Z52499E6754357550"},{"brightstores_order_id":"1078","order_metadata_brightstores_site_url":"https:\/\/ftg-redemption.mybrightsites.com","brightstores_shipping_method":"Free Shipping","order_items_brightstores_line_item_id":"28289837","order_items_code":"121998-16-ac-str5-24","order_items_name":"2024 Partner Redemption Award","shipment_quantity":"1.00","ship_date":"4\/4\/2024","tracking_number":"1Z52499E0354533363"},{"brightstores_order_id":"1080","order_metadata_brightstores_site_url":"https:\/\/ftg-redemption.mybrightsites.com","brightstores_shipping_method":"Free Shipping","order_items_brightstores_line_item_id":"28292185","order_items_code":"121998-16-ac-str5-24","order_items_name":"2024 Partner Redemption Award","shipment_quantity":"1.00","ship_date":"4\/4\/2024","tracking_number":"1Z52499E6752817940"},{"brightstores_order_id":"1081","order_metadata_brightstores_site_url":"https:\/\/ftg-redemption.mybrightsites.com","brightstores_shipping_method":"Free Shipping","order_items_brightstores_line_item_id":"28301966","order_items_code":"121998-16-ac-rec-24","order_items_name":"2024 Partner Redemption Award","shipment_quantity":"1.00","ship_date":"4\/4\/2024","tracking_number":"1Z52499E0353549376"}]}
`

// import keys 
require('dotenv').config()

// initialize express app 
const express = require('express')
const app = express();

//get updateOrder
const updateOrder = require("./update_order")

// get sendgrid 
const sendgrid = require('./sendgrid');

// get URL mapping of BS 
const brightsites_stores = require('./brightsites_stores')

// get Update Database
const update_database = require('./update_database')

// convert incoming body of requests to JSON
app.use(express.json())

var current_date = new Date(); 
var current_date_formatted = current_date.getFullYear() +
"-" + (current_date.getMonth()+1) +
"-" + current_date.getDate() +
" "  + current_date.getHours() +
":"  + current_date.getMinutes() +
":" + current_date.getSeconds();


// Initialize tracking codes array  
let all_tracking_codes = []

// Express post method
app.post("/brightsites/shipping/tracking/mailparser/order-items/", async (request, response) => {

  let items
  let date_received

  // if test use testing data 
  if (run_test == true) {
    console.log("Running Test");
    items = JSON.parse(testing_data).mail_attachments
    // date of data sent to mailparser
    date_received = JSON.parse(testing_data).received_at
    console.log(items);
  } if (run_test == false) {
    // set body object with incoming data from post method
    items = request.body.mail_attachments
    // date of data sent to mailparser
    date_received = request.body.received_at
  }

  
  
  // Insert all tracking codes into all_tracking_codes
  items.forEach((item) => {
    all_tracking_codes.push(item.tracking_number)
  });
  
  // Find unique shipment/tracking codes
  let unique_tracking_numbers = [...new Set(all_tracking_codes)];
  
  // Initialize error state 
  let one_or_more_requests_contain_error = false

  // Initialize server response object containing all requests 
  let all_request_history = [] 

  // For each unique shipment/tracking code
  for (let index = 0; index < unique_tracking_numbers.length; index++) {

    // Initialize items in shipment array 
    let items_in_shipment = []
  
    // For each item received 
    items.forEach(item => {
  
          // If item tracking code matches the unique tracking code
          if (item.tracking_number === unique_tracking_numbers[index]){
          
            // Add this item to shipment list for this tracking code (could be >1) 
            items_in_shipment.push(item)

          }
  
          // For each brightsites store 
          brightsites_stores.store_key.forEach(key => {
  
            //If the store URL matches the item's purchase url 
            if (item.order_metadata_brightstores_site_url === key.URL){
              
              // Add the store api key to the items data
              item["api_key"] = key.API_Key

            }
          });
          
          // Format the items ship date
          let unformatted_ship_date = item.ship_date;
          let [month, day, year] = unformatted_ship_date.split("/");
          let formatted_ship_date = `${year}-${month}-${day}`;

          // Set the Formatted ship date on the item
          item["formatted_ship_date"] = formatted_ship_date       
  
    })
  
  
    let items_in_shipment_minified = []
    
    // For each unique item in a shipment
    items_in_shipment.forEach(item => {

      // Set a BS friendly object of simplified data 
      items_in_shipment_minified.push({
               id: Number(`${item.order_items_brightstores_line_item_id}`),
               quantity: Number(`${item.shipment_quantity.replace(",", "")}`),
        })

    });
    
    // Create BS friendly request object 
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
    

    // If request has error
    if (request_history.response_okay == false) {

      // Set error state or server interaction 
      one_or_more_requests_contain_error = true
      
    }

    // add request history for each api interaction to master array
    all_request_history.push({request_history})

  }

  // if no error with all requests 
  if ( one_or_more_requests_contain_error == false) {

    // send a good response
    response.status(200).send("Request Compleat")

  }

  if ( one_or_more_requests_contain_error == true) {
    response.status(400).send(all_request_history)
  }

  await update_database.update_database(request_history).catch(console.error)

})
 
const port = process.env.PORT || 8080;

//initialize server 
app.listen(port, () => {
    console.log(`its alive on http://localhost:${port}`)
})



