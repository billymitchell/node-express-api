// server.js

// Import required modules
const express = require("express");
const app = express();
require("dotenv").config();

const updateOrder = require("./update_order");
const brightsites_stores = require("./brightsites_stores");
const testing_data = require("./test.json");

const run_test = "false"

// TODO: Setup MongoDB connection for robust logging
// e.g., const { MongoClient } = require("mongodb");
// const client = new MongoClient(process.env.MONGO_URI);
// client.connect();

// TODO: Import SendGrid module for sending detailed error emails
// e.g., const sgMail = require('@sendgrid/mail');
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Middleware to parse JSON bodies
app.use(express.json());

// Function to get the current date formatted as ISO but with a space instead of T.
// This returns a string like "2025-02-06 14:30:00".
function formatCurrentDate() {
  return new Date().toISOString().replace("T", " ").split(".")[0];
}

// Function to group order items by their tracking number.
// Also attaches the appropriate Brightsites API key based on URL match
// and formats the ship date from mm/dd/yyyy to yyyy-mm-dd.
function groupItemsByTracking(items) {
  return items.reduce((acc, item) => {
    // Loop through all known store keys
    brightsites_stores.store_key.forEach((key) => {
      // If the URL matches, attach the API key to the item
      if (item.order_metadata_brightstores_site_url === key.URL) {
        item.api_key = key.API_Key;
      }
    });
    // Reformat ship date as yyyy-mm-dd
    const [month, day, year] = item.ship_date.split("/");
    item.formatted_ship_date = `${year}-${month}-${day}`;
    // Group items by tracking number
    acc[item.tracking_number] = acc[item.tracking_number] || [];
    acc[item.tracking_number].push(item);
    return acc;
  }, {});
}

// Main handler for POST requests.
async function handlePostRequest(req, res) {
  // TODO: Validate incoming data thoroughly (e.g., using Joi or express-validator)
  // Destructure items and date received from request body
  const { mail_attachments: items, received_at: date_received } = req.body;
  
  // Extract the API key from the custom header "GENERAL_ACCESS_KEY"
  const apiKey = req.headers["GENERAL_ACCESS_KEY"];
  console.log("Extracted API Key from header:", apiKey);

  if (!apiKey || apiKey !== process.env.GENERAL_ACCESS_KEY) {
    return res.status(401).send("Unauthorized");
  }

  // Get the current formatted date for logging notes in each update
  const current_date_formatted = formatCurrentDate();

  // Group all items by tracking number
  const groupedItems = groupItemsByTracking(items);
  
  let oneOrMoreErrors = false;
  const all_request_history = [];

  // For each tracking number, process the shipment update
  for (const tracking in groupedItems) {
    const items_in_shipment = groupedItems[tracking];

    // Determine shipping method; set to UPS Ground if unknown or not specified.
    let shipping_method = items_in_shipment[0].brightstores_shipping_method;
    if (shipping_method === "Unknown Shipping Method" || shipping_method === "No Shipping Method") {
      shipping_method = "UPS Ground";
    }

    // Create a simplified list of line items with their id and quantity.
    const items_in_shipment_minified = items_in_shipment.map((item) => ({
      id: Number(item.order_items_brightstores_line_item_id),
      quantity: Number(item.shipment_quantity.replace(/,/g, "")),
    }));

    // Create the payload for updating the order.
    // Note includes the current date and the date the data was received.
    const updateOrderPayload = JSON.stringify({
      shipment: {
        tracking_number: tracking,
        send_shipping_confirmation: true,
        ship_date: items_in_shipment[0].formatted_ship_date,
        note: `Updated From Centricity API on ${current_date_formatted} from data received ${date_received}`,
        shipping_method,
        line_items: items_in_shipment_minified,
      },
    });

    let request_history;
    // Try to update order via the updateOrder module.
    try {
      request_history = await updateOrder.updateOrder(items_in_shipment, updateOrderPayload);
    } catch (err) {
      // TODO: Log detailed error information to MongoDB for later analysis.
      // e.g., await client.db("logs").collection("errors").insertOne({ error: err, time: new Date() });
      
      // TODO: Use SendGrid to send detailed error emails for review.
      // e.g.,
      // const msg = {
      //   to: 'your_email@example.com',
      //   from: 'server@example.com',
      //   subject: 'Error in Shipping API updateOrder',
      //   text: `Error detail: ${err.message}`,
      // };
      // await sgMail.send(msg);

      // Catch any errors during the update and mark the response as failed.
      request_history = { response_okay: false, error: err };
    }

    // Record if there was an error during any update
    if (request_history.response_okay === false) {
      oneOrMoreErrors = true;
    }

    // Save each request's history for later review
    all_request_history.push({ request_history });
  }

  // Return the overall outcome: success if no errors, else detailed history.
  if (!oneOrMoreErrors) {
    res.status(200).send("Request Complete");
  } else {
    res.status(400).send(all_request_history);
  }
}

// Define route for handling POST updates
app.post(
  "/brightsites/shipping/tracking/mailparser/order-items/",
  async (req, res) => {
    await handlePostRequest(req, res);
  }
);

// Start the server listening on the defined port (environment variable or 8080)
const port = process.env.PORT || 8080;
app.listen(port, async () => {
  console.log(`Server running on port ${port}`);

  // If RUN_TEST is true in environment settings, simulate a POST request using test data.
  if (run_test === "true") {
    console.log("RUN_TEST is true – invoking POST request with testing data");
    const dummyReq = {
      body: testing_data,
      headers: { "GENERAL_ACCESS_KEY": process.env.GENERAL_ACCESS_KEY },
    };
    // dummyRes mimics a minimal express response object.
    const dummyRes = {
      status(code) {
        this.statusCode = code;
        return this;
      },
      send(data) {
        console.log("Local POST response:", this.statusCode, data);
      },
    };
    await handlePostRequest(dummyReq, dummyRes);
  }
});
