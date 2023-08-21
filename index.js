// TO DO
// uptime monitoring by UPTimeRobot - done 
// require authentication via API key in header of request
// When API error, send error email to wmitchell@centricitynow.com with Sendgrid
// whitelist Sendgrid emails, test emails being held
// define mongo dp lookup ID 


// import keys 
require('dotenv').config()
// import mondo db
const { MongoClient, ServerApiVersion } = require('mongodb');

// initialize express app 
const express = require('express')
const app = express();

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

 // submit data to DB function
 async function update_database(request_history) {

    // mongo db database url
    const uri = `mongodb+srv://billymitchell:${process.env.MONGO_DB_PW}@centricity-shipping-api.ww7gdwo.mongodb.net/?retryWrites=true&w=majority`;
    // initialize mongo db 
    const client = new MongoClient(uri)
    

    // try to connect 
    try {
        await client.connect();
        //await listDatabases(client)

        // post data to database
        await createData(client, request_history)
    } 
    // catch connection error
    catch (error){
        console.log(error)
        // TODO: send email of error to admin
    }
    // close connection 
    finally {
        await client.close();
    }

    async function createData(client, request_history) {
        const result = await client.db("centricity-shipping-api-log").collection("logs").insertOne(request_history)
        console.log(`New listing created with the following id: ${result.insertedId}`)
    }

}


async function updateOrder(items_in_shipment, updateOrderPayload) {


    // request object
    let request_history = []


    let url = `${items_in_shipment[0].order_metadata_brightstores_site_url}/api/v2.6.0/orders/${items_in_shipment[0].brightstores_order_id}/shipments?token=${items_in_shipment[0].api_key}`;
    let response = await fetch(url, {
      method: 'POST',
      redirect: 'follow',
      headers: {
        'Content-Type': 'application/json',
      },
      body: updateOrderPayload,
    });
    // // if error
    if (!response.ok) {
      
      request_history.push({
        "response_okay": response.ok,
        "status_text": response.statusText,
        "status": response.status,
        "error": response.error,
        "payload": updateOrderPayload,
      })
      
    }
      // if no error
    if (response.ok) {
     
      request_history.push({
        "response_okay": response.ok,
        "status_text": response.statusText,
        "status": response.status,
        "error": response.error,
        "payload": updateOrderPayload,
      })
    }
    return request_history[0]
}


// Express post method
app.post("/brightsites/shipping/tracking/mailparser/order-items/", async (request, response) => {

    // set body object 
    inputData = request.body

    // date of data sent to mailparser
    let date_received = inputData.received_at

    // items to upload
    let items = inputData.mail_attachments

   // initialize empty object 
  let all_tracking_codes = []
  
  // insert all tracking codes into all_tracking_codes
  items.forEach((item) => {
    all_tracking_codes.push(item.tracking_number)
  });
  
  // find unique tracking numbers and create an array 
  let unique_tracking_numbers = [...new Set(all_tracking_codes)];
  
  // do the number of times you have a unique tracking number
  for (let index = 0; index < unique_tracking_numbers.length; index++) {

    let items_in_shipment = []
  
    // for each item
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

    request_history = await updateOrder(items_in_shipment, updateOrderPayload)
    await update_database(request_history).catch(console.error)
  }

})
 
const port = process.env.PORT || 8080;

//initialize server 
app.listen(port, () => {
    console.log(`its alive on http://localhost:${port}`)
})



